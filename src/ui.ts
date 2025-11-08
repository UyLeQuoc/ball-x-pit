// UI and HUD rendering

import type { GameProgress, UpgradeOption, Boss } from './types';
import type { Player } from './player';
import { Renderer } from './renderer';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  HUD_HEIGHT,
  COLORS,
  BALL_STATS
} from './constants';
import { formatTime } from './utils';

export function renderHUD(
  renderer: Renderer,
  player: Player,
  progress: GameProgress,
  gameTime: number
): void {
  // Top HUD background
  renderer.drawRect(
    { x: 0, y: 0, width: GAME_WIDTH, height: HUD_HEIGHT },
    COLORS.ui_bg,
    0.9
  );
  
  // Ball inventory
  renderBallInventory(renderer, player, 10, 10);
  
  // Progress bar
  renderProgressBar(renderer, progress, GAME_WIDTH - 210, 25);
  
  // Bottom stats panel
  renderStatsPanel(renderer, player, gameTime);
  
  // Active buffs
  renderActiveBuffs(renderer, player);
}

function renderBallInventory(renderer: Renderer, player: Player, x: number, y: number): void {
  const ballTypes = ['normal', 'fire', 'ice', 'lightning', 'bomb', 'poison', 'ghost'];
  let offsetX = x;
  
  ballTypes.forEach(type => {
    const count = (player.inventory as any)[type];
    if (count > 0 || type === 'normal') {
      const stats = BALL_STATS[type as keyof typeof BALL_STATS];
      const isSelected = player.selectedBallType === type;
      
      // Background
      const bgColor = isSelected ? COLORS.ui_border : '#333333';
      renderer.drawRect(
        { x: offsetX, y, width: 50, height: 35 },
        bgColor,
        isSelected ? 0.4 : 0.3
      );
      
      // Border
      if (isSelected) {
        renderer.drawRectOutline(
          { x: offsetX, y, width: 50, height: 35 },
          COLORS.ui_border,
          2
        );
      }
      
      // Ball icon (colored circle)
      renderer.drawCircle(
        { x: offsetX + 25, y: y + 12 },
        6,
        stats.color
      );
      
      // Count
      renderer.drawText(
        `${count}x`,
        { x: offsetX + 25, y: y + 28 },
        count > 0 ? COLORS.ui_text : COLORS.ui_text_dim,
        10,
        'center'
      );
      
      offsetX += 55;
    }
  });
  
  // Upgrade button hint (if enough balls)
  const selectedCount = (player.inventory as any)[player.selectedBallType];
  if (selectedCount >= 5 && player.selectedBallType === 'normal') {
    renderer.drawText(
      '[U] Upgrade',
      { x: offsetX + 10, y: y + 17 },
      COLORS.ui_border,
      12
    );
  }
}

function renderProgressBar(renderer: Renderer, progress: GameProgress, x: number, y: number): void {
  const width = 200;
  const height = 20;
  
  renderer.drawText(
    `Progress: ${Math.floor(progress.progress)}%`,
    { x, y: y - 8 },
    COLORS.ui_text,
    12
  );
  
  // Progress bar
  let color = COLORS.hp_full;
  if (progress.progress > 80) color = COLORS.hp_low;
  else if (progress.progress > 50) color = COLORS.hp_medium;
  
  renderer.drawProgressBar(
    { x, y },
    width,
    height,
    progress.progress / 100,
    color
  );
}

function renderStatsPanel(renderer: Renderer, player: Player, gameTime: number): void {
  const panelY = GAME_HEIGHT - 50;
  const leftMargin = 60; // More space from left edge
  
  // Semi-transparent background
  renderer.drawRect(
    { x: 0, y: panelY, width: GAME_WIDTH, height: 50 },
    COLORS.ui_bg,
    0.7
  );
  
  // HP Bar
  const hpPercent = player.stats.hp / player.stats.maxHp;
  let hpColor = COLORS.hp_full;
  if (hpPercent < 0.3) hpColor = COLORS.hp_low;
  else if (hpPercent < 0.7) hpColor = COLORS.hp_medium;
  
  renderer.drawTextWithOutline('HP:', { x: leftMargin, y: panelY + 15 }, '#FFFFFF', '#000000', 14);
  renderer.drawProgressBar(
    { x: leftMargin + 35, y: panelY + 8 },
    140,
    14,
    hpPercent,
    hpColor
  );
  renderer.drawTextWithOutline(
    `${Math.floor(player.stats.hp)}/${player.stats.maxHp}`,
    { x: leftMargin + 105, y: panelY + 15 },
    '#FFFFFF',
    '#000000',
    12,
    'center'
  );
  
  // Shield indicator
  if (player.stats.hasShield) {
    renderer.drawTextWithOutline(
      `🛡️${player.stats.shieldHp}`,
      { x: leftMargin + 180, y: panelY + 15 },
      '#4A9EFF',
      '#000000',
      12
    );
  }
  
  // Level
  renderer.drawTextWithOutline(
    `Lv: ${player.stats.level}`,
    { x: leftMargin, y: panelY + 35 },
    '#FFD700',
    '#000000',
    14
  );
  
  // XP Bar
  const xpPercent = player.stats.xp / player.stats.xpToNextLevel;
  renderer.drawTextWithOutline('XP:', { x: leftMargin + 60, y: panelY + 35 }, '#4AFFFF', '#000000', 14);
  renderer.drawProgressBar(
    { x: leftMargin + 95, y: panelY + 28 },
    140,
    14,
    xpPercent,
    COLORS.xp
  );
  renderer.drawTextWithOutline(
    `${Math.floor(player.stats.xp)}/${player.stats.xpToNextLevel}`,
    { x: leftMargin + 165, y: panelY + 35 },
    '#FFFFFF',
    '#000000',
    10,
    'center'
  );
  
  // Time and stage (right side)
  renderer.drawTextWithOutline(
    `Time: ${formatTime(gameTime)}`,
    { x: GAME_WIDTH - 150, y: panelY + 15 },
    '#FFFFFF',
    '#000000',
    14
  );
  
  renderer.drawTextWithOutline(
    `Stage: 1-1`,
    { x: GAME_WIDTH - 150, y: panelY + 35 },
    '#FFFFFF',
    '#000000',
    14
  );
}

function renderActiveBuffs(renderer: Renderer, player: Player): void {
  if (player.buffs.length === 0) return;
  
  const x = GAME_WIDTH - 120;
  let y = HUD_HEIGHT + 10;
  
  renderer.drawText('Buffs:', { x, y }, COLORS.ui_text, 12);
  y += 20;
  
  player.buffs.forEach(buff => {
    const timeLeft = Math.ceil(buff.duration);
    const barWidth = 100;
    const barPercent = buff.duration / 15; // Assume max 15s for display
    
    renderer.drawText(
      `${buff.icon}`,
      { x, y },
      COLORS.ui_text,
      12
    );
    
    renderer.drawProgressBar(
      { x: x + 20, y: y - 6 },
      barWidth,
      12,
      Math.min(1, barPercent),
      COLORS.ui_border
    );
    
    renderer.drawText(
      `${timeLeft}s`,
      { x: x + barWidth + 25, y },
      COLORS.ui_text,
      10
    );
    
    y += 20;
  });
}

export function renderLevelUpScreen(
  renderer: Renderer,
  player: Player,
  options: UpgradeOption[],
  hoveredIndex: number
): void {
  // Dark overlay
  renderer.drawOverlay(0.8);
  
  // Title
  renderer.drawTextWithOutline(
    'LEVEL UP!',
    { x: GAME_WIDTH / 2, y: 70 },
    '#FFD700',
    '#000000',
    24
  );
  
  renderer.drawText(
    `Level ${player.stats.level - 1} → ${player.stats.level}`,
    { x: GAME_WIDTH / 2, y: 110 },
    COLORS.ui_text,
    14,
    'center'
  );
  
  // Upgrade options - Vertical layout
  const cardWidth = 450;
  const cardHeight = 140;
  const spacing = 15;
  const startY = 140;
  const cardX = (GAME_WIDTH - cardWidth) / 2;
  
  options.forEach((option, index) => {
    const cardY = startY + (cardHeight + spacing) * index;
    const isHovered = hoveredIndex === index;
    
    // Card background
    const rarityColor = COLORS[option.rarity as keyof typeof COLORS] || COLORS.common;
    renderer.drawRect(
      { x: cardX, y: cardY, width: cardWidth, height: cardHeight },
      isHovered ? '#2a2a3e' : '#1a1a2e'
    );
    
    // Border with rarity color
    renderer.drawRectOutline(
      { x: cardX, y: cardY, width: cardWidth, height: cardHeight },
      isHovered ? rarityColor : '#444444',
      isHovered ? 3 : 2
    );
    
    // Icon (left side)
    renderer.drawText(
      option.icon,
      { x: cardX + 45, y: cardY + cardHeight / 2 },
      rarityColor,
      40,
      'center'
    );
    
    // Name (center-right)
    renderer.drawText(
      option.name,
      { x: cardX + 110, y: cardY + 30 },
      rarityColor,
      14,
      'left'
    );
    
    // Rarity badge
    renderer.drawText(
      option.rarity.toUpperCase(),
      { x: cardX + 110, y: cardY + 48 },
      rarityColor,
      8,
      'left'
    );
    
    // Description (center-right, multiple lines)
    const words = option.description.split(' ');
    let line = '';
    let lineY = cardY + 70;
    const maxLineLength = 50;
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      if (testLine.length > maxLineLength) {
        renderer.drawText(
          line.trim(),
          { x: cardX + 110, y: lineY },
          COLORS.ui_text,
          9,
          'left'
        );
        line = word + ' ';
        lineY += 16;
      } else {
        line = testLine;
      }
    });
    
    if (line.trim()) {
      renderer.drawText(
        line.trim(),
        { x: cardX + 110, y: lineY },
        COLORS.ui_text,
        9,
        'left'
      );
    }
    
    // Select hint (right side)
    if (isHovered) {
      renderer.drawTextWithOutline(
        '◄ CLICK',
        { x: cardX + cardWidth - 55, y: cardY + cardHeight / 2 },
        COLORS.ui_border,
        '#000000',
        12,
        'center'
      );
    }
  });
}

export function renderBossHealthBar(renderer: Renderer, boss: Boss): void {
  const barWidth = 600;
  const barHeight = 18;
  const x = (GAME_WIDTH - barWidth) / 2;
  const y = 48; // Move to header area
  
  // Background with darker overlay
  renderer.drawRect(
    { x: x - 5, y: y - 22, width: barWidth + 10, height: 50 },
    '#000000',
    0.8
  );
  
  // Boss name with golden color
  renderer.drawTextWithOutline(
    `☠️ ${boss.name}`,
    { x: GAME_WIDTH / 2, y: y - 8 },
    '#FFD700',
    '#000000',
    18
  );
  
  // HP bar
  const hpPercent = boss.hp / boss.maxHp;
  
  // HP bar background
  renderer.drawRect(
    { x, y, width: barWidth, height: barHeight },
    '#000000',
    1
  );
  
  // HP bar fill with color based on HP
  let barColor = '#4AFF4A';
  if (hpPercent < 0.3) barColor = '#FF4A4A';
  else if (hpPercent < 0.6) barColor = '#FFFF4A';
  
  renderer.drawProgressBar(
    { x, y },
    barWidth,
    barHeight,
    hpPercent,
    barColor
  );
  
  // HP text centered in bar
  renderer.drawTextWithOutline(
    `${Math.ceil(boss.hp)} / ${boss.maxHp}`,
    { x: GAME_WIDTH / 2, y: y + barHeight / 2 },
    '#FFFFFF',
    '#000000',
    14,
    'center'
  );
  
  // Phase indicator
  renderer.drawText(
    `Phase ${boss.phase}`,
    { x: x + barWidth + 20, y: y + 30 },
    COLORS.ui_text,
    14
  );
}

export function renderGameOver(renderer: Renderer, stats: any): void {
  renderer.drawOverlay(0.9);
  
  renderer.drawTextWithOutline(
    '💀 GAME OVER 💀',
    { x: GAME_WIDTH / 2, y: 100 },
    '#FF4444',
    '#000000',
    40
  );
  
  const statsY = 180;
  renderer.drawText('Final Stats:', { x: GAME_WIDTH / 2, y: statsY }, COLORS.ui_text, 20, 'center');
  renderer.drawText(`Level Reached: ${stats.level}`, { x: GAME_WIDTH / 2, y: statsY + 40 }, COLORS.ui_text, 16, 'center');
  renderer.drawText(`Enemies Defeated: ${stats.enemiesKilled}`, { x: GAME_WIDTH / 2, y: statsY + 65 }, COLORS.ui_text, 16, 'center');
  renderer.drawText(`Time: ${formatTime(stats.time)}`, { x: GAME_WIDTH / 2, y: statsY + 90 }, COLORS.ui_text, 16, 'center');
  
  renderer.drawText(
    '[Click to Restart]',
    { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 80 },
    COLORS.ui_border,
    18,
    'center'
  );
}

