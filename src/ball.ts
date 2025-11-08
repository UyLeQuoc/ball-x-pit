// Ball physics and mechanics system

import type { BallData, Vector2, Enemy, Particle } from './types';
import { 
  BALL_RADIUS, 
  BALL_BASE_SPEED,
  BALL_STATS,
  GAME_WIDTH,
  GAME_HEIGHT,
  HUD_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from './constants';
import { 
  normalize, 
  multiply, 
  add, 
  reflectVector, 
  circleCircleCollision,
  circleRectCollision
} from './utils';
import { createImpactParticles, createTrailParticle } from './particles';

export function createBall(
  position: Vector2,
  direction: Vector2,
  type: string = 'normal'
): BallData {
  const stats = BALL_STATS[type as keyof typeof BALL_STATS] || BALL_STATS.normal;
  const velocity = multiply(normalize(direction), BALL_BASE_SPEED * stats.speed);
  
  return {
    type: type as any,
    position: { ...position },
    velocity,
    damage: stats.damage,
    speed: BALL_BASE_SPEED * stats.speed,
    active: true,
    held: false
  };
}

export function updateBalls(
  balls: BallData[],
  playerPos: Vector2,
  deltaTime: number,
  particles: Particle[]
): BallData[] {
  const trailTimer = Math.floor(Date.now() / 50);
  
  return balls.filter(ball => {
    if (!ball.active) return false;
    if (ball.held) return true;
    
    // Update position
    ball.position.x += ball.velocity.x * deltaTime;
    ball.position.y += ball.velocity.y * deltaTime;
    
    // Create trail particles
    if (trailTimer % 1 === 0) {
      const stats = BALL_STATS[ball.type];
      particles.push(createTrailParticle(ball.position, stats.color));
    }
    
    // Check wall collisions
    if (ball.position.x - BALL_RADIUS <= 0) {
      ball.position.x = BALL_RADIUS;
      ball.velocity.x = Math.abs(ball.velocity.x);
    }
    if (ball.position.x + BALL_RADIUS >= GAME_WIDTH) {
      ball.position.x = GAME_WIDTH - BALL_RADIUS;
      ball.velocity.x = -Math.abs(ball.velocity.x);
    }
    
    // Check top collision
    if (ball.position.y - BALL_RADIUS <= HUD_HEIGHT) {
      ball.position.y = HUD_HEIGHT + BALL_RADIUS;
      ball.velocity.y = Math.abs(ball.velocity.y);
    }
    
    // Check player collision (shield paddle) - bounce ball upward
    if (ball.velocity.y > 0) {
      // Shield/paddle is slightly above player center
      const paddleRect = {
        x: playerPos.x - PLAYER_WIDTH / 2 - 25, // Wider than player (increased from -10 to -25)
        y: playerPos.y - PLAYER_HEIGHT / 2 - 15, // Above player
        width: PLAYER_WIDTH + 50, // Increased from +20 to +50
        height: 10 // Increased from 8 to 10
      };
      
      if (circleRectCollision(ball.position, BALL_RADIUS, paddleRect)) {
        // Bounce ball upward with angle based on hit position
        const hitOffset = (ball.position.x - playerPos.x) / (PLAYER_WIDTH / 2);
        ball.velocity.x = hitOffset * ball.speed * 0.5;
        ball.velocity.y = -Math.abs(ball.velocity.y);
        ball.position.y = paddleRect.y - BALL_RADIUS;
        return true;
      }
    }
    
      // Ball reaches bottom
      if (ball.position.y + BALL_RADIUS >= GAME_HEIGHT - 80) {
        if (ball.type === 'normal') {
          // Normal balls are NOT lost - return to inventory
          ball.velocity = { x: 0, y: 0 };
          ball.active = false; // Mark for collection
          return true; // Keep in array for collection
        } else {
          // Other ball types (lightning, ghost, bomb) are LOST
          return false; // Remove from game
        }
      }
    
    return true;
  });
}

export function throwBall(ball: BallData, direction: Vector2): void {
  ball.held = false;
  const normalized = normalize(direction);
  ball.velocity = multiply(normalized, ball.speed);
  ball.active = true;
}

export function checkBallEnemyCollisions(
  balls: BallData[],
  enemies: Enemy[],
  damageMultiplier: number,
  particles: Particle[]
): { enemyId: string; damage: number; ballType: string }[] {
  const hits: { enemyId: string; damage: number; ballType: string }[] = [];
  
  balls.forEach(ball => {
    if (!ball.active || ball.held) return;
    
    enemies.forEach(enemy => {
      if (enemy.hp <= 0) return;
      
      const enemyRadius = enemy.size / 2;
      if (circleCircleCollision(ball.position, BALL_RADIUS, enemy.position, enemyRadius)) {
        // Calculate damage
        let damage = ball.damage * damageMultiplier;
        
        // Register hit
        hits.push({
          enemyId: enemy.id,
          damage,
          ballType: ball.type
        });
        
        // Create impact particles
        const stats = BALL_STATS[ball.type];
        particles.push(...createImpactParticles(ball.position, stats.color, 10));
        
        // Bounce ball off enemy (ghost and lightning phase through)
        if (ball.type !== 'ghost' && ball.type !== 'lightning') {
          const dx = ball.position.x - enemy.position.x;
          const dy = ball.position.y - enemy.position.y;
          const normal = normalize({ x: dx, y: dy });
          ball.velocity = multiply(reflectVector(ball.velocity, normal), 1);
          
          // Push ball away from enemy to prevent multiple hits
          ball.position = add(ball.position, multiply(normal, enemyRadius + BALL_RADIUS + 2));
        }
        
        // Handle bomb ball (one-time use)
        if (ball.type === 'bomb') {
          ball.active = false;
        }
      }
    });
  });
  
  return hits;
}

export function predictBallTrajectory(
  startPos: Vector2,
  direction: Vector2,
  speed: number,
  bounces: number = 3
): Vector2[] {
  const points: Vector2[] = [{ ...startPos }];
  
  let pos = { ...startPos };
  let vel = multiply(normalize(direction), speed);
  const timeStep = 0.016; // ~60 FPS
  const maxIterations = 100;
  let iteration = 0;
  let bouncesLeft = bounces;
  
  while (bouncesLeft > 0 && iteration < maxIterations) {
    // Simulate step
    pos = add(pos, multiply(vel, timeStep));
    iteration++;
    
    // Check walls
    if (pos.x <= 0 || pos.x >= GAME_WIDTH) {
      vel.x *= -1;
      pos.x = pos.x <= 0 ? 0 : GAME_WIDTH;
      points.push({ ...pos });
      bouncesLeft--;
    }
    
    // Check top
    if (pos.y <= HUD_HEIGHT) {
      vel.y *= -1;
      pos.y = HUD_HEIGHT;
      points.push({ ...pos });
      bouncesLeft--;
    }
    
    // Stop at bottom
    if (pos.y >= GAME_HEIGHT) {
      break;
    }
  }
  
  return points;
}

export function getHeldBall(balls: BallData[]): BallData | undefined {
  return balls.find(ball => ball.held);
}

export function hasActiveBalls(balls: BallData[]): boolean {
  return balls.some(ball => ball.active && !ball.held);
}

