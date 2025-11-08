# 🎮 Roguelite Brick Breaker

A 2D roguelite brick breaker game with RPG progression elements, inspired by Ball x Pit and Vampire Survivors.

## 🎯 Game Features

### Core Mechanics
- **Ball Physics**: Realistic bouncing mechanics with trajectory prediction
- **8-Column Grid System**: Strategic enemy placement and movement patterns
- **Multiple Ball Types**: 7 unique ball types with special effects
- **Enemy Variety**: 5 different enemy types with unique behaviors
- **Boss Battles**: Epic multi-phase boss encounters
- **XP & Leveling**: RPG-style progression with upgrade choices

### Ball Types
- 🔵 **Normal Ball**: Standard damage and bounce
- 🔥 **Fire Ball**: Burn DoT + piercing (2 enemies)
- ❄️ **Ice Ball**: Slows enemies + AoE freeze
- ⚡ **Lightning Ball**: Chain lightning to 3 nearby enemies
- 💣 **Bomb Ball**: Massive AoE explosion (one-time use)
- ☠️ **Poison Ball**: DoT + contagious spread
- 👻 **Ghost Ball**: Phases through enemies (hits up to 8)

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

**Ball Type Unlocks**:
- Unlock Fire/Ice/Lightning/Poison/Bomb/Ghost Balls

**Utility**:
- XP Magnet Range +50%
- Movement Speed +25%
- Lucky Drops +20%
- Treasure Hunter +50% XP
- Second Wind (Auto-revive)

## 🎮 Controls

- **A/D** or **Arrow Keys**: Move left/right
- **Mouse**: Aim trajectory
- **Left Click**: Throw ball
- **ESC**: Pause game
- **U**: Upgrade ball type (when available)

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

1. **Start**: Level 1, 1 Normal Ball, 100 HP
2. **Combat**: Throw balls to destroy descending enemies
3. **Collect**: XP orbs and power-ups from defeated enemies
4. **Level Up**: Choose from 3 random upgrades
5. **Progress**: Reach 100% to face the boss
6. **Boss**: Defeat multi-phase boss to complete stage
7. **Repeat**: Continue with increasing difficulty

## 🎯 Strategy Tips

- **Ball Management**: Convert 5 Normal Balls → 1 Special Ball
- **Trajectory Planning**: Use the dotted line to predict bounces
- **Priority Targets**: Focus Spawners and Archers first
- **Power-Up Timing**: Save powerful buffs for tough encounters
- **Upgrade Synergy**: Combine damage boosts with ball type unlocks

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
