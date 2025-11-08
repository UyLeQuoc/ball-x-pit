// Enemy system

import type { Enemy, Vector2, Projectile, Particle, StatusEffect } from './types';
import { 
  ENEMY_STATS, 
  COLUMN_WIDTH,
  ENEMY_SIZE,
  PLAYER_START_Y
} from './constants';
import { 
  generateId, 
  getXFromColumn,
  distance,
  angleBetween,
  randomRange
} from './utils';

export function createEnemy(
  type: string,
  column: number,
  yPosition: number
): Enemy {
  const stats = ENEMY_STATS[type as keyof typeof ENEMY_STATS] || ENEMY_STATS.melee;
  const x = getXFromColumn(column, COLUMN_WIDTH);
  
  return {
    id: generateId(),
    type: type as any,
    position: { x, y: yPosition },
    hp: stats.hp,
    maxHp: stats.hp,
    column,
    speed: stats.speed,
    damage: stats.damage,
    xpValue: stats.xp,
    attackTimer: 0,
    statusEffects: [],
    size: stats.size
  };
}

export function updateEnemies(
  enemies: Enemy[],
  playerPos: Vector2,
  deltaTime: number,
  projectiles: Projectile[]
): Enemy[] {
  return enemies.filter(enemy => {
    if (enemy.hp <= 0) return false;
    
    // Update status effects
    updateStatusEffects(enemy, deltaTime);
    
    // Update based on type
    switch (enemy.type) {
      case 'melee':
        updateMeleeEnemy(enemy, playerPos, deltaTime);
        break;
      case 'archer':
        updateArcherEnemy(enemy, playerPos, deltaTime, projectiles);
        break;
      case 'tank':
        updateTankEnemy(enemy, playerPos, deltaTime);
        break;
      case 'elite':
        updateEliteEnemy(enemy, playerPos, deltaTime, projectiles);
        break;
      case 'spawner':
        updateSpawnerEnemy(enemy, deltaTime);
        break;
    }
    
    return true;
  });
}

function updateStatusEffects(enemy: Enemy, deltaTime: number): void {
  enemy.statusEffects = enemy.statusEffects
    .map(effect => {
      effect.duration -= deltaTime;
      
      // Handle DoT effects
      if (effect.damage && effect.tickTimer !== undefined) {
        effect.tickTimer -= deltaTime;
        if (effect.tickTimer <= 0) {
          enemy.hp -= effect.damage;
          effect.tickTimer = 1.0; // Tick every second
        }
      } else if (effect.damage) {
        effect.tickTimer = 1.0;
      }
      
      return effect;
    })
    .filter(effect => effect.duration > 0);
}

function getEffectiveSpeed(enemy: Enemy, baseSpeed: number): number {
  let speed = baseSpeed;
  
  // Check for slow effects
  const slowEffect = enemy.statusEffects.find(e => e.type === 'slow' || e.type === 'freeze');
  if (slowEffect) {
    speed *= 0.5;
  }
  
  return speed;
}

function updateMeleeEnemy(enemy: Enemy, playerPos: Vector2, deltaTime: number): void {
  const speed = getEffectiveSpeed(enemy, enemy.speed);
  
  // Always move down in wave formation (don't rush horizontally)
  enemy.position.y += speed * deltaTime;
  
  // Only rush when very close to player
  if (enemy.position.y >= PLAYER_START_Y - 30) {
    const rushSpeed = ENEMY_STATS.melee.rushSpeed;
    const dx = playerPos.x - enemy.position.x;
    const direction = dx > 0 ? 1 : -1;
    enemy.position.x += direction * rushSpeed * deltaTime * 0.3;
  }
}

function updateArcherEnemy(
  enemy: Enemy,
  playerPos: Vector2,
  deltaTime: number,
  projectiles: Projectile[]
): void {
  const speed = getEffectiveSpeed(enemy, enemy.speed);
  enemy.position.y += speed * deltaTime;
  
  // Shooting logic
  enemy.attackTimer += deltaTime;
  const shootInterval = ENEMY_STATS.archer.shootInterval;
  
  if (enemy.attackTimer >= shootInterval) {
    enemy.attackTimer = 0;
    
    // Fire arrow at player - much slower
    const angle = angleBetween(enemy.position, playerPos);
    const arrowSpeed = 120; // Reduced from 200 to 120
    
    projectiles.push({
      id: generateId(),
      type: 'arrow',
      position: { ...enemy.position },
      velocity: {
        x: Math.cos(angle) * arrowSpeed,
        y: Math.sin(angle) * arrowSpeed
      },
      damage: enemy.damage,
      owner: enemy.id
    });
  }
}

function updateTankEnemy(enemy: Enemy, playerPos: Vector2, deltaTime: number): void {
  const speed = getEffectiveSpeed(enemy, enemy.speed);
  enemy.position.y += speed * deltaTime;
  
  // Ground slam timer
  enemy.attackTimer += deltaTime;
}

function updateEliteEnemy(
  enemy: Enemy,
  playerPos: Vector2,
  deltaTime: number,
  projectiles: Projectile[]
): void {
  // Elite enemies combine melee and ranged behavior
  const speed = getEffectiveSpeed(enemy, enemy.speed);
  enemy.position.y += speed * deltaTime;
  
  // Occasional shots like archer - less frequent
  enemy.attackTimer += deltaTime;
  if (enemy.attackTimer >= 10) { // Increased from 6 to 10
    enemy.attackTimer = 0;
    
    const angle = angleBetween(enemy.position, playerPos);
    const arrowSpeed = 150; // Slower arrows
    
    projectiles.push({
      id: generateId(),
      type: 'arrow',
      position: { ...enemy.position },
      velocity: {
        x: Math.cos(angle) * arrowSpeed,
        y: Math.sin(angle) * arrowSpeed
      },
      damage: enemy.damage,
      owner: enemy.id
    });
  }
}

function updateSpawnerEnemy(enemy: Enemy, deltaTime: number): void {
  const speed = getEffectiveSpeed(enemy, enemy.speed);
  enemy.position.y += speed * deltaTime;
  
  enemy.attackTimer += deltaTime;
}

export function damageEnemy(enemy: Enemy, damage: number): void {
  enemy.hp -= damage;
  if (enemy.hp < 0) enemy.hp = 0;
}

export function applyStatusEffect(enemy: Enemy, effect: StatusEffect): void {
  // Check if effect already exists
  const existingEffect = enemy.statusEffects.find(e => e.type === effect.type);
  
  if (existingEffect) {
    // Refresh duration and stack damage if applicable
    existingEffect.duration = effect.duration;
    if (effect.damage && existingEffect.damage) {
      existingEffect.damage += effect.damage;
    }
  } else {
    enemy.statusEffects.push({ ...effect });
  }
}

export function updateProjectiles(
  projectiles: Projectile[],
  deltaTime: number,
  gameHeight: number
): Projectile[] {
  return projectiles
    .map(proj => {
      proj.position.x += proj.velocity.x * deltaTime;
      proj.position.y += proj.velocity.y * deltaTime;
      return proj;
    })
    .filter(proj => {
      // Remove if out of bounds
      return (
        proj.position.x >= 0 &&
        proj.position.x <= 800 &&
        proj.position.y >= 0 &&
        proj.position.y <= gameHeight
      );
    });
}

export function checkEnemyPlayerCollision(enemy: Enemy, playerPos: Vector2, playerSize: number): boolean {
  const dist = distance(enemy.position, playerPos);
  return dist < (enemy.size / 2 + playerSize / 2);
}

export function checkProjectilePlayerCollision(
  projectile: Projectile,
  playerPos: Vector2,
  playerSize: number
): boolean {
  const dist = distance(projectile.position, playerPos);
  return dist < (4 + playerSize / 2); // Projectile has small hitbox
}

export function shouldSpawnerSpawn(enemy: Enemy): boolean {
  if (enemy.type !== 'spawner') return false;
  
  const spawnInterval = ENEMY_STATS.spawner.spawnInterval;
  if (enemy.attackTimer >= spawnInterval) {
    enemy.attackTimer = 0;
    return true;
  }
  return false;
}

export function findNearbyEnemies(
  position: Vector2,
  enemies: Enemy[],
  radius: number,
  excludeId?: string
): Enemy[] {
  return enemies.filter(enemy => {
    if (enemy.id === excludeId) return false;
    if (enemy.hp <= 0) return false;
    return distance(position, enemy.position) <= radius;
  });
}

export function getEnemiesInColumn(enemies: Enemy[], column: number): Enemy[] {
  return enemies.filter(enemy => enemy.column === column);
}

