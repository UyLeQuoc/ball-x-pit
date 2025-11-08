// Player system

import type { Vector2, PlayerStats, InputState, BallInventory, BuffData } from './types';
import { 
  PLAYER_START_X, 
  PLAYER_START_Y, 
  PLAYER_SPEED, 
  PLAYER_START_HP,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GAME_WIDTH,
  HUD_HEIGHT,
  XP_BASE_REQUIREMENT,
  XP_SCALING
} from './constants';
import { isKeyPressed } from './input';
import { clamp, calculateXPRequired } from './utils';

export interface Player {
  position: Vector2;
  stats: PlayerStats;
  inventory: BallInventory;
  selectedBallType: string;
  buffs: BuffData[];
  damageMultiplier: number;
  speedMultiplier: number;
  critChance: number;
}

export function createPlayer(): Player {
  return {
    position: { x: PLAYER_START_X, y: PLAYER_START_Y },
    stats: {
      hp: PLAYER_START_HP,
      maxHp: PLAYER_START_HP,
      level: 1,
      xp: 0,
      xpToNextLevel: XP_BASE_REQUIREMENT,
      moveSpeed: PLAYER_SPEED,
      hasShield: false,
      shieldHp: 0,
      invincible: false,
      invincibilityTimer: 0
    },
    inventory: {
      normal: 3, // Start with 3 balls instead of 1
      fire: 0,
      ice: 0,
      lightning: 0,
      bomb: 0,
      poison: 0,
      ghost: 0
    },
    selectedBallType: 'normal',
    buffs: [],
    damageMultiplier: 1,
    speedMultiplier: 1,
    critChance: 0
  };
}

export function updatePlayer(player: Player, input: InputState, deltaTime: number): void {
  // Handle movement - WASD + Arrow keys
  let moveX = 0;
  let moveY = 0;
  
  if (isKeyPressed(input, 'a') || isKeyPressed(input, 'arrowleft')) {
    moveX = -1;
  }
  if (isKeyPressed(input, 'd') || isKeyPressed(input, 'arrowright')) {
    moveX = 1;
  }
  if (isKeyPressed(input, 'w') || isKeyPressed(input, 'arrowup')) {
    moveY = -1;
  }
  if (isKeyPressed(input, 's') || isKeyPressed(input, 'arrowdown')) {
    moveY = 1;
  }
  
  // Normalize diagonal movement
  if (moveX !== 0 && moveY !== 0) {
    moveX *= 0.707; // 1/sqrt(2)
    moveY *= 0.707;
  }
  
  // Apply movement
  const speed = player.stats.moveSpeed * player.speedMultiplier;
  player.position.x += moveX * speed * deltaTime;
  player.position.y += moveY * speed * deltaTime;
  
  // Clamp to screen bounds
  player.position.x = clamp(
    player.position.x,
    PLAYER_WIDTH / 2,
    GAME_WIDTH - PLAYER_WIDTH / 2
  );
  
  player.position.y = clamp(
    player.position.y,
    HUD_HEIGHT + PLAYER_HEIGHT / 2,
    PLAYER_START_Y // Keep player in bottom area
  );
  
  // Update invincibility timer
  if (player.stats.invincible) {
    player.stats.invincibilityTimer -= deltaTime;
    if (player.stats.invincibilityTimer <= 0) {
      player.stats.invincible = false;
      player.stats.invincibilityTimer = 0;
    }
  }
  
  // Update buffs
  player.buffs = player.buffs
    .map(buff => {
      buff.duration -= deltaTime;
      return buff;
    })
    .filter(buff => buff.duration > 0);
  
  // Update multipliers based on active buffs
  updatePlayerMultipliers(player);
}

export function updatePlayerMultipliers(player: Player): void {
  player.damageMultiplier = 1;
  player.speedMultiplier = 1;
  
  player.buffs.forEach(buff => {
    if (buff.type === 'damage' && buff.multiplier) {
      player.damageMultiplier *= buff.multiplier;
    }
    if (buff.type === 'speed' && buff.multiplier) {
      player.speedMultiplier *= buff.multiplier;
    }
  });
}

export function addXP(player: Player, amount: number): boolean {
  // Check for XP multiplier buff
  const xpBuff = player.buffs.find(b => b.type === 'xp');
  const finalAmount = xpBuff && xpBuff.multiplier ? amount * xpBuff.multiplier : amount;
  
  player.stats.xp += finalAmount;
  
  // Check for level up
  if (player.stats.xp >= player.stats.xpToNextLevel) {
    player.stats.xp -= player.stats.xpToNextLevel;
    player.stats.level += 1;
    player.stats.xpToNextLevel = calculateXPRequired(
      player.stats.level,
      XP_BASE_REQUIREMENT,
      XP_SCALING
    );
    return true; // Level up occurred
  }
  
  return false;
}

export function damagePlayer(player: Player, damage: number): void {
  if (player.stats.invincible) return;
  
  // Check shield first
  if (player.stats.hasShield && player.stats.shieldHp > 0) {
    player.stats.shieldHp -= damage;
    if (player.stats.shieldHp <= 0) {
      player.stats.hasShield = false;
      player.stats.shieldHp = 0;
    }
    return;
  }
  
  // Apply damage to HP
  player.stats.hp -= damage;
  if (player.stats.hp < 0) player.stats.hp = 0;
  
  // Brief invincibility after hit
  player.stats.invincible = true;
  player.stats.invincibilityTimer = 0.5;
}

export function healPlayer(player: Player, amount: number): void {
  player.stats.hp = Math.min(player.stats.hp + amount, player.stats.maxHp);
}

export function addBuff(player: Player, buff: BuffData): void {
  // Check if buff already exists and refresh duration
  const existingBuff = player.buffs.find(b => b.type === buff.type);
  if (existingBuff) {
    existingBuff.duration = buff.duration;
  } else {
    player.buffs.push(buff);
  }
}

export function addBallToInventory(player: Player, ballType: string, count: number = 1): void {
  if (ballType in player.inventory) {
    (player.inventory as any)[ballType] += count;
  }
}

export function removeBallFromInventory(player: Player, ballType: string): boolean {
  if (ballType in player.inventory && (player.inventory as any)[ballType] > 0) {
    (player.inventory as any)[ballType] -= 1;
    return true;
  }
  return false;
}

export function canUpgradeBall(player: Player, ballType: string): boolean {
  return (player.inventory as any)[ballType] >= 5;
}

export function upgradeBall(player: Player, fromType: string, toType: string): boolean {
  if (!canUpgradeBall(player, fromType)) return false;
  
  (player.inventory as any)[fromType] -= 5;
  (player.inventory as any)[toType] += 1;
  
  // Auto-select the new ball type
  player.selectedBallType = toType;
  
  return true;
}

export function selectNextAvailableBall(player: Player): void {
  const ballTypes = ['normal', 'fire', 'ice', 'lightning', 'bomb', 'poison', 'ghost'];
  
  for (const type of ballTypes) {
    if ((player.inventory as any)[type] > 0) {
      player.selectedBallType = type;
      return;
    }
  }
  
  // Fallback to normal
  player.selectedBallType = 'normal';
}

