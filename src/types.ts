// Core game types and interfaces

export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type BallType = 'normal' | 'lightning' | 'ghost' | 'bomb';

export type EnemyType = 'melee' | 'archer' | 'tank' | 'elite' | 'spawner';

export type PowerUpType = 
  | 'health' 
  | 'speed' 
  | 'damage' 
  | 'shield' 
  | 'xp' 
  | 'invincibility' 
  | 'magnet' 
  | 'freeze' 
  | 'bomb';

export type GameState = 'menu' | 'playing' | 'paused' | 'levelup' | 'gameover' | 'victory';

export interface PlayerStats {
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  moveSpeed: number;
  hasShield: boolean;
  shieldHp: number;
  invincible: boolean;
  invincibilityTimer: number;
}

export interface BallData {
  type: BallType;
  position: Vector2;
  velocity: Vector2;
  damage: number;
  speed: number;
  active: boolean;
  held: boolean;
}

export interface BallInventory {
  [key: string]: number;
  normal: number;
  lightning: number;
  ghost: number;
  bomb: number; // Special ball, not in upgrade chain
}

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Vector2;
  hp: number;
  maxHp: number;
  column: number;
  speed: number;
  damage: number;
  xpValue: number;
  attackTimer: number;
  statusEffects: StatusEffect[];
  size: number;
}

export interface StatusEffect {
  type: 'burn' | 'freeze' | 'poison' | 'slow';
  duration: number;
  damage?: number;
  tickTimer?: number;
}

export interface Projectile {
  id: string;
  type: 'arrow';
  position: Vector2;
  velocity: Vector2;
  damage: number;
  owner: string;
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Vector2;
  velocity: Vector2;
  lifetime: number;
}

export interface Particle {
  id: string;
  position: Vector2;
  velocity: Vector2;
  color: string;
  size: number;
  lifetime: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

export interface BuffData {
  type: string;
  duration: number;
  icon: string;
  multiplier?: number;
}

export interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'combat' | 'ball' | 'utility';
  apply: (game: any) => void;
}

export type BossType = 'archer_king' | 'brawler_chief' | 'dark_mage';

export interface Boss {
  id: string;
  name: string;
  type: BossType;
  hp: number;
  maxHp: number;
  position: Vector2;
  phase: number;
  attackPattern: string;
  attackTimer: number;
  moveDirection: number;
  defeated: boolean;
  specialData?: any; // For boss-specific data (clones, barriers, etc)
}

export interface GameProgress {
  stage: number;
  section: number;
  progress: number;
  enemiesDefeated: number;
  bossActive: boolean;
}

export interface InputState {
  keys: Set<string>;
  mouse: {
    x: number;
    y: number;
    pressed: boolean;
  };
}

