# 🎮 Roguelite Brick Breaker

A 2D roguelite brick breaker game with RPG progression elements, inspired by Ball x Pit and Vampire Survivors.

## 🎯 Game Features

### Core Mechanics
- **Shield Paddle**: Bounce balls with your paddle to keep them in play
- **Auto-Return System**: Balls automatically return to inventory when they hit bottom
- **8-Column Grid System**: Strategic enemy placement and movement patterns
- **Ball Upgrade System**: Collect 5 balls to automatically upgrade to next tier
- **Enemy Variety**: 5 different enemy types with unique behaviors
- **Boss Battles**: Epic multi-phase boss encounters with unique attack patterns
- **XP & Leveling**: RPG-style progression with upgrade choices

### Ball Types (Simplified System)

**Upgrade Chain** (5 balls → 1 upgrade):
- 🔵 **Normal Ball** (Tier 1): Damage: 10, Speed: 1.0x
- ⚡ **Lightning Ball** (Tier 2): Damage: 20, Speed: 1.2x, chains to 3 enemies
- 👻 **Ghost Ball** (Tier 3): Damage: 35, Speed: 1.4x, pierces 5 enemies, phases through

**Special Ball**:
- 💣 **Bomb Ball**: Damage: 50, Speed: 0.8x, 100px explosion radius (from power-ups only)

### Enemy Types
- ⚔️ **Melee**: Fast-moving rushers
- 🏹 **Archer**: Ranged attackers with arrows
- 🛡️ **Tank**: High HP, slow, ground slam AoE
- ⭐ **Elite**: Powerful hybrid enemies (guaranteed drops)
- 🥚 **Spawner**: Creates new enemies periodically

### Power-Ups
- ❤️ Health Restore
- 💨 Speed Boost
- 💪 Damage Boost
- 🛡️ Shield
- ✨ XP Boost
- ⭐ Invincibility
- 🧲 XP Magnet
- ⏱️ Time Freeze
- 💣 Screen-wide Bomb

### Upgrades (Level-Up)
**Combat**:
- +10 Max HP
- +5 Base Damage
- +1 Ball
- Ball Speed +20%
- Critical Hit Chance +10%
- Life Steal

**Ball System**:
- Balls auto-upgrade when you have 5 of same type
- Bomb balls from power-ups (special, not in upgrade chain)

**Utility**:
- XP Magnet Range +50%
- Movement Speed +25%
- Lucky Drops +20%
- Treasure Hunter +50% XP
- Second Wind (Auto-revive)

## 🎮 Controls

- **WASD** or **Arrow Keys**: Move in 4 directions
- **Mouse**: Aim and throw ball
- **Left Click**: Throw ball
- **ESC**: Pause/Resume game

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The game will automatically open in your browser at `http://localhost:3000`.

Hot module replacement is enabled - changes will reflect immediately during development.

## 🏗️ Project Structure

```
brick-breaker/
├── src/
│   ├── main.ts          # Entry point and game loop
│   ├── game.ts          # Main game class
│   ├── types.ts         # TypeScript type definitions
│   ├── constants.ts     # Game configuration
│   ├── utils.ts         # Utility functions
│   ├── input.ts         # Input handling
│   ├── renderer.ts      # Canvas rendering
│   ├── player.ts        # Player system
│   ├── ball.ts          # Ball physics
│   ├── enemy.ts         # Enemy system
│   ├── powerup.ts       # Power-up system
│   ├── particles.ts     # Particle effects
│   ├── upgrades.ts      # Upgrade system
│   └── ui.ts            # UI/HUD rendering
├── index.html           # Main HTML file
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── README.md           # This file
```

## 🎨 Visual Style

- **2D Sprite-Based**: Clean, modern pixel aesthetic
- **Vibrant Colors**: High contrast with clear visual hierarchy
- **Particle Effects**: Impacts, explosions, trails
- **60 FPS**: Smooth animations throughout
- **Roguelite UI**: Modern indie game polish

## 📊 Game Progression

1. **Start**: Level 1, 5 Normal Balls, 100 HP
2. **Combat**: Bounce balls off your shield paddle to hit enemies
3. **Auto-Return**: Balls return to inventory when reaching bottom
4. **Auto-Upgrade**: 5 balls of same type automatically upgrade to next tier
5. **Collect**: XP orbs and power-ups from defeated enemies
6. **Level Up**: Choose from 3 random upgrades
7. **Progress**: Reach 100% to face the boss
8. **Boss Warning**: Warning appears at 90% progress
9. **Boss Fight**: Defeat multi-phase boss with unique patterns
10. **Victory**: Receive rewards and continue to next stage

## 🎯 Strategy Tips

- **Ball Upgrades**: 5 Normal → 1 Lightning → 5 Lightning → 1 Ghost
- **Shield Control**: Position paddle to control ball angle
- **Priority Targets**: Focus Spawners and Archers first
- **Power-Up Timing**: Save powerful buffs for boss fights
- **Best Ball First**: System automatically uses your strongest balls
- **Ball Limit**: Max 5 balls on field at once for better control

## 🔧 Configuration

Game constants can be adjusted in `src/constants.ts`:
- Player stats and movement speed
- Ball physics and damage values
- Enemy health and behavior
- Power-up durations
- XP requirements
- Spawn rates

## 🐛 Known Issues

None currently! Report issues if you find any.

## 📝 Future Enhancements

Potential features for future versions:
- Sound effects and background music
- Multiple worlds/biomes
- More boss varieties
- Persistent unlocks between runs
- Achievements system
- Daily challenges
- Leaderboards

## 🙏 Credits

Created as a comprehensive roguelite brick breaker experience combining:
- Classic brick breaker mechanics
- Vampire Survivors-style progression
- Ball x Pit inspiration
- Modern roguelite design principles

## 📄 License

This project is provided as-is for educational and entertainment purposes.

---

**Enjoy the game! 🎮**

# ball-x-pit
