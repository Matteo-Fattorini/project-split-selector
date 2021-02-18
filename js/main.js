textAreaEl = document.getElementById("textarea");
tagContainer = document.querySelector(".tags");
const tags = document.querySelectorAll(".tag");

btnEl = document.getElementById("btn");
let isGoing = false;

function pickRandomTag() {
  const unselected = document.querySelectorAll(".unselected");

  return unselected[Math.floor(Math.random() * unselected.length)];
}

function tagPercent() {
  tags.forEach((e) => {
    percentages.forEach((percent) => {
      if (e.id == percent.id && e.classList.contains("selected")) {
        per = percent.per;
        e.style.backgroundImage =
          "linear-gradient(" +
          "90deg" +
          "," +
          "rgba(27,204,74,0.8) " +
          per +
          "%" +
          "," +
          "tomato " +
          (per) +
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
  const drumRoll = document.getElementById("drumRoll");
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

tags.forEach((e) =>
  e.addEventListener("click", function (t) {
    console.log(t.target.id);
  })
);
