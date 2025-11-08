// Main game class - orchestrates all systems

import type {
  GameState,
  InputState,
  BallData,
  Enemy,
  PowerUp,
  Particle,
  Projectile,
  GameProgress,
  UpgradeOption,
  Boss,
  BossType,
  Vector2
} from './types';

import { Renderer } from './renderer';
import { ScrollingBackground } from './background';
import { createInputState, setupInputHandlers, isKeyPressed, getMousePosition, clearMousePress } from './input';
import { createPlayer, updatePlayer, addXP, damagePlayer, healPlayer, removeBallFromInventory, addBallToInventory, selectNextAvailableBall, type Player } from './player';
import { createBall, updateBalls, throwBall, getHeldBall, checkBallEnemyCollisions, predictBallTrajectory } from './ball';
import { createEnemy, updateEnemies, damageEnemy, applyStatusEffect, updateProjectiles, checkEnemyPlayerCollision, checkProjectilePlayerCollision, shouldSpawnerSpawn, findNearbyEnemies } from './enemy';
import { createPowerUp, updatePowerUps, checkPowerUpCollection, applyPowerUp } from './powerup';
import { updateParticles, createExplosionParticles, createImpactParticles, createSparkleParticles } from './particles';
import { generateUpgradeOptions } from './upgrades';
import { renderHUD, renderLevelUpScreen, renderBossHealthBar, renderGameOver } from './ui';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  HUD_HEIGHT,
  COLUMNS,
  COLUMN_WIDTH,
  BALL_STATS,
  ENEMY_STATS,
  POWERUP_DROP_CHANCE,
  POWERUP_ELITE_DROP_CHANCE,
  XP_COLLECTION_RADIUS,
  PLAYER_WIDTH
} from './constants';
import { distance, generateId, randomInt, randomChoice, getColumnFromX, randomRange, getXFromColumn } from './utils';

export class Game {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private background: ScrollingBackground;
  private input: InputState;
  
  // Game state
  state: GameState = 'playing';
  gameTime: number = 0;
  
  // Entities
  player: Player;
  balls: BallData[] = [];
  enemies: Enemy[] = [];
  powerUps: PowerUp[] = [];
  particles: Particle[] = [];
  projectiles: Projectile[] = [];
  xpOrbs: Array<{ id: string; position: Vector2; value: number; magnetTimer: number }> = [];
  
  // Boss
  boss: Boss | null = null;
  
  // Progress
  progress: GameProgress = {
    stage: 1,
    section: 1,
    progress: 0,
    enemiesDefeated: 0,
    bossActive: false
  };
  
  // Upgrade system
  private upgradeOptions: UpgradeOption[] = [];
  private hoveredUpgradeIndex: number = -1;
  private hasRerolled: boolean = false;
  
  // Game modifiers (from upgrades)
  baseDamageBonus: number = 0;
  ballSpeedMultiplier: number = 1;
  piercingCount: number = 0;
  bonusBounces: number = 0;
  explosiveChance: number = 0;
  xpMagnetMultiplier: number = 1;
  dropRateBonus: number = 0;
  xpMultiplier: number = 1;
  hasLifeSteal: boolean = false;
  hasSecondWind: boolean = false;
  secondWindUsed: boolean = false;
  
  // Spawn system
  private spawnTimer: number = 0;
  private lastSpawnProgress: number = 0;
  private currentWaveIndex: number = 0;
  
  // Stats
  stats = {
    enemiesKilled: 0,
    bossesKilled: 0,
    highestCombo: 0
  };
  
  // Animation timers
  private flashAlpha: number = 0;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.background = new ScrollingBackground(canvas);
    this.input = createInputState();
    this.player = createPlayer();
    
    setupInputHandlers(canvas, this.input);
    this.init();
  }
  
  private init(): void {
    // Start with one ball in hand
    const startBall = createBall(
      { x: this.player.position.x, y: this.player.position.y - 20 },
      { x: 0, y: -1 },
      'normal'
    );
    startBall.held = true;
    this.balls.push(startBall);
    
    // Spawn initial enemies
    this.spawnEnemyWave();
  }
  
  update(deltaTime: number): void {
    this.gameTime += deltaTime;
    
    // Update background animation
    this.background.update(deltaTime);
    
    // Update boss fight mode for background
    if (this.boss && !this.boss.defeated) {
      this.background.setBossFightMode(true);
    } else {
      this.background.setBossFightMode(false);
    }
    
    switch (this.state) {
      case 'playing':
        this.updatePlaying(deltaTime);
        break;
      case 'levelup':
        this.updateLevelUp(deltaTime);
        break;
      case 'paused':
        this.updatePaused(deltaTime);
        break;
      case 'gameover':
        this.updateGameOver(deltaTime);
        break;
    }
    
    // Update particles always
    this.particles = updateParticles(this.particles, deltaTime);
    
    // Flash effect decay
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - deltaTime * 2);
    }
  }
  
  private updatePlaying(deltaTime: number): void {
    // Update player
    updatePlayer(this.player, this.input, deltaTime);
    
    // Update balls and check for caught balls
    const ballsBefore = this.balls.filter(b => !b.held).length;
    this.balls = updateBalls(this.balls, this.player.position, deltaTime, this.particles);
    const ballsAfter = this.balls.filter(b => !b.held).length;
    
    // If a ball was caught, add it back to inventory
    if (ballsAfter < ballsBefore) {
      const caughtBall = this.balls.find(b => b.held && !b.active);
      if (!caughtBall) {
        // Find the newly held ball
        const newlyHeldBall = this.balls.find(b => b.held);
        if (newlyHeldBall) {
          addBallToInventory(this.player, newlyHeldBall.type, 1);
        }
      }
    }
    
    // Handle ball throwing
    this.handleBallThrowing();
    
    // Update enemies
    this.enemies = updateEnemies(this.enemies, this.player.position, deltaTime, this.projectiles);
    
    // Update projectiles
    this.projectiles = updateProjectiles(this.projectiles, deltaTime, GAME_HEIGHT);
    
    // Check projectile collisions with player
    this.checkProjectileCollisions();
    
    // Check ball-enemy collisions
    this.checkBallEnemyCollision();
    
    // Check enemy-player collisions
    this.checkEnemyPlayerCollisions();
    
    // Update power-ups
    this.powerUps = updatePowerUps(this.powerUps, deltaTime);
    
    // Check power-up collection
    this.checkPowerUpCollection();
    
    // Update XP orbs
    this.updateXPOrbs(deltaTime);
    
    // Update boss if active
    if (this.boss && !this.boss.defeated) {
      this.updateBoss(deltaTime);
    }
    
    // Update progress and spawning
    this.updateProgress(deltaTime);
    
    // Check for game over
    if (this.player.stats.hp <= 0) {
      this.handleDeath();
    }
    
    // Handle pause
    if (isKeyPressed(this.input, 'escape')) {
      this.state = 'paused';
    }
  }
  
  private handleBallThrowing(): void {
    const heldBall = getHeldBall(this.balls);
    
    if (heldBall) {
      // Update ball position to follow player
      heldBall.position = {
        x: this.player.position.x,
        y: this.player.position.y - 20
      };
      
      // Check for throw input
      if (this.input.mouse.pressed) {
        const mousePos = getMousePosition(this.input);
        const direction = {
          x: mousePos.x - heldBall.position.x,
          y: mousePos.y - heldBall.position.y
        };
        
        throwBall(heldBall, direction);
        clearMousePress(this.input);
        
        // Remove ball from inventory
        removeBallFromInventory(this.player, heldBall.type);
        
        // Auto-select next available ball type and create it immediately
        selectNextAvailableBall(this.player);
        const nextBallType = this.player.selectedBallType;
        
        if (this.player.inventory[nextBallType as keyof typeof this.player.inventory] > 0) {
          // Create next ball immediately with small delay
          setTimeout(() => {
            const newBall = createBall(
              { x: this.player.position.x, y: this.player.position.y - 20 },
              { x: 0, y: -1 },
              nextBallType
            );
            newBall.held = true;
            this.balls.push(newBall);
          }, 100);
        }
      }
    } else {
      // No ball held - auto-create one if available
      selectNextAvailableBall(this.player);
      if (this.player.inventory[this.player.selectedBallType as keyof typeof this.player.inventory] > 0) {
        const newBall = createBall(
          { x: this.player.position.x, y: this.player.position.y - 20 },
          { x: 0, y: -1 },
          this.player.selectedBallType
        );
        newBall.held = true;
        this.balls.push(newBall);
      }
    }
  }
  
  private checkBallEnemyCollision(): void {
    const hits = checkBallEnemyCollisions(
      this.balls,
      this.enemies,
      this.player.damageMultiplier,
      this.particles
    );
    
    hits.forEach(hit => {
      const enemy = this.enemies.find(e => e.id === hit.enemyId);
      if (!enemy) return;
      
      // Apply damage
      let finalDamage = hit.damage + this.baseDamageBonus;
      
      // Check for crit
      if (Math.random() < this.player.critChance) {
        finalDamage *= 2;
      }
      
      damageEnemy(enemy, finalDamage);
      
      // Life steal
      if (this.hasLifeSteal) {
        healPlayer(this.player, finalDamage * 0.05);
      }
      
      // Apply ball type effects
      this.applyBallEffects(hit.ballType, enemy, hit.damage);
      
      // Check if enemy died
      if (enemy.hp <= 0) {
        this.handleEnemyDeath(enemy);
      }
    });
    
    // Check ball-boss collision manually (custom collision for boss)
    if (this.boss && !this.boss.defeated) {
      this.balls.forEach(ball => {
        if (!ball.active || ball.held) return;
        
        // Boss collision box
        const bossRect = {
          x: this.boss!.position.x - 48, // BOSS_WIDTH / 2
          y: this.boss!.position.y - 48, // BOSS_HEIGHT / 2
          width: 96,
          height: 96
        };
        
        // Check if ball hits boss
        const closestX = Math.max(bossRect.x, Math.min(ball.position.x, bossRect.x + bossRect.width));
        const closestY = Math.max(bossRect.y, Math.min(ball.position.y, bossRect.y + bossRect.height));
        const dx = ball.position.x - closestX;
        const dy = ball.position.y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 8) { // BALL_RADIUS
          // Deal damage to boss
          let finalDamage = ball.damage + this.baseDamageBonus;
          
          // Check for crit
          if (Math.random() < this.player.critChance) {
            finalDamage *= 2;
          }
          
          this.boss!.hp -= finalDamage * this.player.damageMultiplier;
          if (this.boss!.hp < 0) this.boss!.hp = 0;
          
          // Life steal
          if (this.hasLifeSteal) {
            healPlayer(this.player, finalDamage * 0.05);
          }
          
          // Create impact particles
          const stats = BALL_STATS[ball.type];
          this.particles.push(...createImpactParticles(ball.position, stats.color, 10));
          
          // Bounce ball
          const normalX = ball.position.x - this.boss!.position.x;
          const normalY = ball.position.y - this.boss!.position.y;
          const magnitude = Math.sqrt(normalX * normalX + normalY * normalY);
          if (magnitude > 0) {
            const nx = normalX / magnitude;
            const ny = normalY / magnitude;
            const dot = ball.velocity.x * nx + ball.velocity.y * ny;
            ball.velocity.x = ball.velocity.x - 2 * dot * nx;
            ball.velocity.y = ball.velocity.y - 2 * dot * ny;
          }
        }
      });
    }
  }
  
  private applyBallEffects(ballType: string, enemy: Enemy, damage: number): void {
    switch (ballType) {
      case 'fire':
        applyStatusEffect(enemy, {
          type: 'burn',
          duration: 3,
          damage: 5,
          tickTimer: 1
        });
        break;
      
      case 'ice':
        applyStatusEffect(enemy, {
          type: 'freeze',
          duration: 2
        });
        // AoE freeze
        const nearbyEnemies = findNearbyEnemies(enemy.position, this.enemies, 30, enemy.id);
        nearbyEnemies.forEach(e => {
          applyStatusEffect(e, { type: 'freeze', duration: 2 });
        });
        break;
      
      case 'lightning':
        // Chain lightning
        let chainTargets = findNearbyEnemies(enemy.position, this.enemies, 100, enemy.id);
        chainTargets = chainTargets.slice(0, 3);
        chainTargets.forEach(target => {
          damageEnemy(target, damage * 0.5);
          this.particles.push(...createImpactParticles(target.position, BALL_STATS.lightning.color, 5));
        });
        break;
      
      case 'bomb':
        // AoE explosion
        const explosionTargets = findNearbyEnemies(enemy.position, this.enemies, 100);
        explosionTargets.forEach(target => {
          damageEnemy(target, 25);
        });
        this.particles.push(...createExplosionParticles(enemy.position, BALL_STATS.bomb.color, 30));
        this.flashAlpha = 0.3;
        break;
      
      case 'poison':
        applyStatusEffect(enemy, {
          type: 'poison',
          duration: 5,
          damage: 3,
          tickTimer: 1
        });
        // Contagion
        const poisonTargets = findNearbyEnemies(enemy.position, this.enemies, 40, enemy.id);
        poisonTargets.slice(0, 2).forEach(target => {
          applyStatusEffect(target, {
            type: 'poison',
            duration: 3,
            damage: 2,
            tickTimer: 1
          });
        });
        break;
    }
  }
  
  private handleEnemyDeath(enemy: Enemy): void {
    this.stats.enemiesKilled++;
    this.progress.enemiesDefeated++;
    
    // Create death particles
    const enemyColor = ENEMY_STATS[enemy.type].color;
    this.particles.push(...createExplosionParticles(enemy.position, enemyColor, 20));
    
    // Drop XP
    const xpValue = Math.floor(enemy.xpValue * this.xpMultiplier);
    this.xpOrbs.push({
      id: generateId(),
      position: { ...enemy.position },
      value: xpValue,
      magnetTimer: 0.5
    });
    
    // Drop power-up chance
    let dropChance = POWERUP_DROP_CHANCE + this.dropRateBonus;
    if (enemy.type === 'elite') {
      dropChance = POWERUP_ELITE_DROP_CHANCE + this.dropRateBonus;
    }
    
    if (Math.random() < dropChance) {
      this.powerUps.push(createPowerUp(enemy.position, enemy.type === 'elite'));
    }
    
    // Handle spawner - spawn enemy on death
    if (enemy.type === 'spawner') {
      const adjacentColumn = enemy.column + (Math.random() > 0.5 ? 1 : -1);
      if (adjacentColumn >= 0 && adjacentColumn < COLUMNS) {
        this.enemies.push(createEnemy('melee', adjacentColumn, enemy.position.y));
      }
    }
  }
  
  private checkEnemyPlayerCollisions(): void {
    this.enemies.forEach(enemy => {
      if (checkEnemyPlayerCollision(enemy, this.player.position, PLAYER_WIDTH)) {
        damagePlayer(this.player, enemy.damage);
        // Remove enemy on collision
        enemy.hp = 0;
      }
    });
  }
  
  private checkProjectileCollisions(): void {
    this.projectiles = this.projectiles.filter(proj => {
      if (checkProjectilePlayerCollision(proj, this.player.position, PLAYER_WIDTH)) {
        damagePlayer(this.player, proj.damage);
        return false;
      }
      return true;
    });
  }
  
  private updateXPOrbs(deltaTime: number): void {
    const magnetRadius = XP_COLLECTION_RADIUS * this.xpMagnetMultiplier;
    const hasMagnetBuff = this.player.buffs.some(b => b.type === 'magnet');
    const effectiveRadius = hasMagnetBuff ? 999999 : magnetRadius;
    
    this.xpOrbs = this.xpOrbs.filter(orb => {
      orb.magnetTimer -= deltaTime;
      
      // Check collection
      const dist = distance(orb.position, this.player.position);
      if (dist < 20) {
        // Collect
        const leveledUp = addXP(this.player, orb.value);
        if (leveledUp) {
          this.handleLevelUp();
        }
        this.particles.push(...createSparkleParticles(orb.position, 8));
        return false;
      }
      
      // Magnet effect - pull towards player when in range
      if (orb.magnetTimer <= 0 && dist < effectiveRadius) {
        const dx = this.player.position.x - orb.position.x;
        const dy = this.player.position.y - orb.position.y;
        const angle = Math.atan2(dy, dx);
        const speed = 400; // Faster magnet pull
        
        orb.position.x += Math.cos(angle) * speed * deltaTime;
        orb.position.y += Math.sin(angle) * speed * deltaTime;
      } else {
        // Always fall down with gravity (not just when timer > 0)
        orb.position.y += 100 * deltaTime; // Gravity effect
      }
      
      // Remove if too far down (off screen)
      return orb.position.y < GAME_HEIGHT + 50;
    });
  }
  
  private checkPowerUpCollection(): void {
    this.powerUps = this.powerUps.filter(powerUp => {
      if (checkPowerUpCollection(powerUp, this.player.position, 30)) {
        applyPowerUp(powerUp, this.player, () => {
          // Bomb effect - damage all enemies on screen
          this.enemies.forEach(enemy => {
            damageEnemy(enemy, 50);
            if (enemy.hp <= 0) {
              this.handleEnemyDeath(enemy);
            }
          });
          this.flashAlpha = 0.5;
        });
        return false;
      }
      return true;
    });
  }
  
  private handleLevelUp(): void {
    this.state = 'levelup';
    this.upgradeOptions = generateUpgradeOptions(this.player.stats.level, []);
    this.hasRerolled = false;
    this.hoveredUpgradeIndex = -1;
    
    // Level up particles
    this.particles.push(...createSparkleParticles(this.player.position, 30));
    this.flashAlpha = 0.4;
  }
  
  private updatePaused(deltaTime: number): void {
    // Press ESC or Enter to resume
    if (isKeyPressed(this.input, 'escape') || isKeyPressed(this.input, 'enter')) {
      this.state = 'playing';
    }
  }
  
  private updateLevelUp(deltaTime: number): void {
    const mousePos = getMousePosition(this.input);
    
    // Check hover - Vertical layout
    const cardWidth = 450;
    const cardHeight = 140;
    const spacing = 15;
    const startY = 140;
    const cardX = (GAME_WIDTH - cardWidth) / 2;
    
    this.hoveredUpgradeIndex = -1;
    for (let i = 0; i < 3; i++) {
      const cardY = startY + (cardHeight + spacing) * i;
      if (
        mousePos.x >= cardX && mousePos.x <= cardX + cardWidth &&
        mousePos.y >= cardY && mousePos.y <= cardY + cardHeight
      ) {
        this.hoveredUpgradeIndex = i;
      }
    }
    
    // Check selection
    if (this.input.mouse.pressed && this.hoveredUpgradeIndex >= 0) {
      const selected = this.upgradeOptions[this.hoveredUpgradeIndex];
      selected.apply(this);
      this.state = 'playing';
      clearMousePress(this.input);
    }
  }
  
  private updateProgress(deltaTime: number): void {
    // Don't progress if boss is active - wait until boss is defeated
    if (this.progress.bossActive && this.boss && !this.boss.defeated) {
      return;
    }
    
    // Progress increases over time - very slow for relaxed gameplay
    this.progress.progress += deltaTime * 1.2; // ~83 seconds to reach 100%
    
    // Only spawn enemies if progress < 100%
    if (this.progress.progress < 100) {
      // Spawn enemies at intervals (every 7% for more frequent waves)
      if (Math.floor(this.progress.progress / 7) > Math.floor(this.lastSpawnProgress / 7)) {
        this.lastSpawnProgress = this.progress.progress;
        this.spawnEnemyWave();
        this.currentWaveIndex++;
      }
    }
    
    // Check for boss spawn at exactly 100%
    if (this.progress.progress >= 100 && !this.progress.bossActive && !this.boss) {
      this.progress.progress = 100; // Cap at 100
      this.spawnBoss();
    }
  }
  
  private spawnEnemyWave(): void {
    // Spawn full row of 8 enemies (one per column) moving together as a wave
    // Fixed patterns that cycle in order (not random)
    const patterns = [
      ['melee', 'archer', 'melee', 'archer', 'melee', 'archer', 'melee', 'archer'],
      ['melee', 'melee', 'archer', 'archer', 'tank', 'melee', 'melee', 'archer'],
      ['archer', 'melee', 'archer', 'tank', 'tank', 'archer', 'melee', 'archer'],
      ['melee', 'archer', 'melee', 'spawner', 'elite', 'melee', 'archer', 'melee'],
      ['tank', 'melee', 'archer', 'melee', 'melee', 'archer', 'melee', 'tank'],
      ['melee', 'archer', 'elite', 'archer', 'archer', 'elite', 'archer', 'melee'],
      ['archer', 'archer', 'melee', 'tank', 'tank', 'melee', 'archer', 'archer'],
      ['melee', 'spawner', 'archer', 'melee', 'melee', 'archer', 'spawner', 'melee'],
    ];
    
    // Use wave index to cycle through patterns in order
    const pattern = patterns[this.currentWaveIndex % patterns.length];
    
    // Spawn all 8 enemies at the same Y position (they move together as a wave)
    const spawnY = HUD_HEIGHT + 20;
    
    for (let column = 0; column < COLUMNS; column++) {
      const enemyType = pattern[column];
      this.enemies.push(createEnemy(enemyType, column, spawnY));
    }
  }
  
  private spawnBoss(): void {
    this.progress.bossActive = true;
    
    // Randomly select boss type
    const bossTypes: BossType[] = ['archer_king', 'brawler_chief', 'dark_mage'];
    const selectedType = randomChoice(bossTypes);
    
    switch (selectedType) {
      case 'archer_king':
        this.boss = {
          id: generateId(),
          name: 'The Archer King',
          type: 'archer_king',
          hp: 500,
          maxHp: 500,
          position: { x: GAME_WIDTH / 2, y: HUD_HEIGHT + 100 },
          phase: 1,
          attackPattern: 'idle',
          attackTimer: 0,
          moveDirection: 1,
          defeated: false
        };
        break;
        
      case 'brawler_chief':
        this.boss = {
          id: generateId(),
          name: 'The Brawler Chief',
          type: 'brawler_chief',
          hp: 800,
          maxHp: 800,
          position: { x: GAME_WIDTH / 2, y: HUD_HEIGHT + 100 },
          phase: 1,
          attackPattern: 'idle',
          attackTimer: 0,
          moveDirection: 1,
          defeated: false,
          specialData: { charging: false, chargeVelocity: { x: 0, y: 0 } }
        };
        break;
        
      case 'dark_mage':
        this.boss = {
          id: generateId(),
          name: 'The Dark Mage',
          type: 'dark_mage',
          hp: 1200,
          maxHp: 1200,
          position: { x: GAME_WIDTH / 2, y: HUD_HEIGHT + 100 },
          phase: 1,
          attackPattern: 'idle',
          attackTimer: 0,
          moveDirection: 1,
          defeated: false,
          specialData: { 
            clones: [],
            homingOrbs: [],
            teleporting: false
          }
        };
        break;
    }
  }
  
  private updateBoss(deltaTime: number): void {
    if (!this.boss) return;
    
    // Check if boss is defeated
    if (this.boss.hp <= 0 && !this.boss.defeated) {
      this.boss.defeated = true;
      this.handleBossDefeat();
      return;
    }
    
    this.boss.attackTimer += deltaTime;
    
    // Update based on boss type
    switch (this.boss.type) {
      case 'archer_king':
        this.updateArcherKing(deltaTime);
        break;
      case 'brawler_chief':
        this.updateBrawlerChief(deltaTime);
        break;
      case 'dark_mage':
        this.updateDarkMage(deltaTime);
        break;
    }
  }
  
  private updateArcherKing(deltaTime: number): void {
    if (!this.boss) return;
    
    // Phase transition
    if (this.boss.hp < this.boss.maxHp / 2 && this.boss.phase === 1) {
      this.boss.phase = 2;
      this.flashAlpha = 0.3;
    }
    
    // Movement in phase 2
    if (this.boss.phase === 2) {
      this.boss.position.x += this.boss.moveDirection * 50 * deltaTime;
      if (this.boss.position.x < 100 || this.boss.position.x > GAME_WIDTH - 100) {
        this.boss.moveDirection *= -1;
      }
    }
    
    // Attack patterns
    const attackSpeed = this.boss.phase === 1 ? 4 : 2.5;
    if (this.boss.attackTimer >= attackSpeed) {
      this.bossAttack();
      this.boss.attackTimer -= attackSpeed;
    }
  }
  
  private updateBrawlerChief(deltaTime: number): void {
    if (!this.boss) return;
    
    // Phase transitions
    const hpPercent = this.boss.hp / this.boss.maxHp;
    if (hpPercent < 0.6 && this.boss.phase === 1) {
      this.boss.phase = 2;
      this.flashAlpha = 0.3;
    } else if (hpPercent < 0.3 && this.boss.phase === 2) {
      this.boss.phase = 3;
      this.flashAlpha = 0.4;
    }
    
    // Handle charging
    if (this.boss.specialData?.charging) {
      this.boss.position.x += this.boss.specialData.chargeVelocity.x * deltaTime;
      this.boss.position.y += this.boss.specialData.chargeVelocity.y * deltaTime;
      
      // Stop charge if hit wall
      if (this.boss.position.x < 50 || this.boss.position.x > GAME_WIDTH - 50) {
        this.boss.specialData.charging = false;
      }
    }
    
    // Attack patterns
    const attackSpeed = 3.5;
    if (this.boss.attackTimer >= attackSpeed) {
      this.brawlerAttack();
      this.boss.attackTimer -= attackSpeed;
    }
  }
  
  private updateDarkMage(deltaTime: number): void {
    if (!this.boss) return;
    
    // Phase transitions
    const hpPercent = this.boss.hp / this.boss.maxHp;
    if (hpPercent < 0.6 && this.boss.phase === 1) {
      this.boss.phase = 2;
      this.flashAlpha = 0.3;
    } else if (hpPercent < 0.3 && this.boss.phase === 2) {
      this.boss.phase = 3;
      this.flashAlpha = 0.4;
    }
    
    // Update homing orbs
    if (this.boss.specialData?.homingOrbs) {
      this.boss.specialData.homingOrbs = this.boss.specialData.homingOrbs.filter((orb: any) => {
        // Move toward player
        const dx = this.player.position.x - orb.position.x;
        const dy = this.player.position.y - orb.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 10) {
          orb.position.x += (dx / dist) * 100 * deltaTime;
          orb.position.y += (dy / dist) * 100 * deltaTime;
        }
        
        // Check collision with player
        if (dist < 20) {
          damagePlayer(this.player, 5);
          return false;
        }
        
        return orb.hp > 0;
      });
    }
    
    // Attack patterns
    const attackSpeed = 3;
    if (this.boss.attackTimer >= attackSpeed) {
      this.darkMageAttack();
      this.boss.attackTimer -= attackSpeed;
    }
  }
  
  private bossAttack(): void {
    if (!this.boss || this.boss.defeated) return;
    
    // Different attack patterns based on phase and attack count
    const attackCount = Math.floor(this.boss.attackTimer / 5);
    const pattern = attackCount % 4;
    
    if (this.boss.phase === 1) {
      // Phase 1 patterns
      switch (pattern) {
        case 0:
          // Single aimed shot
          this.bossAimedShot();
          break;
        case 1:
          // Triple spread
          this.bossTripleShot();
          break;
        case 2:
          // Cross pattern
          this.bossCrossShot();
          break;
        case 3:
          // Single aimed shot
          this.bossAimedShot();
          break;
      }
    } else {
      // Phase 2 - more aggressive patterns
      switch (pattern) {
        case 0:
          // Spiral
          this.bossSpiralShot();
          break;
        case 1:
          // Five spread
          this.bossFiveSpreadShot();
          break;
        case 2:
          // Aimed barrage
          this.bossAimedBarrage();
          break;
        case 3:
          // Circle burst
          this.bossCircleBurst();
          break;
      }
    }
  }
  
  private bossAimedShot(): void {
    if (!this.boss) return;
    
    const angle = Math.atan2(
      this.player.position.y - this.boss.position.y,
      this.player.position.x - this.boss.position.x
    );
    
    this.projectiles.push({
      id: generateId(),
      type: 'arrow',
      position: { ...this.boss.position },
      velocity: {
        x: Math.cos(angle) * 150,
        y: Math.sin(angle) * 150
      },
      damage: 10,
      owner: this.boss.id
    });
  }
  
  private bossTripleShot(): void {
    if (!this.boss) return;
    
    const baseAngle = Math.atan2(
      this.player.position.y - this.boss.position.y,
      this.player.position.x - this.boss.position.x
    );
    
    for (let i = -1; i <= 1; i++) {
      const angle = baseAngle + (i * 0.3);
      this.projectiles.push({
        id: generateId(),
        type: 'arrow',
        position: { ...this.boss.position },
        velocity: {
          x: Math.cos(angle) * 150,
          y: Math.sin(angle) * 150
        },
        damage: 10,
        owner: this.boss.id
      });
    }
  }
  
  private bossCrossShot(): void {
    if (!this.boss) return;
    
    const directions = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    directions.forEach(angle => {
      this.projectiles.push({
        id: generateId(),
        type: 'arrow',
        position: { ...this.boss!.position },
        velocity: {
          x: Math.cos(angle) * 120,
          y: Math.sin(angle) * 120
        },
        damage: 10,
        owner: this.boss!.id
      });
    });
  }
  
  private bossSpiralShot(): void {
    if (!this.boss) return;
    
    const count = 6;
    const offset = (Date.now() / 100) % (Math.PI * 2);
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i / count) + offset;
      this.projectiles.push({
        id: generateId(),
        type: 'arrow',
        position: { ...this.boss.position },
        velocity: {
          x: Math.cos(angle) * 130,
          y: Math.sin(angle) * 130
        },
        damage: 10,
        owner: this.boss.id
      });
    }
  }
  
  private bossFiveSpreadShot(): void {
    if (!this.boss) return;
    
    const baseAngle = Math.atan2(
      this.player.position.y - this.boss.position.y,
      this.player.position.x - this.boss.position.x
    );
    
    for (let i = -2; i <= 2; i++) {
      const angle = baseAngle + (i * 0.25);
      this.projectiles.push({
        id: generateId(),
        type: 'arrow',
        position: { ...this.boss.position },
        velocity: {
          x: Math.cos(angle) * 140,
          y: Math.sin(angle) * 140
        },
        damage: 10,
        owner: this.boss.id
      });
    }
  }
  
  private bossAimedBarrage(): void {
    if (!this.boss) return;
    
    const angle = Math.atan2(
      this.player.position.y - this.boss.position.y,
      this.player.position.x - this.boss.position.x
    );
    
    // Fire 3 shots in quick succession with slight spread
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!this.boss || this.boss.defeated) return;
        
        const spread = (Math.random() - 0.5) * 0.3;
        this.projectiles.push({
          id: generateId(),
          type: 'arrow',
          position: { ...this.boss.position },
          velocity: {
            x: Math.cos(angle + spread) * 160,
            y: Math.sin(angle + spread) * 160
          },
          damage: 10,
          owner: this.boss.id
        });
      }, i * 200);
    }
  }
  
  private bossCircleBurst(): void {
    if (!this.boss) return;
    
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      this.projectiles.push({
        id: generateId(),
        type: 'arrow',
        position: { ...this.boss.position },
        velocity: {
          x: Math.cos(angle) * 120,
          y: Math.sin(angle) * 120
        },
        damage: 10,
        owner: this.boss.id
      });
    }
  }
  
  // Brawler Chief attack patterns
  private brawlerAttack(): void {
    if (!this.boss) return;
    
    const pattern = randomInt(0, 2);
    
    switch (pattern) {
      case 0:
        this.brawlerCharge();
        break;
      case 1:
        this.brawlerGroundPound();
        break;
      case 2:
        this.brawlerSwordSlash();
        break;
    }
  }
  
  private brawlerCharge(): void {
    if (!this.boss || this.boss.specialData?.charging) return;
    
    const chargeSpeed = this.boss.phase >= 2 ? 500 : 400;
    const direction = this.player.position.x > this.boss.position.x ? 1 : -1;
    
    this.boss.specialData.charging = true;
    this.boss.specialData.chargeVelocity = {
      x: direction * chargeSpeed,
      y: 0
    };
    
    // Stop charge after 1 second
    setTimeout(() => {
      if (this.boss) this.boss.specialData.charging = false;
    }, 1000);
  }
  
  private brawlerGroundPound(): void {
    if (!this.boss) return;
    
    // Create shockwave effect
    this.flashAlpha = 0.2;
    
    // Check if player in range
    const dist = distance(this.boss.position, this.player.position);
    if (dist < 150) {
      damagePlayer(this.player, 25);
    }
    
    // Summon enemies
    const enemyCount = this.boss.phase >= 2 ? 4 : 2;
    for (let i = 0; i < enemyCount; i++) {
      const column = randomInt(0, COLUMNS - 1);
      this.enemies.push(createEnemy('melee', column, HUD_HEIGHT + 20));
    }
  }
  
  private brawlerSwordSlash(): void {
    if (!this.boss) return;
    
    // Create projectile waves across columns
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!this.boss) return;
        
        this.projectiles.push({
          id: generateId(),
          type: 'arrow',
          position: { ...this.boss.position },
          velocity: { x: 0, y: 200 },
          damage: 15,
          owner: this.boss.id
        });
      }, i * 300);
    }
  }
  
  // Dark Mage attack patterns
  private darkMageAttack(): void {
    if (!this.boss) return;
    
    const pattern = randomInt(0, 2);
    
    switch (pattern) {
      case 0:
        this.darkMageMissiles();
        break;
      case 1:
        this.darkMageTeleport();
        break;
      case 2:
        if (this.boss.phase >= 3) {
          this.darkMageMeteor();
        } else {
          this.darkMageMissiles();
        }
        break;
    }
  }
  
  private darkMageMissiles(): void {
    if (!this.boss) return;
    
    // Spawn 4 homing orbs
    const count = 4;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const offset = 60;
      
      this.boss.specialData.homingOrbs.push({
        id: generateId(),
        position: {
          x: this.boss.position.x + Math.cos(angle) * offset,
          y: this.boss.position.y + Math.sin(angle) * offset
        },
        hp: 10
      });
    }
  }
  
  private darkMageTeleport(): void {
    if (!this.boss || this.boss.specialData?.teleporting) return;
    
    this.boss.specialData.teleporting = true;
    const oldPos = { ...this.boss.position };
    
    // Teleport after 0.5s
    setTimeout(() => {
      if (!this.boss) return;
      
      // New random position
      this.boss.position = {
        x: randomRange(150, GAME_WIDTH - 150),
        y: randomRange(HUD_HEIGHT + 100, HUD_HEIGHT + 200)
      };
      
      // Summon archers at old position
      for (let i = 0; i < 3; i++) {
        const column = getColumnFromX(oldPos.x, COLUMN_WIDTH);
        this.enemies.push(createEnemy('archer', column, oldPos.y));
      }
      
      this.boss.specialData.teleporting = false;
    }, 500);
  }
  
  private darkMageMeteor(): void {
    if (!this.boss) return;
    
    // Spawn meteors in random columns
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const column = randomInt(0, COLUMNS - 1);
        const x = getXFromColumn(column, COLUMN_WIDTH);
        
        this.projectiles.push({
          id: generateId(),
          type: 'arrow',
          position: { x, y: HUD_HEIGHT + 20 },
          velocity: { x: 0, y: 250 },
          damage: 30,
          owner: this.boss?.id || ''
        });
      }, i * 300);
    }
  }
  
  private handleBossDefeat(): void {
    if (!this.boss) return;
    
    // Create explosion effects
    this.particles.push(...createExplosionParticles(this.boss.position, '#FFD700', 50));
    this.flashAlpha = 0.6;
    
    // Drop rewards
    for (let i = 0; i < 10; i++) {
      this.xpOrbs.push({
        id: generateId(),
        position: {
          x: this.boss.position.x + randomRange(-50, 50),
          y: this.boss.position.y + randomRange(-50, 50)
        },
        value: 50,
        magnetTimer: 0.5
      });
    }
    
    // Drop power-ups
    for (let i = 0; i < 3; i++) {
      this.powerUps.push(createPowerUp({
        x: this.boss.position.x + randomRange(-60, 60),
        y: this.boss.position.y + randomRange(-40, 40)
      }, true));
    }
    
    // Update stats
    this.stats.bossesKilled++;
    
    // Reset progress for next stage after 2 seconds
    setTimeout(() => {
      this.progress.progress = 0;
      this.progress.bossActive = false;
      this.lastSpawnProgress = 0;
      this.boss = null;
      this.progress.section++;
    }, 2000);
  }
  
  private handleDeath(): void {
    // Check second wind
    if (this.hasSecondWind && !this.secondWindUsed) {
      this.player.stats.hp = this.player.stats.maxHp * 0.5;
      this.secondWindUsed = true;
      this.flashAlpha = 0.6;
      return;
    }
    
    this.state = 'gameover';
  }
  
  private updateGameOver(deltaTime: number): void {
    if (this.input.mouse.pressed) {
      // Restart game
      location.reload();
    }
  }
  
  render(): void {
    // Render animated background
    this.background.render();
    
    // Render game entities
    this.renderGameWorld();
    
    // Render UI based on state
    switch (this.state) {
      case 'playing':
        renderHUD(this.renderer, this.player, this.progress, this.gameTime);
        if (this.boss && !this.boss.defeated) {
          renderBossHealthBar(this.renderer, this.boss);
        }
        break;
      
      case 'levelup':
        renderHUD(this.renderer, this.player, this.progress, this.gameTime);
        renderLevelUpScreen(this.renderer, this.player, this.upgradeOptions, this.hoveredUpgradeIndex);
        break;
      
      case 'paused':
        renderHUD(this.renderer, this.player, this.progress, this.gameTime);
        if (this.boss && !this.boss.defeated) {
          renderBossHealthBar(this.renderer, this.boss);
        }
        this.renderPauseScreen();
        break;
      
      case 'gameover':
        renderGameOver(this.renderer, {
          level: this.player.stats.level,
          enemiesKilled: this.stats.enemiesKilled,
          time: this.gameTime
        });
        break;
    }
    
    // Flash effect
    if (this.flashAlpha > 0) {
      this.renderer.drawFlash(this.flashAlpha);
    }
  }
  
  private renderGameWorld(): void {
    // Render enemies
    this.enemies.forEach(enemy => {
      this.renderer.drawEnemy(enemy);
    });
    
    // Render boss
    if (this.boss && !this.boss.defeated) {
      this.renderer.drawBoss(this.boss);
    }
    
    // Render projectiles
    this.projectiles.forEach(proj => {
      this.renderer.drawProjectile(proj);
    });
    
    // Render XP orbs
    this.xpOrbs.forEach(orb => {
      this.renderer.drawXPOrb(orb.position);
    });
    
    // Render power-ups
    this.powerUps.forEach(powerUp => {
      this.renderer.drawPowerUp(powerUp);
    });
    
    // Render balls
    this.balls.forEach(ball => {
      const stats = BALL_STATS[ball.type];
      this.renderer.drawBall(ball, stats.color);
    });
    
    // Render trajectory prediction
    const heldBall = getHeldBall(this.balls);
    if (heldBall) {
      const mousePos = getMousePosition(this.input);
      const direction = {
        x: mousePos.x - heldBall.position.x,
        y: mousePos.y - heldBall.position.y
      };
      
      const trajectory = predictBallTrajectory(heldBall.position, direction, heldBall.speed, 3);
      for (let i = 0; i < trajectory.length - 1; i++) {
        this.renderer.drawDottedLine(trajectory[i], trajectory[i + 1], BALL_STATS[heldBall.type].color, 3);
      }
    }
    
    // Render player
    this.renderer.drawPlayer(
      this.player.position,
      this.player.stats.invincibilityTimer > 0
    );
    
    // Render particles
    this.particles.forEach(particle => {
      this.renderer.drawParticle(particle);
    });
  }
  
  private renderPauseScreen(): void {
    // Semi-transparent overlay
    this.renderer.drawRect(
      { x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT },
      '#000000',
      0.7
    );
    
    // Pause panel
    const panelWidth = 400;
    const panelHeight = 300;
    const panelX = (GAME_WIDTH - panelWidth) / 2;
    const panelY = (GAME_HEIGHT - panelHeight) / 2;
    
    // Panel background
    this.renderer.drawRect(
      { x: panelX, y: panelY, width: panelWidth, height: panelHeight },
      '#1a1a2e',
      1
    );
    
    // Panel border with glow
    this.renderer.drawRectStrokeWithGlow(
      { x: panelX, y: panelY, width: panelWidth, height: panelHeight },
      '#00ffff',
      3,
      20
    );
    
    // Title
    this.renderer.drawTextWithOutline(
      '⏸️ PAUSED',
      { x: GAME_WIDTH / 2, y: panelY + 60 },
      '#00ffff',
      '#000000',
      32
    );
    
    // Instructions
    const centerX = GAME_WIDTH / 2;
    const startY = panelY + 130;
    const lineHeight = 40;
    
    this.renderer.drawTextWithOutline(
      'Press ESC or ENTER',
      { x: centerX, y: startY },
      '#FFFFFF',
      '#000000',
      16
    );
    
    this.renderer.drawTextWithOutline(
      'to continue',
      { x: centerX, y: startY + lineHeight },
      '#FFFFFF',
      '#000000',
      16
    );
    
    // Animated indicator
    const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
    this.renderer.saveContext();
    this.renderer.setGlobalAlpha(pulse);
    this.renderer.drawTextWithOutline(
      '▶',
      { x: centerX, y: startY + lineHeight * 2.5 },
      '#4AFF4A',
      '#000000',
      24
    );
    this.renderer.restoreContext();
  }
}

