// Power-up system

import type { PowerUp, Vector2, Player } from './types';
import { generateId, randomChoice, distance } from './utils';
import { POWERUP_SIZE, POWERUP_FALL_SPEED, POWERUP_LIFETIME, POWERUP_DURATIONS } from './constants';
import { healPlayer, addBuff } from './player';

const POWERUP_TYPES = [
  'health', 'speed', 'damage', 'shield', 
  'xp', 'magnet', 'freeze', 'bomb'
];

const RARE_POWERUPS = ['invincibility'];

export function createPowerUp(position: Vector2, isElite: boolean = false): PowerUp {
  let type: string;
  
  if (isElite && Math.random() < 0.2) {
    type = randomChoice(RARE_POWERUPS);
  } else {
    type = randomChoice(POWERUP_TYPES);
  }
  
  return {
    id: generateId(),
    type: type as any,
    position: { ...position },
    velocity: { x: 0, y: POWERUP_FALL_SPEED },
    lifetime: POWERUP_LIFETIME
  };
}

export function updatePowerUps(powerUps: PowerUp[], deltaTime: number): PowerUp[] {
  return powerUps
    .map(powerUp => {
      // Update position
      powerUp.position.y += powerUp.velocity.y * deltaTime;
      
      // Update lifetime
      powerUp.lifetime -= deltaTime;
      
      return powerUp;
    })
    .filter(powerUp => {
      // Remove if lifetime expired or out of bounds
      return powerUp.lifetime > 0 && powerUp.position.y < 650;
    });
}

export function checkPowerUpCollection(
  powerUp: PowerUp,
  playerPos: Vector2,
  collectionRadius: number
): boolean {
  return distance(powerUp.position, playerPos) < collectionRadius;
}

export function applyPowerUp(powerUp: PowerUp, player: Player, onBombEffect?: () => void): void {
  switch (powerUp.type) {
    case 'health':
      healPlayer(player, 30);
      break;
      
    case 'speed':
      addBuff(player, {
        type: 'speed',
        duration: POWERUP_DURATIONS.speed,
        icon: '💨',
        multiplier: 1.5
      });
      break;
      
    case 'damage':
      addBuff(player, {
        type: 'damage',
        duration: POWERUP_DURATIONS.damage,
        icon: '💪',
        multiplier: 2.0
      });
      break;
      
    case 'shield':
      player.stats.hasShield = true;
      player.stats.shieldHp = 50;
      break;
      
    case 'xp':
      addBuff(player, {
        type: 'xp',
        duration: POWERUP_DURATIONS.xp,
        icon: '✨',
        multiplier: 2.0
      });
      break;
      
    case 'invincibility':
      player.stats.invincible = true;
      player.stats.invincibilityTimer = POWERUP_DURATIONS.invincibility;
      addBuff(player, {
        type: 'invincibility',
        duration: POWERUP_DURATIONS.invincibility,
        icon: '⭐'
      });
      break;
      
    case 'magnet':
      addBuff(player, {
        type: 'magnet',
        duration: POWERUP_DURATIONS.magnet,
        icon: '🧲'
      });
      break;
      
    case 'freeze':
      addBuff(player, {
        type: 'freeze',
        duration: POWERUP_DURATIONS.freeze,
        icon: '⏱️'
      });
      break;
      
    case 'bomb':
      // Bomb is instant effect
      if (onBombEffect) onBombEffect();
      break;
  }
}

