//scoreboard
scoreboard.forEach((score) => {
  const scoreBox = document.createElement("div");
  scoreBox.classList.add("score-box");

  scoreboardselectorEl.appendChild(scoreBox);

  const season = document.createElement("div");
  season.classList.add("score-title");
  season.innerText = `Season ${score[0].season} \n\n Pisto: ${score[0].pisto} Fatto: ${score[0].fatto} \n\n`;

  scoreBox.appendChild(season);

  const scorevalues = document.createElement("div");
  scorevalues.classList.add("score-values");

  score.forEach((value) => {
    if (value.id) {
      const scorevalue = document.createElement("div");
      scorevalue.classList.add("score-value");

      const scoretitle = document.createElement("div");
      scoretitle.classList.add("score-value-title");

      if (value.per >= 55) {
        scoretitle.classList.add("score-value-title-fatto");
      } else if (value.per <= 45) {
        scoretitle.classList.add("score-value-title-pisto");
      }

      scoretitle.innerText = value.id;

      scorevalue.appendChild(scoretitle);

      const scorepisto = document.createElement("div");
      scorepisto.classList.add("score-value-pisto");
      scorepisto.innerText = `Pisto - ${100 - value.per}%`;

      scorevalue.appendChild(scorepisto);

      const scorefatto = document.createElement("div");
      scorefatto.classList.add("score-value-fatto");
      scorefatto.innerText = `Fatto - ${value.per}%`;

      scorevalue.appendChild(scorefatto);

      scorevalues.appendChild(scorevalue);
    }
  });

  scoreBox.appendChild(scorevalues);
});

//end scoreboard
