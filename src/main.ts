// Main entry point

import { Game } from './game';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import { formatTime } from './utils';

// Check for debug mode
const urlParams = new URLSearchParams(window.location.search);
const DEBUG_MODE = urlParams.get('debug') === 'true';

function updateStatsPanel(game: Game): void {
  // Combat stats
  document.getElementById('stat-kills')!.textContent = game.stats.enemiesKilled.toString();
  document.getElementById('stat-bosses')!.textContent = game.stats.bossesKilled.toString();
  document.getElementById('stat-stage')!.textContent = `1-${game.progress.section}`;
  document.getElementById('stat-time')!.textContent = formatTime(game.gameTime);
  
  // Player stats
  document.getElementById('stat-level')!.textContent = game.player.stats.level.toString();
  document.getElementById('stat-hp')!.textContent = `${Math.floor(game.player.stats.hp)}/${game.player.stats.maxHp}`;
  document.getElementById('stat-xp')!.textContent = `${Math.floor(game.player.stats.xp)}/${game.player.stats.xpToNextLevel}`;
  document.getElementById('stat-speed')!.textContent = Math.floor(game.player.stats.moveSpeed).toString();
  document.getElementById('stat-crit')!.textContent = `${Math.floor(game.player.critChance * 100)}%`;
  
  // Ball inventory removed from panel (user deleted it from HTML)
  
  // Active buffs with progress bars
  const buffsContainer = document.getElementById('active-buffs')!;
  if (game.player.buffs.length === 0) {
    buffsContainer.innerHTML = '<div style="color: #888; text-align: center; padding: 10px;">No active buffs</div>';
  } else {
    buffsContainer.innerHTML = game.player.buffs.map(buff => {
      const maxDuration = getMaxBuffDuration(buff.type);
      const progress = Math.min(1, buff.duration / maxDuration);
      const progressPercent = (progress * 100).toFixed(0);
      
      return `
        <div style="margin-bottom: 10px;">
          <div class="stat-item" style="border-bottom: none; padding-bottom: 2px;">
            <span class="stat-label">${buff.icon} ${buff.type}</span>
            <span class="stat-value">${Math.ceil(buff.duration)}s</span>
          </div>
          <div style="width: 100%; height: 6px; background: #333; border-radius: 3px; overflow: hidden;">
            <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #00ffff, #4AFF4A); transition: width 0.3s;"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function getMaxBuffDuration(buffType: string): number {
  const durations: Record<string, number> = {
    speed: 10,
    damage: 8,
    xp: 15,
    invincibility: 5,
    magnet: 12,
    freeze: 6
  };
  return durations[buffType] || 10;
}

function updateDebugPanel(game: Game, fps: number): void {
  if (!DEBUG_MODE) return;
  
  const debugPanel = document.getElementById('debug-panel')!;
  
  debugPanel.innerHTML = `
    <h2>🐛 DEBUG PANEL</h2>
    
    <h3>⚙️ System</h3>
    <div class="debug-item">
      <span class="debug-label">FPS:</span>
      <span class="debug-value">${fps.toFixed(1)}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Game State:</span>
      <span class="debug-value">${game.state}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Game Time:</span>
      <span class="debug-value">${formatTime(game.gameTime)}</span>
    </div>
    
    <h3>🎯 Player</h3>
    <div class="debug-item">
      <span class="debug-label">Position:</span>
      <span class="debug-value">(${Math.floor(game.player.position.x)}, ${Math.floor(game.player.position.y)})</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">HP:</span>
      <span class="debug-value">${Math.floor(game.player.stats.hp)}/${game.player.stats.maxHp}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Level:</span>
      <span class="debug-value">${game.player.stats.level}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">XP:</span>
      <span class="debug-value">${Math.floor(game.player.stats.xp)}/${game.player.stats.xpToNextLevel}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Invincible:</span>
      <span class="${game.player.stats.invincible ? 'debug-warning' : 'debug-value'}">${game.player.stats.invincible}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Buffs Active:</span>
      <span class="debug-value">${game.player.buffs.length}</span>
    </div>
    
    <h3>⚔️ Combat</h3>
    <div class="debug-item">
      <span class="debug-label">Damage Mult:</span>
      <span class="debug-value">${game.player.damageMultiplier.toFixed(2)}x</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Crit Chance:</span>
      <span class="debug-value">${(game.player.critChance * 100).toFixed(1)}%</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Base DMG Bonus:</span>
      <span class="debug-value">+${game.baseDamageBonus}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Life Steal:</span>
      <span class="debug-value">${game.hasLifeSteal ? 'YES' : 'NO'}</span>
    </div>
    
    <h3>🎱 Balls</h3>
    <div class="debug-item">
      <span class="debug-label">Active Balls:</span>
      <span class="debug-value">${game.balls.length}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Normal:</span>
      <span class="debug-value">${game.player.inventory.normal}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Fire:</span>
      <span class="debug-value">${game.player.inventory.fire}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Ice:</span>
      <span class="debug-value">${game.player.inventory.ice}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Lightning:</span>
      <span class="debug-value">${game.player.inventory.lightning}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Selected Type:</span>
      <span class="debug-value">${game.player.selectedBallType}</span>
    </div>
    
    <h3>👹 Enemies</h3>
    <div class="debug-item">
      <span class="debug-label">Count:</span>
      <span class="debug-value">${game.enemies.length}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Killed:</span>
      <span class="debug-value">${game.stats.enemiesKilled}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Projectiles:</span>
      <span class="debug-value">${game.projectiles.length}</span>
    </div>
    
    <h3>☠️ Boss</h3>
    <div class="debug-item">
      <span class="debug-label">Active:</span>
      <span class="${game.boss ? 'debug-warning' : 'debug-value'}">${game.boss ? 'YES' : 'NO'}</span>
    </div>
    ${game.boss ? `
      <div class="debug-item">
        <span class="debug-label">Type:</span>
        <span class="debug-value">${game.boss.type}</span>
      </div>
      <div class="debug-item">
        <span class="debug-label">HP:</span>
        <span class="debug-value">${Math.floor(game.boss.hp)}/${game.boss.maxHp}</span>
      </div>
      <div class="debug-item">
        <span class="debug-label">Phase:</span>
        <span class="debug-value">${game.boss.phase}</span>
      </div>
      <div class="debug-item">
        <span class="debug-label">Position:</span>
        <span class="debug-value">(${Math.floor(game.boss.position.x)}, ${Math.floor(game.boss.position.y)})</span>
      </div>
      <div class="debug-item">
        <span class="debug-label">Defeated:</span>
        <span class="debug-value">${game.boss.defeated}</span>
      </div>
    ` : ''}
    
    <h3>📊 Progress</h3>
    <div class="debug-item">
      <span class="debug-label">Stage:</span>
      <span class="debug-value">1-${game.progress.section}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Progress:</span>
      <span class="debug-value">${game.progress.progress.toFixed(1)}%</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Boss Active:</span>
      <span class="debug-value">${game.progress.bossActive}</span>
    </div>
    
    <h3>💎 Items</h3>
    <div class="debug-item">
      <span class="debug-label">XP Orbs:</span>
      <span class="debug-value">${game.xpOrbs.length}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Power-ups:</span>
      <span class="debug-value">${game.powerUps.length}</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Particles:</span>
      <span class="debug-value">${game.particles.length}</span>
    </div>
    
    <h3>🎮 Modifiers</h3>
    <div class="debug-item">
      <span class="debug-label">Ball Speed Mult:</span>
      <span class="debug-value">${game.ballSpeedMultiplier.toFixed(2)}x</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">XP Mult:</span>
      <span class="debug-value">${game.xpMultiplier.toFixed(2)}x</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">XP Magnet Mult:</span>
      <span class="debug-value">${game.xpMagnetMultiplier.toFixed(2)}x</span>
    </div>
    <div class="debug-item">
      <span class="debug-label">Drop Rate Bonus:</span>
      <span class="debug-value">+${(game.dropRateBonus * 100).toFixed(0)}%</span>
    </div>
  `;
}

function initGame(): void {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  // Set canvas size
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  
  // Create game instance
  const game = new Game(canvas);
  
  // Enable debug panel if debug mode
  if (DEBUG_MODE) {
    const debugPanel = document.getElementById('debug-panel')!;
    debugPanel.classList.add('active');
    console.log('🐛 Debug mode enabled!');
  }
  
  // Game loop
  let lastTime = performance.now();
  let frameCount = 0;
  let fpsUpdateTime = performance.now();
  let currentFPS = 60;
  
  function gameLoop(currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;
    
    // Calculate FPS
    frameCount++;
    if (currentTime - fpsUpdateTime >= 1000) {
      currentFPS = frameCount;
      frameCount = 0;
      fpsUpdateTime = currentTime;
    }
    
    // Clamp delta time to prevent spiral of death
    const clampedDelta = Math.min(deltaTime, 0.1);
    
    // Update and render
    game.update(clampedDelta);
    game.render();
    
    // Update stats panel
    updateStatsPanel(game);
    
    // Update debug panel
    if (DEBUG_MODE) {
      updateDebugPanel(game, currentFPS);
    }
    
    // Continue loop
    requestAnimationFrame(gameLoop);
  }
  
  // Start the game loop
  console.log('🎮 Roguelite Brick Breaker - Game Started!');
  console.log('Controls:');
  console.log('  WASD or Arrow Keys - Move (4 directions)');
  console.log('  Left Click - Shoot ball (auto-selects type)');
  console.log('  ESC - Pause');
  
  requestAnimationFrame(gameLoop);
}

// Start game when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

