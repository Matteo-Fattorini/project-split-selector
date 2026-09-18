const version = "2.10.0";

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
const SPIN_DURATION_MS = 9400; // durata del rullo di tamburi
const SPIN_TICK_MS = 100; // velocità con cui le card lampeggiano
const BONUS_X2_CHANCE = 15; // % di probabilità di un bonus x2
const BONUS_X3_CHANCE = 5; // % di probabilità di un bonus x3

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------
const tags = Array.from(document.querySelectorAll(".tag"));
const drumRoll = document.getElementById("drumRoll");
const clapping = document.getElementById("clapping");
const superjackpot = document.getElementById("superjackpot");
const omg = document.getElementById("omg");
const jackpot = document.getElementById("jackpot");
const pistoCounter = document.getElementById("puntiP");
const fattoCounter = document.getElementById("puntiM");
const titleText = document.getElementById("titleText");
const versionEl = document.getElementById("version");

// Numero totale di circuiti, derivato dai tag presenti in pagina.
const totalCircuits = tags.length;

versionEl.textContent = `v${version}`;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let disableBonus = false;
let counterP = 0;
let counterM = 0;
let isGoing = false;
let isTiebreak = false;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function play(audio) {
  audio.currentTime = 0;
  const promise = audio.play();
  if (promise && typeof promise.catch === "function") {
    // Le policy di autoplay del browser possono rifiutare la riproduzione.
    promise.catch(() => {});
  }
}

function updateScore() {
  pistoCounter.textContent = counterP;
  fattoCounter.textContent = counterM;
}

function getPercent(tag) {
  const entry = percentages.find((percent) => percent.id === tag.id);
  if (!entry) return null;
  return { pistoPercent: 100 - entry.per, fattoPercent: entry.per };
}

function pickRandomTag() {
  const unselected = tags.filter((tag) => tag.classList.contains("unselected"));
  if (unselected.length === 0) return null;
  return unselected[Math.floor(Math.random() * unselected.length)];
}

function removePercentBoxes(tag) {
  tag.querySelectorAll(".percentBox").forEach((el) => el.remove());
}

function highlight(tag, last = false) {
  tag.classList.add("selected");

  if (!last) return;

  const percentage = getPercent(tag);
  if (!percentage) return;

  removePercentBoxes(tag);

  const fattoPercent = document.createElement("span");
  fattoPercent.classList.add("fattoPercent", "percentBox");
  fattoPercent.textContent = percentage.fattoPercent;

  const pistoPercent = document.createElement("span");
  pistoPercent.classList.add("pistoPercent", "percentBox");
  pistoPercent.textContent = percentage.pistoPercent;

  tag.appendChild(pistoPercent);
  tag.appendChild(fattoPercent);
}

function unhighlight(tag) {
  tag.classList.remove("selected");
}

function checkIfBonus() {
  if (disableBonus) return 0;

  const random = Math.floor(Math.random() * 100) + 1;
  if (random <= BONUS_X2_CHANCE) return 2;
  if (random <= BONUS_X2_CHANCE + BONUS_X3_CHANCE) return 3;
  return 0;
}

// ---------------------------------------------------------------------------
// Spin
// ---------------------------------------------------------------------------
function randomSelector() {
  isGoing = true;
  play(drumRoll);

  const interval = setInterval(() => {
    const randomTag = pickRandomTag();
    if (!randomTag) return;
    highlight(randomTag);
    setTimeout(() => unhighlight(randomTag), SPIN_TICK_MS);
  }, SPIN_TICK_MS);

  setTimeout(() => {
    clearInterval(interval);

    setTimeout(() => {
      const randomTag = pickRandomTag();
      if (!randomTag) {
        isGoing = false;
        return;
      }

      randomTag.classList.remove("unselected");

      const bonus = checkIfBonus();
      if (bonus === 3) {
        play(omg);
        play(superjackpot);
        randomTag.classList.add("special_3");
      } else if (bonus === 2) {
        play(jackpot);
        randomTag.classList.add("special_2");
      }

      highlight(randomTag, true);
      isGoing = false;
    }, SPIN_TICK_MS);
  }, SPIN_DURATION_MS);
}

document.body.addEventListener("keyup", (event) => {
  if (event.key !== "Enter" && event.key !== "Backspace") return;
  if (isGoing) return;

  disableBonus = event.key === "Backspace";

  tags.forEach(unhighlight);

  if (pickRandomTag()) {
    randomSelector();
  }
});

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------
function resetTag(tag) {
  tag.classList.remove("pistoWon", "matteoWon", "selected", "special_2", "special_3");
  removePercentBoxes(tag);
  tag.classList.add("unselected");
}

function pointValueOf(tag) {
  if (tag.classList.contains("special_3")) return 3;
  if (tag.classList.contains("special_2")) return 2;
  return 1;
}

function assignPoint(evt) {
  evt.preventDefault();

  // currentTarget: il click può arrivare da un elemento figlio (es. box percentuale)
  const tag = evt.currentTarget;
  tag.classList.remove("selected");

  const pointValue = pointValueOf(tag);

  if (tag.classList.contains("pistoWon")) {
    tag.classList.remove("pistoWon");
    counterP -= pointValue;
  } else if (tag.classList.contains("matteoWon")) {
    tag.classList.remove("matteoWon");
    counterM -= pointValue;
  } else if (evt.type === "contextmenu") {
    tag.classList.add("matteoWon");
    counterM += pointValue;
  } else if (evt.type === "click") {
    tag.classList.add("pistoWon");
    counterP += pointValue;
  }

  updateScore();
  checkForWinner();
}

tags.forEach((tag) => {
  tag.addEventListener("click", assignPoint);
  tag.addEventListener("contextmenu", assignPoint);
});

function declareWinner() {
  const pistoWins = counterP > counterM;
  const winner = pistoWins ? "Pisto" : "Fatto";

  play(clapping);
  document.body.classList.add("winner", pistoWins ? "winner-pisto" : "winner-fatto");
  titleText.textContent = `Vincitore: ${winner}!!`;
}

function checkForWinner() {
  const assignedCircuits = tags.filter(
    (tag) => tag.classList.contains("pistoWon") || tag.classList.contains("matteoWon")
  ).length;

  // Nello spareggio vince chi segna per primo.
  if (isTiebreak && assignedCircuits >= 1) {
    declareWinner();
    return;
  }

  if (assignedCircuits < totalCircuits) return;

  if (counterP === counterM) {
    // Parità: si resetta tutto e si estrae un circuito di spareggio.
    tags.forEach(resetTag);
    counterP = 0;
    counterM = 0;
    updateScore();
    isTiebreak = true;
    randomSelector();
  } else {
    declareWinner();
  }
}
