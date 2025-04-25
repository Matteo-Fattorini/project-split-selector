// Game Data Management Module
// per = percentage vincita mia (Fatto's win percentage)

/**
 * Percentages for each location
 */
const DEFAULT_PERCENTAGES = [
  { id: "downtown", per: 50, label: "Città" }, 
  { id: "airport", per: 50, label: "Aereoplano" }, 
  { id: "construction", per: 50, label: "Casina (Via Aldo Moro 48)" }, 
  { id: "ferry", per: 50, label: "Titanic" }, 
  { id: "port", per: 50, label: "Autostrada facile" }, 
  { id: "airplane", per: 50, label: "Prima curva" }, 
  { id: "docks", per: 50, label: "99-1" }, 
  { id: "expressway", per: 50, label: "Autostrada difficile" }, 
  { id: "powerplant", per: 50, label: "Centrale" }, 
  { id: "stormdrain", per: 50, label: "Scolo" }, 
  { id: "canyon", per: 50, label: "Canyon" }, 
  { id: "quarry", per: 50, label: "Quarry" }
];

/**
 * Total wins data
 */
const DEFAULT_TOTAL_WINS = { totalWinsPisto: 0, totalWinsFatto: 0 };

/**
 * Default scoreboard data
 */
const DEFAULT_SCOREBOARD = [
  [
    { season: 1, pisto: 0, fatto: 0 },
    { id: "downtown", per: 50 },
    { id: "airport", per: 50 },
    { id: "construction", per: 50 },
    { id: "ferry", per: 50 },
    { id: "port", per: 50 },
    { id: "airplane", per: 50 },
    { id: "docks", per: 50 },
    { id: "expressway", per: 50 },
    { id: "powerplant", per: 50 },
    { id: "stormdrain", per: 50 },
    { id: "canyon", per: 50 },
    { id: "quarry", per: 50 }
  ]
];

// Working variables that will be populated from either localStorage or defaults
let PERCENTAGES = [...DEFAULT_PERCENTAGES];
let TOTAL_WINS = {...DEFAULT_TOTAL_WINS};
let SCOREBOARD = JSON.parse(JSON.stringify(DEFAULT_SCOREBOARD));

/**
 * App configuration
 */
const APP_CONFIG = {
  version: "3.0.0",
  storageName: "splitSelector",
  bonusChance: {
    doubleBonus: 10, // 10% chance for 2x bonus
    tripleBonus: 3,  // 3% chance for 3x bonus
    specialBonus: 0  // 0% chance for 4x bonus
  },
  maxBonus: 2  // Maximum number of bonuses per game
};

/**
 * Load data from localStorage or use defaults
 */
function loadGameData() {
  try {
    const savedData = localStorage.getItem(APP_CONFIG.storageName);
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      PERCENTAGES = parsedData.percentages || [...DEFAULT_PERCENTAGES];
      TOTAL_WINS = parsedData.totalWins || {...DEFAULT_TOTAL_WINS};
      SCOREBOARD = parsedData.scoreboard || JSON.parse(JSON.stringify(DEFAULT_SCOREBOARD));
      return true;
    }
  } catch (error) {
    console.error('Error loading game data:', error);
  }
  
  // If no saved data or error, use defaults
  PERCENTAGES = [...DEFAULT_PERCENTAGES];
  TOTAL_WINS = {...DEFAULT_TOTAL_WINS};
  SCOREBOARD = JSON.parse(JSON.stringify(DEFAULT_SCOREBOARD));
  return false;
}

/**
 * Save game data to localStorage
 */
function saveGameData() {
  try {
    const data = {
      percentages: PERCENTAGES,
      totalWins: TOTAL_WINS,
      scoreboard: SCOREBOARD
    };
    localStorage.setItem(APP_CONFIG.storageName, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving game data:', error);
    return false;
  }
}

/**
 * Update total wins display
 */
function updateTotalWins(winner) {
  if (winner === 'pisto') {
    TOTAL_WINS.totalWinsPisto += 1;
  } else if (winner === 'fatto') {
    TOTAL_WINS.totalWinsFatto += 1;
  }
  
  // Update display
  document.getElementById('totalWinsPisto').textContent = TOTAL_WINS.totalWinsPisto;
  document.getElementById('totalWinsFatto').textContent = TOTAL_WINS.totalWinsFatto;
  
  // Save to localStorage
  saveGameData();
}

/**
 * Add a new season to the scoreboard with updated percentages
 */
function addNewSeason(pistoWins, fattoWins, locationResults) {
  const newSeason = [{
    season: SCOREBOARD.length + 1,
    pisto: pistoWins,
    fatto: fattoWins
  }];
  
  // Add updated percentages for each location
  PERCENTAGES.forEach(location => {
    const matchingLocation = locationResults.find(item => item.id === location.id);
    if (matchingLocation && matchingLocation.winner) {
      // Get the bonus value (default to 1 if no bonus)
      const bonusValue = matchingLocation.bonus || 1;
      
      // Adjust the percentage based on who won this location
      // The bonus value IS the actual adjustment (1, 2, 3, or 4)
      let newPer = location.per;
      if (matchingLocation.winner === 'pisto') {
        // Decrease Fatto's percentage (increase Pisto's chance)
        newPer = Math.max(40, newPer - bonusValue); // Limit minimum to 40%
      } else if (matchingLocation.winner === 'fatto') {
        // Increase Fatto's percentage
        newPer = Math.min(60, newPer + bonusValue); // Limit maximum to 60%
      }
      
      // Update the actual percentage
      location.per = newPer;
      
      newSeason.push({
        id: location.id,
        per: newPer,
        bonus: bonusValue > 1 ? bonusValue : undefined
      });
    } else {
      newSeason.push({
        id: location.id,
        per: location.per
      });
    }
  });
  
  SCOREBOARD.push(newSeason);
  
  // Save updated data to localStorage
  saveGameData();
}

/**
 * Reset the game (for new game)
 */
function resetGame() {
  // Reset UI elements
  document.querySelectorAll('.tag').forEach(tag => {
    tag.classList.remove('selected', 'pistoWon', 'matteoWon', 'special_2', 'special_3', 'special_4', 'noselectable');
    tag.classList.add('unselected');
    tag.style.backgroundImage = 'unset';
    tag.style.border = 'none';
    
    // Remove percentage indicators if any
    const percentBoxes = tag.querySelectorAll('.percentBox');
    percentBoxes.forEach(box => box.remove());
  });
  
  // Reset counters
  return {
    counterP: 0,
    counterM: 0,
    bonuscount: 0
  };
}

/**
 * Reset save data back to initial values
 */
function resetSaveData() {
  // Clear localStorage
  localStorage.removeItem(APP_CONFIG.storageName);
  
  // Reset to default values
  PERCENTAGES = [...DEFAULT_PERCENTAGES];
  TOTAL_WINS = {...DEFAULT_TOTAL_WINS};
  SCOREBOARD = JSON.parse(JSON.stringify(DEFAULT_SCOREBOARD));
  
  // Update the display
  document.getElementById('totalWinsPisto').textContent = TOTAL_WINS.totalWinsPisto;
  document.getElementById('totalWinsFatto').textContent = TOTAL_WINS.totalWinsFatto;
  
  return true;
}

// Load game data on initialization
loadGameData();

// Export for use in other modules
window.gameData = {
  percentages: PERCENTAGES,
  totalWins: TOTAL_WINS,
  scoreboard: SCOREBOARD,
  APP_CONFIG,
  updateTotalWins,
  addNewSeason,
  resetGame,
  resetSaveData
};

