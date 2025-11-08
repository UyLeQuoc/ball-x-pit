// Animated scrolling background system

import { GAME_WIDTH, GAME_HEIGHT } from './constants';

export class ScrollingBackground {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scrollOffset: number = 0;
  private scrollSpeed: number = 20; // pixels per second
  
  // Background layers for parallax effect
  private patterns: {
    stars: { x: number; y: number; size: number; opacity: number; speed: number }[];
    grid: { offset: number; speed: number };
    particles: { x: number; y: number; size: number; opacity: number; speed: number }[];
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    
    // Initialize background elements
    this.patterns = {
      stars: this.generateStars(100),
      grid: { offset: 0, speed: 30 },
      particles: this.generateParticles(50)
    };
  }

  private generateStars(count: number) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT * 2, // Double height for seamless loop
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 15 + 10
      });
    }
    return stars;
  }

  private generateParticles(count: number) {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 25 + 15
      });
    }
    return particles;
  }

  update(deltaTime: number): void {
    // Update stars
    this.patterns.stars.forEach(star => {
      star.y += star.speed * deltaTime;
      if (star.y > GAME_HEIGHT) {
        star.y = -star.size;
        star.x = Math.random() * GAME_WIDTH;
      }
    });

    // Update particles
    this.patterns.particles.forEach(particle => {
      particle.y += particle.speed * deltaTime;
      if (particle.y > GAME_HEIGHT) {
        particle.y = -particle.size;
        particle.x = Math.random() * GAME_WIDTH;
      }
    });

    // Update grid
    this.patterns.grid.offset += this.patterns.grid.speed * deltaTime;
    if (this.patterns.grid.offset >= 40) {
      this.patterns.grid.offset = 0;
    }

    // General scroll offset
    this.scrollOffset += this.scrollSpeed * deltaTime;
    if (this.scrollOffset >= GAME_HEIGHT) {
      this.scrollOffset = 0;
    }
  }

  render(): void {
    // Base gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#0f0f1e');
    gradient.addColorStop(1, '#1a1a2e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw grid pattern (scrolling)
    this.drawScrollingGrid();

    // Draw particles (slow moving)
    this.drawParticles();

    // Draw stars (faster moving)
    this.drawStars();

    // Draw accent lines
    this.drawAccentLines();

    // Vignette effect
    this.drawVignette();
  }

  private drawScrollingGrid(): void {
    this.ctx.save();
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 0.5;
    this.ctx.globalAlpha = 0.1;

    const gridSize = 40;
    const offsetY = this.patterns.grid.offset;

    // Vertical lines
    for (let x = 0; x < GAME_WIDTH; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, GAME_HEIGHT);
      this.ctx.stroke();
    }

    // Horizontal lines (scrolling)
    for (let y = -gridSize + offsetY; y < GAME_HEIGHT; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(GAME_WIDTH, y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private drawStars(): void {
    this.ctx.save();
    this.patterns.stars.forEach(star => {
      this.ctx.globalAlpha = star.opacity;
      this.ctx.fillStyle = '#ffffff';
      
      // Twinkle effect
      const twinkle = Math.sin(Date.now() / 200 + star.x) * 0.3 + 0.7;
      this.ctx.globalAlpha = star.opacity * twinkle;
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Star glow
      if (star.size > 1.5) {
        const glowGradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = glowGradient;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    this.ctx.restore();
  }

  private drawParticles(): void {
    this.ctx.save();
    this.patterns.particles.forEach(particle => {
      this.ctx.globalAlpha = particle.opacity;
      
      // Colored particles
      const colors = ['#00ffff', '#4AFF4A', '#FF4AFF', '#FFD700', '#4A9EFF'];
      const colorIndex = Math.floor(particle.x + particle.y) % colors.length;
      this.ctx.fillStyle = colors[colorIndex];
      
      // Pulsing effect
      const pulse = Math.sin(Date.now() / 500 + particle.x + particle.y) * 0.3 + 0.7;
      this.ctx.globalAlpha = particle.opacity * pulse;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.restore();
  }

  private drawAccentLines(): void {
    this.ctx.save();
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 1;
    this.ctx.globalAlpha = 0.15;

    const time = Date.now() / 1000;
    
    // Diagonal lines moving down
    for (let i = 0; i < 5; i++) {
      const offset = (time * 50 + i * 200) % (GAME_HEIGHT + 200);
      this.ctx.beginPath();
      this.ctx.moveTo(0, offset - 200);
      this.ctx.lineTo(GAME_WIDTH, offset);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private drawVignette(): void {
    this.ctx.save();
    
    // Radial gradient from center
    const gradient = this.ctx.createRadialGradient(
      GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH * 0.3,
      GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH * 0.8
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    this.ctx.restore();
  }

  // Speed up background during boss fight
  setBossFightMode(active: boolean): void {
    this.scrollSpeed = active ? 40 : 20;
    this.patterns.grid.speed = active ? 60 : 30;
  }
}

