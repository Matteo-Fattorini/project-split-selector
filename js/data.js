// per = percentuale vincita mia

const percentages = [
  { id: "downtown", per: 47}, //città
  { id: "airport", per: 51 }, //aereoplano
  { id: "construction", per: 48 }, //casina
  { id: "ferry", per: 49 }, //titanic
  { id: "port", per: 49}, //autostrada facile
  { id: "airplane", per: 48 }, //prima curva
  { id: "docks", per: 51 }, //99-1
  { id: "expressway", per: 49 }, //autostrada difficile
  { id: "powerplant", per: 48 }, //centrale
  { id: "stormdrain", per: 48 }, //scolo
  { id: "canyon", per: 49 }, //canyon
  { id: "quarry", per: 48 }, //quarry
];

const totalWins = { totalWinsPisto: 0, totalWinsFatto: 0 };

const scoreboard = [
  [
    { season: 1, pisto: 22, fatto: 22 },
    { id: "downtown", per: 53 },
    { id: "airport", per: 38 },
    { id: "construction", per: 37 },
    { id: "ferry", per: 48 },
    { id: "port", per: 56 },
    { id: "airplane", per: 50 },
    { id: "docks", per: 35 },
    { id: "expressway", per: 52 },
    { id: "powerplant", per: 59 },
    { id: "stormdrain", per: 59 },
    { id: "canyon", per: 62 },
    { id: "quarry", per: 53 },
  ],
  [
    { season: 2, pisto: 10, fatto: 5 },
    { id: "downtown", per: 47 }, //città
    { id: "airport", per: 55 }, //aereoplano
    { id: "construction", per: 38 }, //casina
    { id: "ferry", per: 57 }, //titanic
    { id: "port", per: 55 }, //autostrada facile
    { id: "airplane", per: 43 }, //prima curva
    { id: "docks", per: 46 }, //99-1
    { id: "expressway", per: 53 }, //autostrada difficile
    { id: "powerplant", per: 52 }, //centrale
    { id: "stormdrain", per: 55 }, //scolo
    { id: "canyon", per: 47 }, //canyon
    { id: "quarry", per: 45 }, //quarry
  ],
];

