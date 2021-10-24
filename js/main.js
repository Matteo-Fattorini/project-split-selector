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

function tagPercent() {
  tags.forEach((e) => {
    percentages.forEach((percent) => {
      if (e.id == percent.id && e.classList.contains("selected")) {
        per = percent.per;
        e.style.border = "5px solid red";
        e.style.backgroundImage =
          "linear-gradient(" +
          "90deg" +
          "," +
          "rgba(27,204,74,0.8) " +
          per +
          "%" +
          "," +
          "blue " +
          per +
          "%" +
          ")";
      }
    });
  });
}

function highlight(tag) {
  tag.classList.add("selected");
}

function unhighlight(tag) {
  tag.classList.remove("selected");
}

function randomSelector() {
  tags.forEach((el) => (el.style.backgroundImage = "unset"));
  isGoing = true;
  drumRoll.play();
  const times = 94;
  const interval = setInterval(function () {
    const randomTag = pickRandomTag();
    highlight(randomTag);
    setTimeout(function () {
      unhighlight(randomTag);
    }, 100);
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    setTimeout(() => {
      const randomTag = pickRandomTag();
      randomTag.classList.remove("unselected");
      highlight(randomTag);
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
  tagContainer.style.display = "none";
  subtitle.style.fontSize = "10rem";
  titleText.style.fontSize = "15rem";
  titleText.style.color = "tomato";
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
