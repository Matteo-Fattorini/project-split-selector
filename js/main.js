/**
 * Split Selector Game - Main JavaScript
 * Version 3.0.0
 */

// Game state variables
let gameStarted = false;
let disableBonus = false;
let counterP = 0;
let counterM = 0;
let bonuscount = 0;
let isGoing = false;
let isEven = false;
let locationResults = [];
let pendingPointAssignment = null;

// DOM Elements
const elements = {
  // Audio elements
  drumRoll: document.getElementById("drumRoll"),
  clapping: document.getElementById("clapping"),
  superjackpot: document.getElementById("superjackpot"),
  omg: document.getElementById("omg"),
  jackpot: document.getElementById("jackpot"),
  
  // Game display elements
  pistoCounter: document.getElementById("puntiP"),
  fattoCounter: document.getElementById("puntiM"),
  subtitle: document.getElementById("subtitle"),
  title: document.getElementById("title"),
  titleText: document.getElementById("titleText"),
  versionEl: document.getElementById("version"),
  versionFooter: document.getElementById("version-footer"),
  
  // Containers
  tagContainer: document.querySelector(".tags"),
  tags: document.querySelectorAll(".tag"),
  
  // UI controls
  leaderboardButton: document.getElementById("leaderboard-button"),
  resetButton: document.getElementById("reset-button"),
  resetSaveButton: document.getElementById("reset-save-button"),
  helpButton: document.getElementById("help-button"),
  playAgainButton: document.getElementById("play-again"),
  
  // Modals and containers
  helpModal: document.getElementById("help-modal"),
  closeHelpButton: document.querySelector(".close-button"),
  scoreboardContainerEl: document.getElementById("scoreboard-container"),
  containerSelector: document.getElementById("container-selector"),
  winnerAnnouncement: document.getElementById("winner-announcement"),
  winnerName: document.getElementById("winner-name"),
  
  // Point confirmation modal
  pointConfirmModal: document.getElementById("point-confirm-modal"),
  confirmLocationName: document.querySelector(".location-name"),
  confirmYes: document.getElementById("confirm-yes"),
  confirmNo: document.getElementById("confirm-no")
};

/**
 * Initialize the game
 */
function initGame() {
  // Set version number
  const versionText = `v${gameData.APP_CONFIG.version}`;
  elements.versionEl.innerText = versionText;
  elements.versionFooter.innerText = versionText;
  
  // Display total wins from data
  updateWinsDisplay();
  
  // Setup event listeners
  setupEventListeners();
  
  // Show win percentages by default on all tags
  showAllPercentages();
  
  console.log("Split Selector initialized successfully!");
}

/**
 * Show win percentages on all tags by default
 */
function showAllPercentages() {
  elements.tags.forEach((tag) => {
    // Add the background gradient based on percentages
    gameData.percentages.forEach((percent) => {
      if (tag.id === percent.id) {
        const per = percent.per;
        let colorFatto = `rgb(8, 247, 59)`;
        let colorPisto = `rgb(0, 148, 255)`;
        let blackColor = `rgb(0, 0, 0)`;

        if (per >= 53 && per < 56) {
          colorFatto = `rgb(44, 120, 59)`;
          colorPisto = blackColor;
        } else if (per <= 47 && per > 44) {
          colorPisto = `rgb(52, 111, 144)`;
          colorFatto = blackColor;
        } else if (per >= 54) {
          colorFatto = `rgb(36, 62, 21)`;
          colorPisto = blackColor;
        } else if (per <= 44) {
          colorPisto = `rgb(13, 40, 94)`;
          colorFatto = blackColor;
        } else {
          colorFatto = `rgb(0, 0, 0)`;
          colorPisto = `rgb(0, 0, 0)`;
        }

        // Add percentage indicators
        const fattoPercent = document.createElement("span");
        fattoPercent.classList.add("fattoPercent", "percentBox");
        fattoPercent.innerText = per;

        const pistoPercent = document.createElement("span");
        pistoPercent.classList.add("pistoPercent", "percentBox");
        pistoPercent.innerText = 100 - per;

        tag.appendChild(pistoPercent);
        tag.appendChild(fattoPercent);

        // Apply gradient visualization
        tag.style.backgroundImage = `linear-gradient(to right, ${colorFatto} ${per}%, ${colorPisto} ${per}%)`;
      }
    });
  });
}

/**
 * Update the total wins display
 */
function updateWinsDisplay() {
  $("#totalWinsPisto").text(gameData.totalWins.totalWinsPisto);
  $("#totalWinsFatto").text(gameData.totalWins.totalWinsFatto);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Navigation button
  elements.leaderboardButton.addEventListener("click", toggleLeaderboard);
  
  // Control buttons
  elements.resetButton.addEventListener("click", handleResetGame);
  elements.resetSaveButton.addEventListener("click", handleResetSaveData);
  elements.helpButton.addEventListener("click", openHelpModal);
  elements.closeHelpButton.addEventListener("click", closeHelpModal);
  elements.playAgainButton.addEventListener("click", handlePlayAgain);
  
  // Tag click events
  elements.tags.forEach(tag => {
    tag.addEventListener("click", handlePointAssignmentClick);
    tag.addEventListener("contextmenu", handlePointAssignmentClick);
  });
  
  // Confirmation modal buttons
  elements.confirmYes.addEventListener("click", confirmPointAssignment);
  elements.confirmNo.addEventListener("click", cancelPointAssignment);
  
  // Keyboard events
  document.body.addEventListener("keyup", handleKeyPress);
}

/**
 * Toggle leaderboard visibility
 */
function toggleLeaderboard() {
  elements.containerSelector.style.display = 
    elements.containerSelector.style.display === "none" ? "block" : "none";
  
  elements.scoreboardContainerEl.style.display = 
    elements.scoreboardContainerEl.style.display === "none" ? "block" : "none";
}

/**
 * Reset the game state
 */
function handleResetGame() {
  if (confirm("Are you sure you want to reset the current game?")) {
    const resetValues = gameData.resetGame();
    
    // Reset game state variables
    counterP = resetValues.counterP;
    counterM = resetValues.counterM;
    bonuscount = resetValues.bonuscount;
    gameStarted = false;
    disableBonus = false;
    isGoing = false;
    isEven = false;
    locationResults = [];
    
    // Update UI elements
    elements.pistoCounter.innerHTML = counterP;
    elements.fattoCounter.innerHTML = counterM;
    
    // Reset title styling without breaking dark theme
    elements.subtitle.style.fontSize = "";
    elements.titleText.style.fontSize = "";
    elements.titleText.style.color = "";
    elements.titleText.innerHTML = "SPLIT SELECTOR";
    
    // Show tag container
    elements.tagContainer.style.display = "grid";
    
    // Remove celebration class if present
    document.body.classList.remove("celebration");
    
    // Keep dark theme intact - do NOT modify background properties
    
    // Hide winner announcement if visible
    elements.winnerAnnouncement.classList.remove("show");
    
    // Re-display percentages after reset
    showAllPercentages();
  }
}

/**
 * Handle reset save data button click
 */
function handleResetSaveData() {
  if (confirm("Are you sure you want to reset all saved data? This will restore the original percentages and win counts.")) {
    // Call the resetSaveData function
    gameData.resetSaveData();
    
    // Re-initialize the game with reset data
    updateWinsDisplay();
    handleResetGame();
    
    // Provide feedback to the user
    alert("All saved data has been reset to original values.");
  }
}

/**
 * Open help modal
 */
function openHelpModal() {
  elements.helpModal.classList.add("active");
  setTimeout(() => {
    elements.helpModal.querySelector(".modal-content").style.opacity = 1;
    elements.helpModal.querySelector(".modal-content").style.transform = "translateY(0)";
  }, 10);
}

/**
 * Close help modal
 */
function closeHelpModal() {
  const modalContent = elements.helpModal.querySelector(".modal-content");
  modalContent.style.opacity = 0;
  modalContent.style.transform = "translateY(30px)";
  
  setTimeout(() => {
    elements.helpModal.classList.remove("active");
  }, 300);
}

/**
 * Handle play again button click
 */
function handlePlayAgain() {
  handleResetGame();
  elements.winnerAnnouncement.classList.remove("show");
}

/**
 * Pick a random unselected tag
 * @returns {Element|null} The random tag or null if none available
 */
function pickRandomTag() {
  const unselected = document.querySelectorAll(".unselected:not(.noselectable)");
  const unselectedLength = unselected.length;

  if (unselectedLength === 0) {
    return null;
  }

  return unselected[Math.floor(Math.random() * unselectedLength)];
}

/**
 * Apply percentage styling to tags and return percentage info
 * @param {Element} [searchTag] - Specific tag to get percentages for
 * @returns {Object|null} Percentage object or null
 */
function tagPercent(searchTag = null) {
  elements.tags.forEach((tag) => {
    gameData.percentages.forEach((percent) => {
      if (tag.id === percent.id && tag.classList.contains("selected")) {
        const per = percent.per;
        // Initialize colors for the gradient
        let colorFatto;
        let colorPisto;
        let blackColor = `rgb(0, 0, 0)`;

        if (per >= 53 && per < 56) {
          colorFatto = `rgb(44, 120, 59)`;
          colorPisto = blackColor;
        } else if (per <= 47 && per > 44) {
          colorPisto = `rgb(52, 111, 144)`;
          colorFatto = blackColor;
        } else if (per >= 54) {
          colorFatto = `rgb(36, 62, 21)`;
          colorPisto = blackColor;
        } else if (per <= 44) {
          colorPisto = `rgb(13, 40, 94)`;
          colorFatto = blackColor;
        } else {
          colorFatto = `rgb(0, 0, 0)`;
          colorPisto = `rgb(0, 0, 0)`;
        }

        tag.style.border = "5px solid red";
        tag.style.backgroundImage = `linear-gradient(to right, ${colorFatto} ${per}%, ${colorPisto} ${per}%)`;
      }
    });
  });

  if (searchTag) {
    const searchTagPercentage = gameData.percentages.find(
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

/**
 * Highlight a tag with selection styling
 * @param {Element} tag - Tag to highlight
 * @param {Boolean} [last=false] - Whether this is the final selection
 */
function highlight(tag, last = false) {
  if (!tag) return;
  
  tag.classList.add("selected");

  if (last) {
    const percentage = tagPercent(tag);

    if (percentage) {
      // Clean up any existing percentage boxes first
      const existingBoxes = tag.querySelectorAll('.percentBox');
      existingBoxes.forEach(box => box.remove());
      
      // Create new percentage boxes
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

/**
 * Remove highlight from a tag
 * @param {Element} tag - Tag to unhighlight
 */
function unhighlight(tag) {
  if (!tag) return;
  tag.classList.remove("selected");
}

/**
 * Start the random selection animation and process
 */
function randomSelector() {
  elements.tags.forEach((el) => (el.style.backgroundImage = "unset"));
  isGoing = true;
  elements.drumRoll.play();

  // Animation interval for selection
  const interval = setInterval(() => {
    const randomTag = pickRandomTag();
    highlight(randomTag);
    setTimeout(() => {
      unhighlight(randomTag);
    }, 100);
  }, 100);

  // Stop the animation and make final selection
  setTimeout(() => {
    clearInterval(interval);
    setTimeout(() => {
      const randomTag = pickRandomTag();
      if (!randomTag) return;

      randomTag.classList.remove("unselected");

      // Check for bonus
      let bonus = checkIfBonus();
      
      // Store the bonus value with the location for later percentage calculations
      let locationResult = locationResults.find(item => item.id === randomTag.id);
      if (!locationResult) {
        locationResult = { id: randomTag.id, winner: null, bonus: bonus > 0 ? bonus : 1 };
        locationResults.push(locationResult);
      } else {
        locationResult.bonus = bonus > 0 ? bonus : 1;
      }
      
      // Apply progressively epic bonus effects
      if (bonus === 4) {
        // 4x ULTRA BONUS - Ultra epic effect
        playEpicBonusSound(4);
        randomTag.classList.add("special_4");
        
        // Add global effects for most epic bonus
        document.body.classList.add("celebration");
        setTimeout(() => document.body.classList.remove("celebration"), 10000);
        
        // Create flying emojis in background
        createFlyingEmojis("🔥", 15);
        createFlyingEmojis("⭐", 15);
        createFlyingEmojis("💯", 10);
        
        // Shake subtitle for dramatic effect
        elements.subtitle.style.animation = "card-epic 0.5s 3";
        setTimeout(() => elements.subtitle.style.animation = "", 1500);
      } 
      else if (bonus === 3) {
        // 3x MEGA BONUS - Very impressive effect
        playEpicBonusSound(3);
        randomTag.classList.add("special_3");
        
        // Create flying emojis for mega bonus
        createFlyingEmojis("⭐", 10);
        createFlyingEmojis("🎯", 5);
        
        // Flash effect on subtitle
        elements.subtitle.style.animation = "card-pulse 0.4s 3";
        setTimeout(() => elements.subtitle.style.animation = "", 1200);
      } 
      else if (bonus === 2) {
        // 2x BONUS - Cool but more modest effect
        elements.jackpot.play();
        randomTag.classList.add("special_2");
        
        // Create a few flying emojis
        createFlyingEmojis("⭐", 5);
      }

      highlight(randomTag, true);
      isGoing = false;
      tagPercent();
    }, 100);
  }, 9400);
}

/**
 * Play epic bonus sound combinations
 * @param {Number} bonusLevel - Level of the bonus (3 or 4)
 */
function playEpicBonusSound(bonusLevel) {
  elements.omg.play();
  
  // For maximum effect, layer sounds with slight delay for 4x bonus
  if (bonusLevel === 4) {
    setTimeout(() => elements.jackpot.play(), 300);
    setTimeout(() => elements.superjackpot.play(), 600);
  } else {
    elements.superjackpot.play();
  }
}

/**
 * Create flying emojis in the background
 * @param {String} emoji - Emoji character to display
 * @param {Number} count - Number of emojis to create
 */
function createFlyingEmojis(emoji, count) {
  for (let i = 0; i < count; i++) {
    const emojiEl = document.createElement('div');
    
    // Generate random values for animation
    const xOffset = `${Math.random() * 200 - 100}px`;
    const yOffset = `${Math.random() * -300 - 100}px`;
    const rotateDeg = `${Math.random() * 360}deg`;
    const scale = `${Math.random() + 0.5}`;
    const duration = `${Math.random() * 3 + 2}s`;
    
    // Set emoji content and styling
    emojiEl.textContent = emoji;
    emojiEl.style.position = 'fixed';
    emojiEl.style.fontSize = `${Math.random() * 2 + 1}rem`;
    emojiEl.style.left = `${Math.random() * 100}vw`;
    emojiEl.style.top = `${Math.random() * 100}vh`;
    emojiEl.style.opacity = '0';
    emojiEl.style.zIndex = '1000';
    emojiEl.style.pointerEvents = 'none';
    
    // Set CSS variables for the animation
    emojiEl.style.setProperty('--x-offset', xOffset);
    emojiEl.style.setProperty('--y-offset', yOffset);
    emojiEl.style.setProperty('--rotate-deg', rotateDeg);
    emojiEl.style.setProperty('--scale', scale);
    
    // Apply the animation
    emojiEl.style.animation = `flyEmoji ${duration} forwards`;
    
    document.body.appendChild(emojiEl);
    
    // Clean up emoji element after animation
    setTimeout(() => {
      emojiEl.remove();
    }, parseFloat(duration) * 1000);
  }
}

/**
 * Handle keyboard events
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyPress(event) {
  if (event.key === "Enter" || event.key === "Backspace") {
    gameStarted = true;
    if (event.key === "Backspace") {
      disableBonus = true;
    } else {
      disableBonus = false;
    }

    elements.tags.forEach((tag) => {
      // Remove only the selected class, not the percentages
      tag.classList.remove("selected");
    });

    if (!isGoing) {
      const unselected = document.querySelectorAll(".unselected");
      if (unselected.length >= 1) {
        randomSelector();
      }
    }
  }
}

/**
 * Reset classes on a tag element
 * @param {Element} element - Tag element to reset
 */
function removeClasses(element) {
  element.classList.remove("pistoWon");
  element.classList.remove("matteoWon");
  element.classList.remove("noselectable");
  element.classList.add("unselected");
  
  // Don't clear the background styling for percentages
}

/**
 * Show the point confirmation modal
 * @param {String} locationName - Name of the location
 */
function showPointConfirmationModal(locationName) {
  const playerName = pendingPointAssignment.eventType === "contextmenu" ? "Fatto" : "Pisto";
  elements.confirmLocationName.textContent = locationName;
  
  // Update the confirmation text to show player name
  document.getElementById("player-name").textContent = playerName;
  
  elements.pointConfirmModal.style.display = "flex";
  
  // Add animation classes
  setTimeout(() => {
    elements.pointConfirmModal.classList.add("active");
  }, 10);
}

/**
 * Hide the point confirmation modal
 */
function hidePointConfirmationModal() {
  elements.pointConfirmModal.classList.remove("active");
  
  setTimeout(() => {
    elements.pointConfirmModal.style.display = "none";
  }, 300);
}

/**
 * Handle point assignment click
 * @param {Event} evt - Click or contextmenu event
 */
function handlePointAssignmentClick(evt) {
  evt.preventDefault();

  // Check if the click was on a percentage box - if so, ignore the click
  if (evt.target.classList.contains('percentBox') || 
      evt.target.classList.contains('pistoPercent') || 
      evt.target.classList.contains('fattoPercent')) {
    return;
  }

  const { target } = evt;
  
  // Don't allow point assignment during animation
  if (isGoing) return;
  
  // Check if the tag already has a winner assigned
  const hasWinner = target.classList.contains("pistoWon") || target.classList.contains("matteoWon");
  
  // Store the event and target for later use
  pendingPointAssignment = {
    target,
    eventType: evt.type,
    hasWinner
  };
  
  // Get the location name to display in the confirmation
  // Clone the node and remove percentage elements to get clean text
  const cloneNode = target.cloneNode(true);
  const percentageElements = cloneNode.querySelectorAll('.percentBox, .pistoPercent, .fattoPercent');
  percentageElements.forEach(el => el.remove());
  const locationName = cloneNode.textContent.trim();
  
  // Show confirmation modal
  showPointConfirmationModal(locationName);
}

/**
 * Confirm point assignment from the modal
 */
function confirmPointAssignment() {
  if (pendingPointAssignment) {
    const { target, eventType, hasWinner } = pendingPointAssignment;
    
    // Actually assign the point
    processPointAssignment(target, eventType, hasWinner);
    
    // Hide the confirmation modal
    hidePointConfirmationModal();
    
    // Clear the pending assignment
    pendingPointAssignment = null;
  }
}

/**
 * Cancel point assignment
 */
function cancelPointAssignment() {
  // Hide the confirmation modal
  hidePointConfirmationModal();
  
  // Clear the pending assignment
  pendingPointAssignment = null;
}

/**
 * Process the actual point assignment after confirmation
 * @param {Element} target - The tag element
 * @param {String} eventType - The event type ('click' or 'contextmenu')
 * @param {Boolean} hasWinner - Whether the tag already has a winner
 */
function processPointAssignment(target, eventType, hasWinner) {
  // We want to keep the background with percentages
  target.classList.remove("selected");

  // Track location results for statistics
  let locationResult = locationResults.find(item => item.id === target.id);
  if (!locationResult) {
    locationResult = { id: target.id, winner: null };
    locationResults.push(locationResult);
  }

  // Toggle class or assign new winner
  if (target.classList.contains("pistoWon")) {
    target.classList.remove("pistoWon");
    counterP--;
    locationResult.winner = null;
    
    // Restore the original percentage background
    showPercentageBackground(target);
  } else if (target.classList.contains("matteoWon")) {
    target.classList.remove("matteoWon");
    counterM--;
    locationResult.winner = null;
    
    // Restore the original percentage background
    showPercentageBackground(target);
  } else {
    if (eventType === "contextmenu") {
      target.classList.add("matteoWon");
      counterM++;
      locationResult.winner = "fatto";
      
      // Apply fatto color while keeping percentages visible
      target.style.backgroundColor = "var(--fatto-color)";
      target.style.backgroundImage = "none";
    } else if (eventType === "click") {
      target.classList.add("pistoWon");
      counterP++;
      locationResult.winner = "pisto";
      
      // Apply pisto color while keeping percentages visible
      target.style.backgroundColor = "var(--pisto-color)";
      target.style.backgroundImage = "none";
    }
  }

  target.classList.remove("unselected");
  target.classList.add("noselectable");

  // Update score display
  elements.pistoCounter.innerHTML = counterP;
  elements.fattoCounter.innerHTML = counterM;
  
  // Check if game has a winner
  checkForWinner();
}

/**
 * Show percentage background for a tag
 * @param {Element} tag - Tag to show percentage for
 */
function showPercentageBackground(tag) {
  gameData.percentages.forEach((percent) => {
    if (tag.id === percent.id) {
      const per = percent.per;
      let colorFatto = `rgb(8, 247, 59)`;
      let colorPisto = `rgb(0, 148, 255)`;
      let blackColor = `rgb(0, 0, 0)`;

      if (per >= 53 && per < 56) {
        colorFatto = `rgb(44, 120, 59)`;
        colorPisto = blackColor;
      } else if (per <= 47 && per > 44) {
        colorPisto = `rgb(52, 111, 144)`;
        colorFatto = blackColor;
      } else if (per >= 54) {
        colorFatto = `rgb(36, 62, 21)`;
        colorPisto = blackColor;
      } else if (per <= 44) {
        colorPisto = `rgb(13, 40, 94)`;
        colorFatto = blackColor;
      } else {
        colorFatto = `rgb(0, 0, 0)`;
        colorPisto = `rgb(0, 0, 0)`;
      }

      // Reset background color and apply gradient
      tag.style.backgroundColor = "";
      tag.style.backgroundImage = `linear-gradient(to right, ${colorFatto} ${per}%, ${colorPisto} ${per}%)`;
    }
  });
}

/**
 * Show winner announcement with animation
 * @param {String} winner - Name of winner
 */
function showWinnerAnnouncement(winner) {
  elements.winnerName.textContent = winner;
  elements.winnerAnnouncement.classList.add("show");
  elements.clapping.play();
  
  // Confetti effect (simulated with a class)
  document.body.classList.add("celebration");
  
  // Save winner to stats
  const winnerKey = winner.toLowerCase().includes("pisto") ? "pisto" : "fatto";
  gameData.updateTotalWins(winnerKey);
  
  // Add new season data
  gameData.addNewSeason(counterP, counterM, locationResults);
}

/**
 * Declare the winner of the game
 */
function declareWinner() {
  const winner = counterP > counterM ? "Pisto!!" : "Fatto!!";
  showWinnerAnnouncement(winner);
}

/**
 * Check if there's a winner or if game needs to continue
 */
function checkForWinner() {
  if (counterP + counterM >= 12) {
    if (counterP === counterM) {
      elements.tags.forEach((e) => removeClasses(e));
      isEven = true;
      randomSelector();
    } else {
      declareWinner();
    }
  }
}

/**
 * Check if the current selection gets a bonus
 * @returns {Number} Bonus level (0, 2, 3, or 4)
 */
function checkIfBonus() {
  const random = Math.floor(Math.random() * 100) + 1;
  const config = gameData.APP_CONFIG.bonusChance;

  // Only check if we've reached max bonuses or if bonuses are disabled
  if (bonuscount >= gameData.APP_CONFIG.maxBonus || disableBonus) {
    return 0;
  }

  // Special (4x) bonus - very rare
  if (random > 0 && random <= config.specialBonus) {
    bonuscount++;
    return 4;
  }
  
  // Triple (3x) bonus
  if (random > config.specialBonus && random <= config.specialBonus + config.tripleBonus) {
    bonuscount++;
    return 3;
  }

  // Double (2x) bonus
  if (random > config.specialBonus + config.tripleBonus && 
      random <= config.specialBonus + config.tripleBonus + config.doubleBonus) {
    bonuscount++;
    return 2;
  }

  return 0;
}

// Initialize the game when DOM is ready
document.addEventListener("DOMContentLoaded", initGame);
