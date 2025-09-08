// Game Configuration - Easy to expand!
const GAME_CONFIG = {
WORLD: {
WIDTH: 3000,
HEIGHT: 2000,
SPAWN_X: 1500,
SPAWN_Y: 1000
},
PLAYER: {
SIZE: 40,
SPEED: 200
},
ORE: {
SIZE: 30,
ROCK_SIZE: 35
}
};

// Biomes Configuration - Easy to add more!
const BIOMES = {
spawn: {
name: “Spawn Area”,
color: “#4a7c59”,
rockColor: “#666”,
ores: []
},
grassland: {
name: “Grassland”,
color: “#2d5016”,
rockColor: “#8B4513”,
ores: [“copper”, “iron”]
},
desert: {
name: “Desert”,
color: “#c2b280”,
rockColor: “#DEB887”,
ores: [“gold”, “copper”]
},
mountain: {
name: “Mountains”,
color: “#696969”,
rockColor: “#2F4F4F”,
ores: [“iron”, “diamond”]
},
forest: {
name: “Forest”,
color: “#013220”,
rockColor: “#654321”,
ores: [“coal”, “copper”]
}
};

// Ores Configuration - Easy to add more!
const ORES = {
copper: {
name: “Copper”,
color: “#B87333”,
value: 10,
rarity: 0.3,
requiredPickaxe: “basic”
},
iron: {
name: “Iron”,
color: “#C0C0C0”,
value: 25,
rarity: 0.2,
requiredPickaxe: “basic”
},
gold: {
name: “Gold”,
color: “#FFD700”,
value: 50,
rarity: 0.15,
requiredPickaxe: “basic”
},
diamond: {
name: “Diamond”,
color: “#B9F2FF”,
value: 100,
rarity: 0.05,
requiredPickaxe: “basic”
},
coal: {
name: “Coal”,
color: “#36454F”,
value: 5,
rarity: 0.4,
requiredPickaxe: “basic”
}
};

// Pickaxes Configuration - Easy to add more!
const PICKAXES = {
basic: {
name: “Basic Pick”,
power: 1,
image: “⛏️”, // Placeholder - replace with actual image path
crafting: null // No crafting recipe for basic pickaxe
}
// Add more pickaxes here like:
// iron: {
//     name: “Iron Pick”,
//     power: 2,
//     image: “assets/pickaxes/iron-pick.png”,
//     crafting: { iron: 5, copper: 2 }
// },
// diamond: {
//     name: “Diamond Pick”,
//     power: 5,
//     image: “assets/pickaxes/diamond-pick.png”,
//     crafting: { diamond: 3, iron: 10 }
// }
};

// Easy Expansion Instructions
console.log(`
🎮 MINING GAME - EXPANSION GUIDE 🎮

📦 TO ADD NEW ORES:

1. Add to ORES object in config.js with: name, color, value, rarity, requiredPickaxe
1. Add to desired biomes in BIOMES object
1. Inventory will auto-update!

⛏️ TO ADD NEW PICKAXES:

1. Add to PICKAXES object in config.js with: name, power, image, crafting recipe
1. Update canMineOre() logic if needed
1. Add crafting logic in game.js

🌍 TO ADD NEW BIOMES:

1. Add to BIOMES object in config.js with: name, color, rockColor, ores array
1. Update generateWorld() to include new biome in game.js

🎵 MUSIC SYSTEM:

- Volume slider ready in settings
- Add audio elements and connect to gameState.settings.volume

📁 FOLDER STRUCTURE FOR GITHUB:
/mining-game
├── index.html
├── styles.css
├── config.js
├── game.js
└── assets/
├── pickaxes/
├── audio/
└── images/

Controls: WASD to move, click near player to mine!
`);
