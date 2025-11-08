// Game constants and configuration

export const GAME_WIDTH = 640; // Reduced from 800 to 640
export const GAME_HEIGHT = 800;
export const FPS = 60;
export const COLUMNS = 8;
export const COLUMN_WIDTH = GAME_WIDTH / COLUMNS;

// Player constants
export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 32;
export const PLAYER_START_X = GAME_WIDTH / 2;
export const PLAYER_START_Y = GAME_HEIGHT - 80; // Adjusted for taller screen
export const PLAYER_SPEED = 200;
export const PLAYER_START_HP = 100;

// Ball constants
export const BALL_RADIUS = 8;
export const BALL_BASE_SPEED = 300;
export const BALL_BASE_DAMAGE = 10;
export const MAX_BALLS_ON_FIELD = 5; // Limit active balls in play
export const MAX_BALLS_ACTIVE = 10;

// Enemy constants
export const ENEMY_SCROLL_SPEED = 30;
export const ENEMY_SIZE = 32;
export const ENEMY_SPAWN_INTERVAL = 8; // % progress - spawn more frequently

// Boss constants
export const BOSS_WIDTH = 96;
export const BOSS_HEIGHT = 96;
export const BOSS_SPAWN_PROGRESS = 100;

// Physics
export const GRAVITY = 0;
export const FRICTION = 0.99;
export const BOUNCE_DAMPING = 1.0;

// Power-up constants
export const POWERUP_DROP_CHANCE = 0.15;
export const POWERUP_ELITE_DROP_CHANCE = 0.4;
export const POWERUP_SIZE = 16;
export const POWERUP_LIFETIME = 10;
export const POWERUP_FALL_SPEED = 100;

// XP constants
export const XP_BASE_REQUIREMENT = 100;
export const XP_SCALING = 1.5;
export const XP_COLLECTION_RADIUS = 80; // Increased magnet radius
export const XP_MAGNET_DELAY = 0.3; // Faster activation

// UI constants
export const HUD_HEIGHT = 60;
export const HUD_PADDING = 10;
export const STAT_BAR_HEIGHT = 40;

// Particle constants
export const PARTICLE_LIFETIME = 0.8;
export const IMPACT_PARTICLES = 10;
export const DEATH_PARTICLES = 25;

// Color palette
export const COLORS = {
  // Ball colors
  normal: '#4A9EFF',
  fire: '#FF4A4A',
  ice: '#4AFFFF',
  lightning: '#FFFF4A',
  bomb: '#FF8C4A',
  poison: '#4AFF4A',
  ghost: '#C94AFF',
  
  // UI colors
  ui_bg: '#1a1a2e',
  ui_border: '#00ffff',
  ui_text: '#ffffff',
  ui_text_dim: '#888888',
  
  // HP bar colors
  hp_full: '#4AFF4A',
  hp_medium: '#FFFF4A',
  hp_low: '#FF4A4A',
  
  // XP bar color
  xp: '#4AFFFF',
  
  // Enemy colors
  enemy_melee: '#FF4A4A',
  enemy_archer: '#4AFF4A',
  enemy_tank: '#888888',
  enemy_elite: '#FFD700',
  enemy_spawner: '#FF8CFF',
  
  // Rarity colors
  common: '#FFFFFF',
  uncommon: '#4AFF4A',
  rare: '#4A9EFF',
  epic: '#C94AFF',
  legendary: '#FFD700'
};

// Ball type stats
export const BALL_STATS = {
  normal: {
    damage: 10,
    speed: 1.0,
    color: COLORS.normal,
    icon: '🔵'
  },
  lightning: {
    damage: 15,
    speed: 1.2,
    color: COLORS.lightning,
    icon: '⚡',
    chainCount: 2,
    chainRange: 60 // Reduced from 100 to 60 for less spread
  },
  ghost: {
    damage: 25,
    speed: 1.4,
    color: COLORS.ghost,
    icon: '👻',
    phaseThrough: true,
    piercing: 5
  },
  bomb: {
    damage: 50,
    speed: 0.8,
    color: COLORS.bomb,
    icon: '💣',
    explosionRadius: 100
  }
};

// Enemy stats - very slow speeds and bigger size
export const ENEMY_STATS = {
  melee: {
    hp: 30,
    damage: 10,
    speed: 10, // Reduced from 15 to 10
    xp: 20,
    size: 38, // Increased from 28
    color: COLORS.enemy_melee,
    rushSpeed: 50
  },
  archer: {
    hp: 20,
    damage: 5,
    speed: 10, // Reduced from 15 to 10
    xp: 25,
    size: 38, // Increased from 28
    color: COLORS.enemy_archer,
    shootInterval: 8 // Increased from 5 to 8 seconds
  },
  tank: {
    hp: 80,
    damage: 20,
    speed: 10, // Reduced from 15 to 10
    xp: 50,
    size: 50, // Increased from 42
    color: COLORS.enemy_tank,
    slamInterval: 5,
    slamDamage: 15
  },
  elite: {
    hp: 50,
    damage: 15,
    speed: 10, // Reduced from 15 to 10
    xp: 100,
    size: 40, // Increased from 32
    color: COLORS.enemy_elite
  },
  spawner: {
    hp: 40,
    damage: 0,
    speed: 10, // Reduced from 15 to 10
    xp: 60,
    size: 38, // Increased from 32
    color: COLORS.enemy_spawner,
    spawnInterval: 8 // Increased spawn time
  }
};

// Power-up effects duration
export const POWERUP_DURATIONS = {
  speed: 10,
  damage: 8,
  shield: 0, // instant, absorbs damage
  xp: 15,
  invincibility: 5,
  magnet: 12,
  freeze: 6
};

