/**
 * Split Selector Game - Scoreboard Module
 * Handles the display and management of the scoreboard
 */

// DOM Elements
const scoreboardContainerEl = document.getElementById("scoreboard-container");
const scoreboardSubcontainerEl = document.getElementById("scoreboard-subcontainer");

/**
 * Initialize the scoreboard
 */
function initScoreboard() {
  renderScoreboard();
}

/**
 * Render the entire scoreboard
 */
function renderScoreboard() {
  // Clear existing content
  scoreboardSubcontainerEl.innerHTML = "";
  
  // Render each season's scoreboard
  gameData.scoreboard.forEach((season) => {
    createSeasonScoreCard(season);
  });
}

/**
 * Create a score card for a season
 * @param {Array} seasonData - Data for a single season
 */
function createSeasonScoreCard(seasonData) {
  // Create score box container
  const scoreBox = document.createElement("div");
  scoreBox.classList.add("score-box");
  scoreboardSubcontainerEl.appendChild(scoreBox);

  // Create season header
  const seasonInfo = seasonData[0];
  const season = document.createElement("div");
  season.classList.add("score-title");
  
  // Format season header with emoji based on who won
  let seasonEmoji = "🏆";
  if (seasonInfo.pisto > seasonInfo.fatto) {
    seasonEmoji = "🔵"; // Pisto won
  } else if (seasonInfo.fatto > seasonInfo.pisto) {
    seasonEmoji = "🟢"; // Fatto won
  } else {
    seasonEmoji = "🤝"; // Tie
  }
  
  season.innerHTML = `${seasonEmoji} Season ${seasonInfo.season} <div class="season-score">Pisto: <span class="pisto-score">${seasonInfo.pisto}</span> Fatto: <span class="fatto-score">${seasonInfo.fatto}</span></div>`;
  scoreBox.appendChild(season);

  // Create container for location percentages
  const scorevalues = document.createElement("div");
  scorevalues.classList.add("score-values");

  // Add each location's stats
  seasonData.forEach((value) => {
    if (value.id) {
      // Find the location details from DEFAULT_PERCENTAGES
      const locationDetails = gameData.percentages.find(loc => loc.id === value.id) || { label: value.id };
      
      const scorevalue = document.createElement("div");
      scorevalue.classList.add("score-value");

      // Score title with location name
      const scoretitle = document.createElement("div");
      scoretitle.classList.add("score-value-title");

      // Add color class based on percentage
      if (value.per >= 53) {
        scoretitle.classList.add("score-value-title-fatto");
      } else if (value.per <= 47) {
        scoretitle.classList.add("score-value-title-pisto");
      }

      // Use label if available, otherwise use ID
      scoretitle.innerText = locationDetails.label || value.id;
      scorevalue.appendChild(scoretitle);

      // Create Pisto percentage display
      const scorepisto = document.createElement("div");
      scorepisto.classList.add("score-value-pisto");
      scorepisto.innerHTML = `Pisto - <strong>${100 - value.per}%</strong>`;
      scorevalue.appendChild(scorepisto);

      // Create Fatto percentage display
      const scorefatto = document.createElement("div");
      scorefatto.classList.add("score-value-fatto");
      scorefatto.innerHTML = `Fatto - <strong>${value.per}%</strong>`;
      scorevalue.appendChild(scorefatto);

      // Add a win indicator if percentage is significantly different
      if (value.per >= 55) {
        const winBadge = document.createElement("div");
        winBadge.classList.add("win-badge", "fatto-badge");
        winBadge.innerHTML = '<i class="fas fa-trophy"></i>';
        scorevalue.appendChild(winBadge);
      } else if (value.per <= 45) {
        const winBadge = document.createElement("div");
        winBadge.classList.add("win-badge", "pisto-badge");
        winBadge.innerHTML = '<i class="fas fa-trophy"></i>';
        scorevalue.appendChild(winBadge);
      }

      scorevalues.appendChild(scorevalue);
    }
  });

  scoreBox.appendChild(scorevalues);
}

// Initialize the scoreboard when DOM is ready
document.addEventListener("DOMContentLoaded", initScoreboard);
