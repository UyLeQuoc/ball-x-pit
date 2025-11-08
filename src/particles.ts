// Particle system

import type { Particle, Vector2 } from './types';
import { generateId, randomRange } from './utils';
import { PARTICLE_LIFETIME } from './constants';

export function createImpactParticles(
  position: Vector2,
  color: string,
  count: number = 10
): Particle[] {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + randomRange(-0.2, 0.2);
    const speed = randomRange(150, 250);
    
    particles.push({
      id: generateId(),
      position: { ...position },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      color,
      size: randomRange(2, 6),
      lifetime: PARTICLE_LIFETIME,
      alpha: 1,
      rotation: randomRange(0, Math.PI * 2),
      rotationSpeed: randomRange(-5, 5)
    });
  }
  
  return particles;
}

export function createExplosionParticles(
  position: Vector2,
  color: string,
  count: number = 25
): Particle[] {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = randomRange(0, Math.PI * 2);
    const speed = randomRange(200, 400);
    
    particles.push({
      id: generateId(),
      position: { ...position },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      color,
      size: randomRange(4, 10),
      lifetime: randomRange(0.8, 1.5),
      alpha: 1,
      rotation: randomRange(0, Math.PI * 2),
      rotationSpeed: randomRange(-8, 8)
    });
  }
  
  return particles;
}

export function createTrailParticle(position: Vector2, color: string): Particle {
  return {
    id: generateId(),
    position: { ...position },
    velocity: { x: 0, y: 0 },
    color,
    size: 4,
    lifetime: 0.3,
    alpha: 0.8,
    rotation: 0,
    rotationSpeed: 0
  };
}

export function createSparkleParticles(position: Vector2, count: number = 15): Particle[] {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = randomRange(0, Math.PI * 2);
    const speed = randomRange(50, 150);
    
    particles.push({
      id: generateId(),
      position: { ...position },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 50 // Upward bias
      },
      color: '#FFD700',
      size: randomRange(2, 5),
      lifetime: randomRange(0.5, 1.0),
      alpha: 1,
      rotation: 0,
      rotationSpeed: randomRange(-10, 10)
    });
  }
  
  return particles;
}

export function updateParticles(particles: Particle[], deltaTime: number): Particle[] {
  return particles
    .map(particle => {
      // Update position
      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      
      // Apply gravity
      particle.velocity.y += 200 * deltaTime;
      
      // Update rotation
      particle.rotation += particle.rotationSpeed * deltaTime;
      
      // Update lifetime and alpha
      particle.lifetime -= deltaTime;
      particle.alpha = Math.max(0, particle.lifetime / PARTICLE_LIFETIME);
      
      return particle;
    })
    .filter(particle => particle.lifetime > 0);
}

