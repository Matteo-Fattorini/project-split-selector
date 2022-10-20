textAreaEl = document.getElementById("textarea");
tagContainer = document.querySelector(".tags");
tags = document.querySelectorAll(".tag");
drumRoll = document.getElementById("drumRoll");
clapping = document.getElementById("clapping");
pistoCounter = document.getElementById("puntiP");
fattoCounter = document.getElementById("puntiM");
subtitle = document.getElementById("subtitle");
title = document.getElementById("title");
titleText = document.getElementById("titleText");
btnEl = document.getElementById("btn");

let counterP = 0;
let counterM = 0;

let isGoing = false;
let isEven = false;

function pickRandomTag() {
  const unselected = document.querySelectorAll(
    ".unselected:not(.noselectable)"
  );

  return unselected[Math.floor(Math.random() * unselected.length)];
}

function tagPercent(searchTag = false) {
  tags.forEach((e) => {
    percentages.forEach((percent) => {
      if (e.id == percent.id && e.classList.contains("selected")) {
        per = percent.per;

        colorFatto = `rgb(8, 247, 59) `;
        colorPisto = `rgb(0, 148, 255) `;

        if (per >= 55 && per < 60) {
          colorFatto = `rgb(21, 201, 59) `;
        } else if (per <= 45 && per > 40) {
          colorPisto = `rgb(52, 111, 144) `;
        } else if (per > 60) {
          colorFatto = `rgb(36, 62, 21) `;
        } else if (per < 40) {
          colorPisto = `rgb(13, 40, 94) `;
        }

        e.style.border = "5px solid red";
        e.style.backgroundImage = `linear-gradient(to right, ${colorFatto} ${per}%, ${colorPisto} ${per}%)`;
      }
      if (searchTag) {
        if (
          percent.id == searchTag.id &&
          searchTag.classList.contains("selected")
        ) {
          result = {
            pistoPercent: 100 - percent.per,
            fattoPercent: percent.per,
          };
        }
      }
    });
  });

  if (result) return result;
}

function highlight(tag, last = false) {
  tag.classList.add("selected");
  if (last) {
    percentage = tagPercent(tag);

    fattoPercent = document.createElement("span");
    fattoPercent.classList.add("fattoPercent", "percentBox");
    fattoPercent.innerText = percentage.fattoPercent;

    pistoPercent = document.createElement("span");
    pistoPercent.classList.add("pistoPercent", "percentBox");
    pistoPercent.innerText = percentage.pistoPercent;

    tag.appendChild(pistoPercent);
    tag.appendChild(fattoPercent);
  }
}

function unhighlight(tag) {
  tag.classList.remove("selected");
}

function randomSelector() {
  tags.forEach((el) => (el.style.backgroundImage = "unset"));
  isGoing = true;
  drumRoll.play();
  const times = 94;
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
      highlight(randomTag, true);
      isGoing = false;
      tagPercent();
    }, 100);
  }, times * 100);
}

document.body.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    tags.forEach((e) => unhighlight(e));
    if (!isGoing) {
      const unselected = document.querySelectorAll(".unselected");
      if (unselected.length > 1) {
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
  evt.target.style.backgroundImage = "unset";
  evt.target.classList.remove("selected");
  if (evt.target.classList.contains("pistoWon")) {
    evt.target.classList.remove("pistoWon");
    counterP--;
  } else if (evt.target.classList.contains("matteoWon")) {
    evt.target.classList.remove("matteoWon");
    counterM--;
  } else {
    if (evt.type == "contextmenu") {
      evt.target.classList.add("matteoWon");
      counterM++;
    } else if (evt.type == "click") {
      evt.target.classList.add("pistoWon");
      counterP++;
    }
  }
  pistoCounter.innerHTML = counterP;
  fattoCounter.innerHTML = counterM;
  checkForWinner();
}

function declareWinner() {
  let winner = counterP > counterM ? "Pisto!!" : "Fatto!!";
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
