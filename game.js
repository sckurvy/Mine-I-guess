// Game State
let gameState = {
player: {
name: “Player”,
avatar: null,
x: GAME_CONFIG.WORLD.SPAWN_X,
y: GAME_CONFIG.WORLD.SPAWN_Y,
currentPickaxe: “basic”
},
camera: {
x: 0,
y: 0
},
inventory: {},
world: {
ores: [],
biomeMap: []
},
keys: {},
settings: {
volume: 50
}
};

// Canvas and context
let canvas, ctx;
let lastTime = 0;

// Initialize inventory for all ore types
Object.keys(ORES).forEach(ore => {
gameState.inventory[ore] = 0;
});

// Start game function
function startGame() {
try {
const playerName = document.getElementById(‘playerName’).value.trim() || ‘Miner’;
const avatarFile = document.getElementById(‘avatarUpload’).files[0];

```
    gameState.player.name = playerName;
    document.getElementById('gamePlayerName').textContent = playerName;
    
    if (avatarFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            gameState.player.avatar = e.target.result;
            const avatarElement = document.getElementById('gameAvatar');
            avatarElement.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '3px';
            avatarElement.appendChild(img);
        };
        reader.readAsDataURL(avatarFile);
    }
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    
    initializeGame();
} catch (error) {
    console.error('Error starting game:', error);
    alert('Error starting game. Please refresh and try again.');
}
```

}

// Initialize game
function initializeGame() {
try {
canvas = document.getElementById(‘gameCanvas’);
ctx = canvas.getContext(‘2d’);

```
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;
    
    // Generate world
    generateWorld();
    
    // Update UI
    updateInventoryDisplay();
    updatePickaxeInfo();
    
    // Start game loop
    requestAnimationFrame(gameLoop);
    
    // Event listeners
    setupEventListeners();
} catch (error) {
    console.error('Error initializing game:', error);
    alert('Error initializing game. Please refresh and try again.');
}
```

}

// Generate world with biomes and ores
function generateWorld() {
const biomeSize = 500;
gameState.world.biomeMap = [];
gameState.world.ores = [];

```
// Create biome map
for (let x = 0; x < GAME_CONFIG.WORLD.WIDTH; x += biomeSize) {
    for (let y = 0; y < GAME_CONFIG.WORLD.HEIGHT; y += biomeSize) {
        let biomeType;
        
        // Spawn area in center
        if (Math.abs(x - GAME_CONFIG.WORLD.SPAWN_X) < biomeSize && 
            Math.abs(y - GAME_CONFIG.WORLD.SPAWN_Y) < biomeSize) {
            biomeType = 'spawn';
        } else {
            // Random biome selection
            const biomeKeys = ['grassland', 'desert', 'mountain', 'forest'];
            biomeType = biomeKeys[Math.floor(Math.random() * biomeKeys.length)];
        }
        
        gameState.world.biomeMap.push({
            x: x,
            y: y,
            width: biomeSize,
            height: biomeSize,
            type: biomeType
        });

        // Generate ores for this biome
        if (biomeType !== 'spawn') {
            generateOresForBiome(x, y, biomeSize, biomeType);
        }
    }
}
```

}

// Generate ores for a specific biome
function generateOresForBiome(startX, startY, size, biomeType) {
const biome = BIOMES[biomeType];
const oreCount = Math.floor(Math.random() * 15) + 10;

```
for (let i = 0; i < oreCount; i++) {
    const x = startX + Math.random() * size;
    const y = startY + Math.random() * size;
    
    // Select random ore type based on biome
    if (biome.ores.length > 0) {
        const oreType = biome.ores[Math.floor(Math.random() * biome.ores.length)];
        const ore = ORES[oreType];
        
        if (Math.random() < ore.rarity) {
            gameState.world.ores.push({
                x: x,
                y: y,
                type: oreType,
                mined: false
            });
        }
    }
}
```

}

// Game loop
function gameLoop(currentTime) {
try {
const deltaTime = (currentTime - lastTime) / 1000;
lastTime = currentTime;

```
    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
} catch (error) {
    console.error('Game loop error:', error);
}
```

}

// Update game logic
function update(deltaTime) {
// Player movement
const speed = GAME_CONFIG.PLAYER.SPEED;

```
if (gameState.keys['w'] || gameState.keys['W']) {
    gameState.player.y = Math.max(GAME_CONFIG.PLAYER.SIZE/2, 
        gameState.player.y - speed * deltaTime);
}
if (gameState.keys['s'] || gameState.keys['S']) {
    gameState.player.y = Math.min(GAME_CONFIG.WORLD.HEIGHT - GAME_CONFIG.PLAYER.SIZE/2, 
        gameState.player.y + speed * deltaTime);
}
if (gameState.keys['a'] || gameState.keys['A']) {
    gameState.player.x = Math.max(GAME_CONFIG.PLAYER.SIZE/2, 
        gameState.player.x - speed * deltaTime);
}
if (gameState.keys['d'] || gameState.keys['D']) {
    gameState.player.x = Math.min(GAME_CONFIG.WORLD.WIDTH - GAME_CONFIG.PLAYER.SIZE/2, 
        gameState.player.x + speed * deltaTime);
}

// Update camera to follow player
gameState.camera.x = gameState.player.x - canvas.width / 2;
gameState.camera.y = gameState.player.y - canvas.height / 2;

// Keep camera within world bounds
gameState.camera.x = Math.max(0, Math.min(GAME_CONFIG.WORLD.WIDTH - canvas.width, gameState.camera.x));
gameState.camera.y = Math.max(0, Math.min(GAME_CONFIG.WORLD.HEIGHT - canvas.height, gameState.camera.y));
```

}

// Render game
function render() {
// Clear canvas
ctx.fillStyle = ‘#000’;
ctx.fillRect(0, 0, canvas.width, canvas.height);

```
// Save context for camera transform
ctx.save();
ctx.translate(-gameState.camera.x, -gameState.camera.y);

// Render biomes
gameState.world.biomeMap.forEach(biome => {
    ctx.fillStyle = BIOMES[biome.type].color;
    ctx.fillRect(biome.x, biome.y, biome.width, biome.height);
});

// Render ores
gameState.world.ores.forEach(ore => {
    if (!ore.mined) {
        const oreData = ORES[ore.type];
        const biome = getBiomeAt(ore.x, ore.y);
        
        // Draw rock
        ctx.fillStyle = BIOMES[biome].rockColor;
        ctx.beginPath();
        ctx.arc(ore.x, ore.y, GAME_CONFIG.ORE.ROCK_SIZE/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ore
        ctx.fillStyle = oreData.color;
        ctx.beginPath();
        ctx.arc(ore.x, ore.y, GAME_CONFIG.ORE.SIZE/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Ore outline
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
});

// Render player
ctx.fillStyle = '#00ffff';
ctx.fillRect(
    gameState.player.x - GAME_CONFIG.PLAYER.SIZE/2,
    gameState.player.y - GAME_CONFIG.PLAYER.SIZE/2,
    GAME_CONFIG.PLAYER.SIZE,
    GAME_CONFIG.PLAYER.SIZE
);

// Player outline
ctx.strokeStyle = '#fff';
ctx.lineWidth = 3;
ctx.strokeRect(
    gameState.player.x - GAME_CONFIG.PLAYER.SIZE/2,
    gameState.player.y - GAME_CONFIG.PLAYER.SIZE/2,
    GAME_CONFIG.PLAYER.SIZE,
    GAME_CONFIG.PLAYER.SIZE
);

ctx.restore();

// Render UI elements (coordinates, etc.)
renderUI();
```

}

// Render UI elements
function renderUI() {
ctx.fillStyle = ‘rgba(0, 0, 0, 0.7)’;
ctx.fillRect(10, 10, 200, 60);

```
ctx.fillStyle = '#00ffff';
ctx.font = '16px Orbitron';
ctx.fillText(`X: ${Math.floor(gameState.player.x)}`, 20, 30);
ctx.fillText(`Y: ${Math.floor(gameState.player.y)}`, 20, 50);

const currentBiome = getBiomeAt(gameState.player.x, gameState.player.y);
ctx.fillText(`Biome: ${BIOMES[currentBiome].name}`, 120, 30);
```

}

// Get biome at position
function getBiomeAt(x, y) {
const biome = gameState.world.biomeMap.find(b =>
x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height
);
return biome ? biome.type : ‘grassland’;
}

// Mine ore at position
function mineOre(x, y) {
const oreIndex = gameState.world.ores.findIndex(ore =>
!ore.mined &&
Math.abs(ore.x - x) < GAME_CONFIG.ORE.SIZE &&
Math.abs(ore.y - y) < GAME_CONFIG.ORE.SIZE
);

```
if (oreIndex !== -1) {
    const ore = gameState.world.ores[oreIndex];
    const oreData = ORES[ore.type];
    
    // Check if player has required pickaxe
    if (canMineOre(ore.type)) {
        ore.mined = true;
        gameState.inventory[ore.type]++;
        updateInventoryDisplay();
        
        console.log(`Mined ${oreData.name}! Total: ${gameState.inventory[ore.type]}`);
    }
}
```

}

// Check if player can mine ore type
function canMineOre(oreType) {
const ore = ORES[oreType];
const pickaxe = PICKAXES[gameState.player.
