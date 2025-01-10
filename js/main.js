const version = "2.7.0";

const textAreaEl = document.getElementById("textarea");
const tagContainer = document.querySelector(".tags");
const tags = document.querySelectorAll(".tag");
const drumRoll = document.getElementById("drumRoll");
const clapping = document.getElementById("clapping");
const superjackpot = document.getElementById("superjackpot");
const omg = document.getElementById("omg");
const jackpot = document.getElementById("jackpot");
const pistoCounter = document.getElementById("puntiP");
const fattoCounter = document.getElementById("puntiM");
const subtitle = document.getElementById("subtitle");
const title = document.getElementById("title");
const titleText = document.getElementById("titleText");
const btnEl = document.getElementById("btn");
const versionEl = document.getElementById("version");
const leaderboardButton = document.getElementById("leaderboard-button");
const scoreButton = document.getElementById("score-button");
const scoreboardselectorEl = document.getElementById("scoreboard-container");

versionEl.innerText = `v${version}`;
let gameStarted = false;
let disableBonus = false;
let counterP = 0;
let counterM = 0;
let bonuscount = 0;

let isGoing = false;
let isEven = false;

leaderboardButton.addEventListener("click", () => {
  $("#container-selector").toggle();
  $("#scoreboard-container").toggle();
});

$("#totalWinsPisto").text(totalWins.totalWinsPisto);
$("#totalWinsFatto").text(totalWins.totalWinsFatto);

scoreButton.addEventListener("click", () => {
  if (!gameStarted) {
    highlightAll();
  }
});

function pickRandomTag() {
  const unselected = document.querySelectorAll(
    ".unselected:not(.noselectable)"
  );
  const unselectedLength = unselected.length;

  if (unselectedLength == 0) {
    return null;
  }

  return unselected[Math.floor(Math.random() * unselectedLength)];
}

function tagPercent(searchTag = false) {
  tags.forEach((e) => {
    percentages.forEach((percent) => {
      if (e.id === percent.id && e.classList.contains("selected")) {
        const per = percent.per;
        let colorFatto = `rgb(8, 247, 59) `;
        let colorPisto = `rgb(0, 148, 255) `;
        let blackColor = `rgb(0, 0, 0) `;

        if (per >= 53 && per < 56) {
          colorFatto = `rgb(44, 120, 59) `;
          colorPisto = blackColor;
        } else if (per <= 47 && per > 44) {
          colorPisto = `rgb(52, 111, 144) `;
          colorFatto = blackColor;
        } else if (per >= 54) {
          colorFatto = `rgb(36, 62, 21) `;
          colorPisto = blackColor;
        } else if (per <= 44) {
          colorPisto = `rgb(13, 40, 94) `;
          colorFatto = blackColor;
        } else {
          colorFatto = `rgb(0, 0, 0) `;
          colorPisto = `rgb(0, 0, 0) `;
        }

        e.style.border = "5px solid red";
        e.style.backgroundImage = `linear-gradient(to right, ${colorFatto} ${per}%, ${colorPisto} ${per}%)`;
      }
    });
  });

  if (searchTag) {
    const searchTagPercentage = percentages.find(
      (percent) => percent.id === searchTag.id
    );

    if (searchTagPercentage && searchTag.classList.contains("selected")) {
      return {
        pistoPercent: 100 - searchTagPercentage.per,
        fattoPercent: searchTagPercentage.per,
      };
    }
  }

  return null;
}

function highlight(tag, last = false) {
  tag.classList.add("selected");

  if (last) {
    const percentage = tagPercent(tag);

    if (percentage) {
      const fattoPercent = document.createElement("span");
      fattoPercent.classList.add("fattoPercent", "percentBox");
      fattoPercent.innerText = percentage.fattoPercent;

      const pistoPercent = document.createElement("span");
      pistoPercent.classList.add("pistoPercent", "percentBox");
      pistoPercent.innerText = percentage.pistoPercent;

      tag.appendChild(pistoPercent);
      tag.appendChild(fattoPercent);
    }
  }
}

function highlightAll() {
  tags.forEach((tag) => highlight(tag, true));
}

function unhighlight(tag) {
  tag.classList.remove("selected");
}

function randomSelector() {
  tags.forEach((el) => (el.style.backgroundImage = "unset"));
  isGoing = true;
  drumRoll.play();

  const interval = setInterval(() => {
    const randomTag = pickRandomTag();
    highlight(randomTag);
    setTimeout(() => {
      unhighlight(randomTag);
    }, 100);
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    setTimeout(() => {
      const randomTag = pickRandomTag();

      randomTag.classList.remove("unselected");

      let bonus = checkIfBonus(randomTag);
      if (bonus == 3) {
        omg.play();
        superjackpot.play();
        randomTag.classList.add("special_3");
      } else if (bonus == 2) {
        jackpot.play();
        randomTag.classList.add("special_2");
      }

      highlight(randomTag, true);
      isGoing = false;
      tagPercent();
    }, 100);
  }, 9400);
}

document.body.addEventListener("keyup", (event) => {
  if (event.key === "Enter" || event.key === "Backspace") {
    gameStarted = true;
    if (event.key === "Backspace") {
      disableBonus = true;
    } else {
      disableBonus = false;
    }

    scoreButton.disabled = true;
    scoreButton.style.opacity = "0.5";
    scoreButton.style.cursor = "not-allowed";

    tags.forEach((tag) => unhighlight(tag));

    if (!isGoing) {
      const unselected = document.querySelectorAll(".unselected");
      if (unselected.length >= 1) {
        randomSelector();
      }
    }
  }
});

function removeClasses(e) {
  e.classList.remove("pistoWon");
  e.classList.remove("matteoWon");
  e.classList.remove("noselectable");
  e.classList.add("unselected");
}

function assignPoint(evt) {
  evt.preventDefault();
  const { target } = evt;
  target.style.backgroundImage = "unset";
  target.classList.remove("selected");

  if (target.classList.contains("pistoWon")) {
    target.classList.remove("pistoWon");
    counterP--;
  } else if (target.classList.contains("matteoWon")) {
    target.classList.remove("matteoWon");
    counterM--;
  } else {
    if (evt.type === "contextmenu") {
      target.classList.add("matteoWon");
      counterM++;
    } else if (evt.type === "click") {
      target.classList.add("pistoWon");
      counterP++;
    }
  }

  pistoCounter.innerHTML = counterP;
  fattoCounter.innerHTML = counterM;
  checkForWinner();
}

function declareWinner() {
  const winner = counterP > counterM ? "Pisto!!" : "Fatto!!";
  clapping.play();
  document.body.style.backgroundImage = "unset";
  document.body.style.backgroundColor = "black";
  tagContainer.style.display = "none";
  subtitle.style.fontSize = "10rem";
  titleText.style.fontSize = "15rem";
  titleText.style.color = "white";
  titleText.innerHTML = `Vincitore: ${winner}`;
}

tags.forEach((e) => e.addEventListener("click", assignPoint));
tags.forEach((e) => e.addEventListener("contextmenu", assignPoint));

function checkForWinner() {
  if (counterP + counterM >= 12) {
    if (counterP == counterM) {
      tags.forEach((e) => removeClasses(e));
      isEven = true;
      randomSelector();
    } else {
      declareWinner();
    }
  }
}

function checkIfBonus() {
  const random = Math.floor(Math.random() * 100) + 1;

  if (
    bonuscount >= 2 ||
    disableBonus ||
    totalWins.totalWinsPisto + totalWins.totalWinsFatto < 3
  ) {
    return 0;
  }

  if (random >= 1 && random <= 10) {
    bonuscount++;
    return 2;
  }

  if (random > 15 && random <= 20) {
    bonuscount++;
    return 3;
  }

  return 0;
}
