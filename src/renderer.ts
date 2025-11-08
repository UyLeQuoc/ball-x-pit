// Rendering system

import type { Vector2, Rectangle, BallData, Enemy, PowerUp, Particle, Boss, Projectile } from './types';
import { COLORS, BALL_RADIUS, PLAYER_WIDTH, PLAYER_HEIGHT } from './constants';
import { getSprite } from './sprites';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private spritesLoaded: boolean = false;
  
  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    
    // Preload all sprites
    this.preloadSprites();
  }
  
  private preloadSprites(): void {
    // Load all sprites
    const spriteNames = [
      'player',
      'enemy_melee',
      'enemy_archer',
      'enemy_tank',
      'enemy_elite',
      'enemy_spawner',
      'boss_archer_king',
      'boss_brawler_chief',
      'boss_dark_mage',
      'xp_orb',
      'projectile_arrow',
      'projectile_magic',
      'powerup_health',
      'powerup_speed',
      'powerup_damage',
      'powerup_shield',
      'powerup_xp',
      'powerup_invincibility',
      'powerup_magnet',
      'powerup_freeze',
      'powerup_bomb'
    ] as const;
    
    let loadedCount = 0;
    spriteNames.forEach(name => {
      const img = getSprite(name);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === spriteNames.length) {
          this.spritesLoaded = true;
        }
      };
    });
  }
  
  clear(): void {
    this.ctx.fillStyle = '#0f0f1e';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
  
  // Basic shapes
  drawRect(rect: Rectangle, color: string, alpha: number = 1): void {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.restore();
  }
  
  drawRectOutline(rect: Rectangle, color: string, lineWidth: number = 2): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }
  
  drawRectStrokeWithGlow(rect: Rectangle, color: string, lineWidth: number = 2, glowSize: number = 20): void {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.shadowBlur = glowSize;
    this.ctx.shadowColor = color;
    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.restore();
  }
  
  saveContext(): void {
    this.ctx.save();
  }
  
  restoreContext(): void {
    this.ctx.restore();
  }
  
  setGlobalAlpha(alpha: number): void {
    this.ctx.globalAlpha = alpha;
  }
  
  drawCircle(pos: Vector2, radius: number, color: string, alpha: number = 1): void {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
  
  drawCircleOutline(pos: Vector2, radius: number, color: string, lineWidth: number = 2): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }
  
  drawLine(from: Vector2, to: Vector2, color: string, lineWidth: number = 2): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }
  
  drawDottedLine(from: Vector2, to: Vector2, color: string, dashLength: number = 5): void {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.6;
    this.ctx.setLineDash([dashLength, dashLength]);
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
    this.ctx.restore();
  }
  
  // Text rendering
  drawText(text: string, pos: Vector2, color: string, size: number = 16, align: CanvasTextAlign = 'left'): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px 'Press Start 2P', 'Courier New', monospace`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, pos.x, pos.y);
  }
  
  drawTextWithOutline(
    text: string,
    pos: Vector2,
    color: string,
    outlineColor: string,
    size: number = 16,
    align: CanvasTextAlign = 'center'
  ): void {
    this.ctx.font = `${size}px 'Press Start 2P', 'Courier New', monospace`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'middle';
    
    // Outline
    this.ctx.strokeStyle = outlineColor;
    this.ctx.lineWidth = 3;
    this.ctx.strokeText(text, pos.x, pos.y);
    
    // Fill
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, pos.x, pos.y);
  }
  
  // Game entities
  drawPlayer(pos: Vector2, flashing: boolean = false): void {
    if (flashing && Math.floor(Date.now() / 100) % 2 === 0) return;
    
    // Use sprite if loaded, otherwise fallback to simple shapes
    if (this.spritesLoaded) {
      const sprite = getSprite('player');
      this.ctx.drawImage(
        sprite,
        pos.x - PLAYER_WIDTH / 2,
        pos.y - PLAYER_HEIGHT / 2,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
    } else {
      // Fallback rendering
      this.ctx.fillStyle = COLORS.ui_border;
      this.ctx.fillRect(
        pos.x - PLAYER_WIDTH / 2,
        pos.y - PLAYER_HEIGHT / 2,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
      
      // Eyes
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(pos.x - 8, pos.y - 6, 6, 6);
      this.ctx.fillRect(pos.x + 2, pos.y - 6, 6, 6);
    }
  }
  
  drawBall(ball: BallData, color: string): void {
    if (!ball.active) return;
    
    // Glow effect
    const gradient = this.ctx.createRadialGradient(
      ball.position.x, ball.position.y, 0,
      ball.position.x, ball.position.y, BALL_RADIUS * 2
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color + '80');
    gradient.addColorStop(1, color + '00');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(ball.position.x, ball.position.y, BALL_RADIUS * 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Core
    this.drawCircle(ball.position, BALL_RADIUS, color);
    
    // Highlight
    this.ctx.save();
    this.ctx.globalAlpha = 0.5;
    this.drawCircle(
      { x: ball.position.x - 2, y: ball.position.y - 2 },
      BALL_RADIUS / 3,
      '#ffffff'
    );
    this.ctx.restore();
  }
  
  drawEnemy(enemy: Enemy): void {
    const size = enemy.size;
    const x = enemy.position.x - size / 2;
    const y = enemy.position.y - size / 2;
    
    // Use sprite if loaded, otherwise fallback
    if (this.spritesLoaded) {
      const spriteMap = {
        'melee': 'enemy_melee',
        'archer': 'enemy_archer',
        'tank': 'enemy_tank',
        'elite': 'enemy_elite',
        'spawner': 'enemy_spawner'
      } as const;
      
      const spriteName = spriteMap[enemy.type];
      const sprite = getSprite(spriteName);
      
      // Apply slow effect (tint blue)
      const hasSlowEffect = enemy.statusEffects?.some(effect => effect.type === 'slow');
      if (hasSlowEffect) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = '#4A9EFF';
        this.ctx.fillRect(x, y, size, size);
        this.ctx.restore();
      }
      
      this.ctx.drawImage(sprite, x, y, size, size);
    } else {
      // Fallback rendering
      let color = COLORS.enemy_melee;
      switch (enemy.type) {
        case 'archer': color = COLORS.enemy_archer; break;
        case 'tank': color = COLORS.enemy_tank; break;
        case 'elite': color = COLORS.enemy_elite; break;
        case 'spawner': color = COLORS.enemy_spawner; break;
      }
      
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, size, size);
    }
    
    // HP bar
    const hpBarWidth = size;
    const hpBarHeight = 4;
    const hpPercent = enemy.hp / enemy.maxHp;
    
    // HP bar background
    this.ctx.fillStyle = '#333333';
    this.ctx.fillRect(x, y - 8, hpBarWidth, hpBarHeight);
    
    // HP bar fill
    let hpColor = COLORS.hp_full;
    if (hpPercent < 0.3) hpColor = COLORS.hp_low;
    else if (hpPercent < 0.7) hpColor = COLORS.hp_medium;
    
    this.ctx.fillStyle = hpColor;
    this.ctx.fillRect(x, y - 8, hpBarWidth * hpPercent, hpBarHeight);
    
    // Elite glow
    if (enemy.type === 'elite') {
      this.ctx.save();
      this.ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 200) * 0.2;
      this.drawCircle(enemy.position, size, '#FFD700');
      this.ctx.restore();
    }
  }
  
  drawPowerUp(powerUp: PowerUp): void {
    const blinking = powerUp.lifetime < 2 && Math.floor(Date.now() / 200) % 2 === 0;
    if (blinking) return;
    
    // Use emoji rendering instead of SVG
    const colors: Record<string, string> = {
      health: '#4AFF4A',
      speed: '#4AFFFF',
      damage: '#FF4A4A',
      shield: '#4A9EFF',
      xp: '#FFD700',
      invincibility: '#FFD700',
      magnet: '#C94AFF',
      freeze: '#4A9EFF',
      bomb: '#FF8800'
    };
    
    const emojis: Record<string, string> = {
      health: '❤️',
      speed: '⚡',
      damage: '💪',
      shield: '🛡️',
      xp: '✨',
      invincibility: '⭐',
      magnet: '🧲',
      freeze: '❄️',
      bomb: '💣'
    };
    
    const color = colors[powerUp.type] || '#FFFFFF';
    const emoji = emojis[powerUp.type] || '?';
    const size = 32;
    
    // Floating animation
    const floatOffset = Math.sin(Date.now() / 300) * 3;
    const pos = {
      x: powerUp.position.x,
      y: powerUp.position.y + floatOffset
    };
    
    // Outer glow (pulsing)
    this.ctx.save();
    this.ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 200) * 0.2;
    this.drawCircle(pos, size / 2 + 8, color);
    this.ctx.restore();
    
    // Main circle
    this.drawCircle(pos, size / 2, color);
    
    // Inner white circle
    this.ctx.save();
    this.ctx.globalAlpha = 0.9;
    this.drawCircle(pos, size / 2 - 2, '#FFFFFF');
    this.ctx.restore();
    
    // Emoji
    this.ctx.save();
    this.ctx.font = `${size * 0.75}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(emoji, pos.x, pos.y + 1);
    this.ctx.restore();
  }
  
  drawXPOrb(position: Vector2): void {
    if (this.spritesLoaded) {
      const sprite = getSprite('xp_orb');
      const size = 20;
      
      // Pulse animation
      const pulse = 1 + Math.sin(Date.now() / 100) * 0.15;
      const actualSize = size * pulse;
      
      this.ctx.drawImage(
        sprite,
        position.x - actualSize / 2,
        position.y - actualSize / 2,
        actualSize,
        actualSize
      );
    } else {
      // Fallback
      const pulseSize = 6 + Math.sin(Date.now() / 100) * 2;
      this.drawCircle(position, pulseSize, '#4AFFFF', 0.8);
      this.drawCircle(position, pulseSize - 2, '#FFFFFF', 0.6);
    }
  }
  
  drawProjectile(projectile: Projectile): void {
    // Glow effect to make projectiles more visible
    this.ctx.save();
    const glowRadius = 15;
    const gradient = this.ctx.createRadialGradient(
      projectile.position.x, projectile.position.y, 0,
      projectile.position.x, projectile.position.y, glowRadius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 100, 0.6)');
    gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(projectile.position.x, projectile.position.y, glowRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    if (this.spritesLoaded) {
      // Determine sprite based on projectile type
      const sprite = projectile.type === 'arrow' 
        ? getSprite('projectile_arrow')
        : getSprite('projectile_magic');
      
      const isArrow = projectile.type === 'arrow';
      const width = isArrow ? 24 : 16;
      const height = isArrow ? 8 : 16;
      
      this.ctx.save();
      this.ctx.translate(projectile.position.x, projectile.position.y);
      
      // Rotate arrow based on velocity
      if (isArrow) {
        const angle = Math.atan2(projectile.velocity.y, projectile.velocity.x);
        this.ctx.rotate(angle);
      }
      
      this.ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
      this.ctx.restore();
    } else {
      // Fallback with glow
      this.drawCircle(projectile.position, 5, '#FFFF00');
      this.ctx.save();
      this.ctx.globalAlpha = 0.5;
      this.drawCircle(projectile.position, 3, '#FFFFFF');
      this.ctx.restore();
    }
  }
  
  drawParticle(particle: Particle): void {
    this.ctx.save();
    this.ctx.globalAlpha = particle.alpha;
    this.ctx.translate(particle.position.x, particle.position.y);
    this.ctx.rotate(particle.rotation);
    
    this.ctx.fillStyle = particle.color;
    this.ctx.fillRect(
      -particle.size / 2,
      -particle.size / 2,
      particle.size,
      particle.size
    );
    
    this.ctx.restore();
  }
  
  drawBoss(boss: Boss): void {
    if (boss.defeated) return;
    
    const size = 135; // Boss sprite size
    const x = boss.position.x - size / 2;
    const y = boss.position.y - size / 2;
    
    // Use sprites if loaded
    if (this.spritesLoaded) {
      const spriteMap = {
        'archer_king': 'boss_archer_king',
        'brawler_chief': 'boss_brawler_chief',
        'dark_mage': 'boss_dark_mage'
      } as const;
      
      const spriteName = spriteMap[boss.type];
      const sprite = getSprite(spriteName);
      
      // Phase effect (flash for enrage/low HP)
      if (boss.phase >= 2) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 200) * 0.2;
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(x, y, size, size);
        this.ctx.restore();
      }
      
      this.ctx.drawImage(sprite, x, y, size, size);
    } else {
      // Fallback to old rendering
      const oldSize = 96;
      const oldX = boss.position.x - oldSize / 2;
      const oldY = boss.position.y - oldSize / 2;
      
      switch (boss.type) {
        case 'archer_king':
          this.drawArcherKingFallback(boss, oldX, oldY, oldSize);
          break;
        case 'brawler_chief':
          this.drawBrawlerChiefFallback(boss, oldX, oldY, oldSize);
          break;
        case 'dark_mage':
          this.drawDarkMageFallback(boss, oldX, oldY, oldSize);
          break;
      }
    }
    
    // Draw homing orbs for Dark Mage
    if (boss.type === 'dark_mage' && boss.specialData?.homingOrbs) {
      boss.specialData.homingOrbs.forEach((orb: any) => {
        this.drawCircle(orb.position, 12, '#9D4EFF', 0.8);
        this.drawCircle(orb.position, 8, '#FFFFFF', 0.6);
        this.drawCircle(orb.position, 4, '#9D4EFF');
      });
    }
  }
  
  drawBossHPBar(boss: Boss | null): void {
    if (!boss || boss.defeated) return;
    
    const barWidth = 600;
    const barHeight = 20;
    const x = (this.ctx.canvas.width - barWidth) / 2;
    const y = 45;
    const hpPercent = boss.hp / boss.maxHp;
    
    // Background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
    
    // HP fill with gradient
    const gradient = this.ctx.createLinearGradient(x, y, x + barWidth, y);
    if (hpPercent < 0.3) {
      gradient.addColorStop(0, '#FF4A4A');
      gradient.addColorStop(1, '#CC0000');
    } else if (hpPercent < 0.6) {
      gradient.addColorStop(0, '#FFFF4A');
      gradient.addColorStop(1, '#CCCC00');
    } else {
      gradient.addColorStop(0, '#4AFF4A');
      gradient.addColorStop(1, '#00CC00');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, barWidth * hpPercent, barHeight);
    
    // Border
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, barWidth, barHeight);
    
    // Boss name
    this.drawText(`☠️ ${boss.name}`, { x: this.ctx.canvas.width / 2, y: y - 12 }, '#FFD700', 16, 'center');
    
    // HP text
    this.drawText(
      `${Math.ceil(boss.hp)} / ${boss.maxHp}`, 
      { x: this.ctx.canvas.width / 2, y: y + barHeight / 2 }, 
      '#FFFFFF', 
      12, 
      'center'
    );
  }
  
  private drawArcherKingFallback(boss: Boss, x: number, y: number, size: number): void {
    // Boss body with phase color
    const phaseColor = boss.phase === 1 ? '#9370DB' : '#DC143C';
    this.ctx.fillStyle = phaseColor;
    this.ctx.fillRect(x, y, size, size);
    
    // Crown
    this.ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 5; i++) {
      const crownX = x + (i * size / 4);
      this.ctx.fillRect(crownX, y - 10, 8, 10);
    }
    
    // Eyes
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(x + 20, y + 30, 12, 12);
    this.ctx.fillRect(x + 64, y + 30, 12, 12);
  }
  
  private drawBrawlerChiefFallback(boss: Boss, x: number, y: number, size: number): void {
    // Muscular red/brown body
    const phaseColor = boss.phase >= 3 ? '#8B0000' : boss.phase >= 2 ? '#DC143C' : '#CD5C5C';
    this.ctx.fillStyle = phaseColor;
    this.ctx.fillRect(x, y, size, size);
    
    // Sword
    this.ctx.fillStyle = '#C0C0C0';
    this.ctx.fillRect(x + size - 20, y + 20, 8, 40);
    
    // Eyes (angry)
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.fillRect(x + 20, y + 25, 14, 14);
    this.ctx.fillRect(x + 62, y + 25, 14, 14);
    
    // Charging effect
    if (boss.specialData?.charging) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.5;
      this.drawCircle(boss.position, size, '#FF0000');
      this.ctx.restore();
    }
  }
  
  private drawDarkMageFallback(boss: Boss, x: number, y: number, size: number): void {
    // Dark purple/black robe
    const phaseColor = boss.phase >= 3 ? '#4B0082' : boss.phase >= 2 ? '#663399' : '#9370DB';
    this.ctx.fillStyle = phaseColor;
    this.ctx.fillRect(x, y, size, size);
    
    // Glowing orb (staff)
    const orbPulse = 8 + Math.sin(Date.now() / 200) * 3;
    this.ctx.save();
    this.ctx.globalAlpha = 0.8;
    this.drawCircle({ x: x + size / 2, y: y + 20 }, orbPulse, '#00FFFF');
    this.ctx.restore();
    
    // Eyes (glowing)
    this.ctx.fillStyle = '#00FFFF';
    this.ctx.fillRect(x + 25, y + 40, 10, 10);
    this.ctx.fillRect(x + 61, y + 40, 10, 10);
    
    // Teleporting effect
    if (boss.specialData?.teleporting) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.5;
      this.drawCircle(boss.position, size * 1.5, '#9370DB');
      this.ctx.restore();
    }
  }
  
  // UI Elements
  drawProgressBar(
    pos: Vector2,
    width: number,
    height: number,
    progress: number,
    color: string,
    bgColor: string = '#333333'
  ): void {
    // Background
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(pos.x, pos.y, width, height);
    
    // Progress fill
    this.ctx.fillStyle = color;
    this.ctx.fillRect(pos.x, pos.y, width * progress, height);
    
    // Border
    this.ctx.strokeStyle = COLORS.ui_border;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(pos.x, pos.y, width, height);
  }
  
  drawButton(
    pos: Vector2,
    width: number,
    height: number,
    text: string,
    isHovered: boolean = false
  ): void {
    const color = isHovered ? COLORS.ui_border : COLORS.ui_bg;
    const textColor = isHovered ? COLORS.ui_bg : COLORS.ui_text;
    
    // Button background
    this.ctx.fillStyle = color;
    this.ctx.fillRect(pos.x, pos.y, width, height);
    
    // Border
    this.ctx.strokeStyle = COLORS.ui_border;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(pos.x, pos.y, width, height);
    
    // Text
    this.drawText(
      text,
      { x: pos.x + width / 2, y: pos.y + height / 2 },
      textColor,
      16,
      'center'
    );
  }
  
  // Screen effects
  drawVignette(): void {
    const gradient = this.ctx.createRadialGradient(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2,
      this.ctx.canvas.height / 4,
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2,
      this.ctx.canvas.height
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
  
  drawFlash(alpha: number, color: string = '#ffffff'): void {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();
  }
  
  drawOverlay(alpha: number = 0.6): void {
    this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

