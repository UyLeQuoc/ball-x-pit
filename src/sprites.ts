// SVG Sprites for all game characters

export const SPRITES = {
  // Player sprite - Blue hero with paddle/weapon
  player: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <circle cx="20" cy="20" r="12" fill="#00ffff" stroke="#00cccc" stroke-width="2"/>
      
      <!-- Eyes -->
      <circle cx="16" cy="18" r="2" fill="#ffffff"/>
      <circle cx="24" cy="18" r="2" fill="#ffffff"/>
      <circle cx="16.5" cy="18" r="1" fill="#000000"/>
      <circle cx="24.5" cy="18" r="1" fill="#000000"/>
      
      <!-- Smile -->
      <path d="M 14 24 Q 20 27 26 24" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
      
      <!-- Paddle/Weapon -->
      <rect x="8" y="30" width="24" height="6" rx="2" fill="#4A9EFF" stroke="#00ffff" stroke-width="1"/>
      
      <!-- Glow effect -->
      <circle cx="20" cy="20" r="14" fill="none" stroke="#00ffff" stroke-width="1" opacity="0.3"/>
    </svg>
  `,

  // Melee Enemy - Red warrior
  enemy_melee: `
    <svg width="45" height="45" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <rect x="12" y="15" width="21" height="25" rx="3" fill="#FF4A4A" stroke="#CC0000" stroke-width="2"/>
      
      <!-- Head -->
      <circle cx="22.5" cy="12" r="8" fill="#FF6666" stroke="#CC0000" stroke-width="2"/>
      
      <!-- Eyes (angry) -->
      <line x1="18" y1="11" x2="20" y2="13" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
      <line x1="25" y1="11" x2="27" y2="13" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Mouth (angry) -->
      <path d="M 19 15 L 26 15" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Sword -->
      <rect x="35" y="18" width="8" height="3" fill="#888888" stroke="#666666" stroke-width="1"/>
      <rect x="42" y="15" width="2" height="9" fill="#CCCCCC" stroke="#888888" stroke-width="1"/>
      
      <!-- Legs -->
      <rect x="14" y="38" width="7" height="5" rx="1" fill="#CC0000"/>
      <rect x="24" y="38" width="7" height="5" rx="1" fill="#CC0000"/>
    </svg>
  `,

  // Archer Enemy - Green archer
  enemy_archer: `
    <svg width="45" height="45" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <rect x="14" y="16" width="17" height="22" rx="2" fill="#4AFF4A" stroke="#00CC00" stroke-width="2"/>
      
      <!-- Head -->
      <circle cx="22.5" cy="12" r="7" fill="#66FF66" stroke="#00CC00" stroke-width="2"/>
      
      <!-- Hood -->
      <path d="M 16 12 Q 22.5 5 29 12" fill="#228B22" stroke="#00CC00" stroke-width="1"/>
      
      <!-- Eyes -->
      <circle cx="19" cy="12" r="1.5" fill="#000000"/>
      <circle cx="26" cy="12" r="1.5" fill="#000000"/>
      
      <!-- Bow -->
      <path d="M 35 10 Q 33 22.5 35 35" stroke="#8B4513" stroke-width="2" fill="none"/>
      <line x1="35" y1="10" x2="35" y2="35" stroke="#FFD700" stroke-width="0.5"/>
      
      <!-- Arrow -->
      <line x1="30" y1="22.5" x2="38" y2="22.5" stroke="#8B4513" stroke-width="1.5"/>
      <path d="M 38 22.5 L 35 20.5 L 35 24.5 Z" fill="#8B4513"/>
      
      <!-- Legs -->
      <rect x="16" y="36" width="6" height="6" rx="1" fill="#00CC00"/>
      <rect x="23" y="36" width="6" height="6" rx="1" fill="#00CC00"/>
    </svg>
  `,

  // Tank Enemy - Gray armored
  enemy_tank: `
    <svg width="55" height="55" viewBox="0 0 55 55" xmlns="http://www.w3.org/2000/svg">
      <!-- Body (large) -->
      <rect x="12" y="20" width="31" height="28" rx="3" fill="#888888" stroke="#555555" stroke-width="2"/>
      
      <!-- Armor plates -->
      <rect x="14" y="22" width="27" height="6" fill="#AAAAAA"/>
      <rect x="14" y="30" width="27" height="6" fill="#999999"/>
      <rect x="14" y="38" width="27" height="6" fill="#AAAAAA"/>
      
      <!-- Head -->
      <circle cx="27.5" cy="15" r="9" fill="#999999" stroke="#555555" stroke-width="2"/>
      
      <!-- Helmet -->
      <path d="M 19 15 Q 27.5 8 36 15" fill="#666666" stroke="#555555" stroke-width="1"/>
      
      <!-- Visor -->
      <rect x="21" y="14" width="13" height="4" rx="1" fill="#333333"/>
      
      <!-- Shield -->
      <path d="M 45 20 L 50 25 L 50 40 L 45 45 L 40 40 L 40 25 Z" fill="#CCCCCC" stroke="#888888" stroke-width="2"/>
      <line x1="45" y1="25" x2="45" y2="40" stroke="#FFD700" stroke-width="2"/>
      
      <!-- Legs -->
      <rect x="15" y="46" width="9" height="7" rx="2" fill="#666666"/>
      <rect x="31" y="46" width="9" height="7" rx="2" fill="#666666"/>
    </svg>
  `,

  // Elite Enemy - Gold elite
  enemy_elite: `
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <rect x="13" y="18" width="24" height="26" rx="3" fill="#FFD700" stroke="#CC9900" stroke-width="2"/>
      
      <!-- Gold trim -->
      <rect x="14" y="19" width="22" height="4" fill="#FFEB3B"/>
      <rect x="14" y="27" width="22" height="2" fill="#FFEB3B"/>
      
      <!-- Head -->
      <circle cx="25" cy="13" r="8" fill="#FFEB3B" stroke="#CC9900" stroke-width="2"/>
      
      <!-- Crown -->
      <path d="M 18 10 L 20 6 L 22 10 L 25 5 L 28 10 L 30 6 L 32 10 Z" fill="#FFD700" stroke="#CC9900" stroke-width="1"/>
      <circle cx="25" cy="5" r="2" fill="#FF0000"/>
      
      <!-- Eyes (focused) -->
      <circle cx="21" cy="13" r="1.5" fill="#000000"/>
      <circle cx="29" cy="13" r="1.5" fill="#000000"/>
      <line x1="19" y1="11" x2="21" y2="12" stroke="#CC9900" stroke-width="1"/>
      <line x1="31" y1="11" x2="29" y2="12" stroke="#CC9900" stroke-width="1"/>
      
      <!-- Royal Bow -->
      <path d="M 40 15 Q 38 25 40 35" stroke="#8B4513" stroke-width="2.5" fill="none"/>
      <circle cx="40" cy="15" r="2" fill="#FFD700"/>
      <circle cx="40" cy="35" r="2" fill="#FFD700"/>
      
      <!-- Legs -->
      <rect x="15" y="42" width="7" height="6" rx="1" fill="#CC9900"/>
      <rect x="28" y="42" width="7" height="6" rx="1" fill="#CC9900"/>
    </svg>
  `,

  // Spawner Enemy - Purple spawner
  enemy_spawner: `
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <!-- Base/Nest -->
      <ellipse cx="25" cy="35" rx="18" ry="12" fill="#FF8CFF" stroke="#CC00CC" stroke-width="2"/>
      <ellipse cx="25" cy="33" rx="16" ry="10" fill="#FFAAFF"/>
      
      <!-- Main body/egg -->
      <ellipse cx="25" cy="22" rx="15" ry="18" fill="#FF8CFF" stroke="#CC00CC" stroke-width="2"/>
      
      <!-- Cracks/patterns -->
      <path d="M 25 10 Q 20 15 25 20" stroke="#CC00CC" stroke-width="1.5" fill="none"/>
      <path d="M 25 10 Q 30 15 25 20" stroke="#CC00CC" stroke-width="1.5" fill="none"/>
      <circle cx="25" cy="25" r="3" fill="#FFAAFF" stroke="#CC00CC" stroke-width="1"/>
      
      <!-- Magical aura/particles -->
      <circle cx="12" cy="15" r="2" fill="#FF00FF" opacity="0.6"/>
      <circle cx="38" cy="18" r="2" fill="#FF00FF" opacity="0.6"/>
      <circle cx="15" cy="30" r="2" fill="#FF00FF" opacity="0.6"/>
      <circle cx="35" cy="28" r="2" fill="#FF00FF" opacity="0.6"/>
      
      <!-- Portal effect -->
      <circle cx="25" cy="22" r="8" fill="none" stroke="#FF00FF" stroke-width="1" opacity="0.4" stroke-dasharray="2,2"/>
      <circle cx="25" cy="22" r="5" fill="none" stroke="#FF00FF" stroke-width="1" opacity="0.6" stroke-dasharray="1,1"/>
      
      <!-- Eyes (in egg) -->
      <circle cx="21" cy="20" r="2" fill="#FFFFFF"/>
      <circle cx="29" cy="20" r="2" fill="#FFFFFF"/>
      <circle cx="21.5" cy="20" r="1" fill="#CC00CC"/>
      <circle cx="29.5" cy="20" r="1" fill="#CC00CC"/>
    </svg>
  `,

  // Boss 1: Archer King
  boss_archer_king: `
    <svg width="135" height="135" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="67.5" cy="125" rx="50" ry="8" fill="#000000" opacity="0.3"/>
      
      <!-- Cape -->
      <path d="M 50 45 Q 30 80 35 120 L 50 115 L 55 70 Z" fill="#8B00FF" stroke="#6600CC" stroke-width="2"/>
      <path d="M 85 45 Q 105 80 100 120 L 85 115 L 80 70 Z" fill="#8B00FF" stroke="#6600CC" stroke-width="2"/>
      
      <!-- Body -->
      <rect x="45" y="50" width="45" height="60" rx="5" fill="#C94AFF" stroke="#8B00FF" stroke-width="3"/>
      
      <!-- Royal armor plates -->
      <rect x="48" y="55" width="39" height="10" fill="#FFD700"/>
      <circle cx="67.5" cy="75" r="8" fill="#FFD700" stroke="#CC9900" stroke-width="2"/>
      
      <!-- Head -->
      <circle cx="67.5" cy="35" r="20" fill="#FFAAFF" stroke="#8B00FF" stroke-width="3"/>
      
      <!-- Crown -->
      <path d="M 48 30 L 52 18 L 58 30 L 67.5 15 L 77 30 L 83 18 L 87 30 Z" fill="#FFD700" stroke="#CC9900" stroke-width="2"/>
      <circle cx="52" cy="18" r="3" fill="#FF0000"/>
      <circle cx="67.5" cy="15" r="4" fill="#FF0000"/>
      <circle cx="83" cy="18" r="3" fill="#FF0000"/>
      
      <!-- Face -->
      <circle cx="60" cy="33" r="3" fill="#000000"/>
      <circle cx="75" cy="33" r="3" fill="#000000"/>
      <path d="M 58 42 Q 67.5 45 77 42" stroke="#8B00FF" stroke-width="2" fill="none"/>
      
      <!-- Giant Bow -->
      <path d="M 105 20 Q 100 67.5 105 115" stroke="#8B4513" stroke-width="5" fill="none"/>
      <line x1="105" y1="20" x2="105" y2="115" stroke="#FFD700" stroke-width="1.5"/>
      <circle cx="105" cy="20" r="4" fill="#FFD700"/>
      <circle cx="105" cy="115" r="4" fill="#FFD700"/>
      
      <!-- Arrow (ready) -->
      <line x1="90" y1="67.5" x2="110" y2="67.5" stroke="#8B4513" stroke-width="3"/>
      <path d="M 110 67.5 L 105 64 L 105 71 Z" fill="#CCCCCC"/>
      
      <!-- Legs -->
      <rect x="50" y="108" width="15" height="18" rx="3" fill="#8B00FF"/>
      <rect x="70" y="108" width="15" height="18" rx="3" fill="#8B00FF"/>
      
      <!-- Glow effect -->
      <circle cx="67.5" cy="67.5" r="60" fill="none" stroke="#C94AFF" stroke-width="2" opacity="0.2"/>
    </svg>
  `,

  // Boss 2: Brawler Chief
  boss_brawler_chief: `
    <svg width="135" height="135" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="67.5" cy="125" rx="55" ry="8" fill="#000000" opacity="0.3"/>
      
      <!-- Body (muscular) -->
      <rect x="35" y="55" width="65" height="65" rx="8" fill="#FF4A4A" stroke="#CC0000" stroke-width="3"/>
      
      <!-- Muscles definition -->
      <ellipse cx="50" cy="75" rx="12" ry="15" fill="#FF6B35" opacity="0.6"/>
      <ellipse cx="85" cy="75" rx="12" ry="15" fill="#FF6B35" opacity="0.6"/>
      <rect x="62" y="70" width="11" height="35" fill="#CC0000"/>
      
      <!-- Head -->
      <circle cx="67.5" cy="35" r="22" fill="#FF6B35" stroke="#CC0000" stroke-width="3"/>
      
      <!-- Angry face -->
      <circle cx="58" cy="32" r="3" fill="#000000"/>
      <circle cx="77" cy="32" r="3" fill="#000000"/>
      <line x1="55" y1="29" x2="60" y2="31" stroke="#000000" stroke-width="3" stroke-linecap="round"/>
      <line x1="80" y1="29" x2="75" y2="31" stroke="#000000" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Scar -->
      <path d="M 55 25 L 58 28 L 56 30" stroke="#CC0000" stroke-width="2" fill="none"/>
      
      <!-- Angry mouth -->
      <path d="M 58 42 Q 67.5 38 77 42" stroke="#000000" stroke-width="3" fill="none"/>
      
      <!-- Giant Sword -->
      <rect x="105" y="25" width="12" height="80" fill="#CCCCCC" stroke="#888888" stroke-width="2"/>
      <path d="M 111 15 L 105 25 L 117 25 Z" fill="#CCCCCC" stroke="#888888" stroke-width="2"/>
      <rect x="108" y="50" width="6" height="3" fill="#8B4513"/>
      <rect x="103" y="105" width="16" height="8" rx="2" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <circle cx="111" cy="109" r="2" fill="#FFD700"/>
      
      <!-- Armor shoulder pads -->
      <circle cx="30" cy="55" r="12" fill="#888888" stroke="#555555" stroke-width="2"/>
      <circle cx="105" cy="55" r="12" fill="#888888" stroke="#555555" stroke-width="2"/>
      
      <!-- Belt -->
      <rect x="40" y="95" width="55" height="8" fill="#8B4513"/>
      <rect x="63" y="93" width="10" height="12" rx="1" fill="#FFD700" stroke="#CC9900" stroke-width="1"/>
      
      <!-- Legs -->
      <rect x="42" y="118" width="20" height="12" rx="3" fill="#CC0000"/>
      <rect x="73" y="118" width="20" height="12" rx="3" fill="#CC0000"/>
      
      <!-- Ground slam effect -->
      <path d="M 20 120 L 30 125" stroke="#FF4A4A" stroke-width="2" opacity="0.5"/>
      <path d="M 115 120 L 105 125" stroke="#FF4A4A" stroke-width="2" opacity="0.5"/>
    </svg>
  `,

  // Boss 3: Dark Mage
  boss_dark_mage: `
    <svg width="135" height="135" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="67.5" cy="125" rx="45" ry="8" fill="#000000" opacity="0.4"/>
      
      <!-- Floating particles/aura -->
      <circle cx="25" cy="40" r="3" fill="#9D4EFF" opacity="0.6"/>
      <circle cx="110" cy="50" r="3" fill="#9D4EFF" opacity="0.6"/>
      <circle cx="20" cy="80" r="3" fill="#5B2C6F" opacity="0.6"/>
      <circle cx="115" cy="75" r="3" fill="#5B2C6F" opacity="0.6"/>
      <circle cx="30" cy="110" r="3" fill="#9D4EFF" opacity="0.6"/>
      <circle cx="105" cy="105" r="3" fill="#5B2C6F" opacity="0.6"/>
      
      <!-- Magical aura rings -->
      <circle cx="67.5" cy="70" r="55" fill="none" stroke="#9D4EFF" stroke-width="1.5" opacity="0.3" stroke-dasharray="5,5"/>
      <circle cx="67.5" cy="70" r="45" fill="none" stroke="#5B2C6F" stroke-width="1.5" opacity="0.4" stroke-dasharray="3,3"/>
      
      <!-- Robe -->
      <path d="M 67.5 45 L 40 120 L 55 125 L 67.5 90 L 80 125 L 95 120 Z" fill="#2C1E5B" stroke="#1A0F3D" stroke-width="3"/>
      <path d="M 50 60 Q 67.5 65 85 60" fill="#5B2C6F" opacity="0.6"/>
      
      <!-- Body -->
      <ellipse cx="67.5" cy="55" rx="22" ry="28" fill="#5B2C6F" stroke="#2C1E5B" stroke-width="3"/>
      
      <!-- Head (hooded) -->
      <ellipse cx="67.5" cy="30" rx="18" ry="20" fill="#4A4A6A" stroke="#2C1E5B" stroke-width="2"/>
      
      <!-- Hood -->
      <path d="M 50 30 Q 67.5 10 85 30 L 85 40 Q 67.5 35 50 40 Z" fill="#2C1E5B" stroke="#1A0F3D" stroke-width="2"/>
      
      <!-- Shadowed face -->
      <ellipse cx="67.5" cy="32" rx="12" ry="14" fill="#1A0F3D"/>
      
      <!-- Glowing eyes -->
      <circle cx="62" cy="32" r="3" fill="#9D4EFF" opacity="0.9"/>
      <circle cx="73" cy="32" r="3" fill="#9D4EFF" opacity="0.9"/>
      <circle cx="62" cy="32" r="2" fill="#FFFFFF"/>
      <circle cx="73" cy="32" r="2" fill="#FFFFFF"/>
      
      <!-- Floating orb/staff -->
      <line x1="95" y1="110" x2="95" y2="40" stroke="#4A3060" stroke-width="4"/>
      
      <!-- Crystal orb -->
      <circle cx="95" cy="35" r="12" fill="#9D4EFF" opacity="0.8" stroke="#5B2C6F" stroke-width="2"/>
      <circle cx="95" cy="35" r="8" fill="#FFFFFF" opacity="0.4"/>
      <circle cx="92" cy="32" r="3" fill="#FFFFFF" opacity="0.8"/>
      
      <!-- Orb glow -->
      <circle cx="95" cy="35" r="15" fill="none" stroke="#9D4EFF" stroke-width="1" opacity="0.4"/>
      <circle cx="95" cy="35" r="18" fill="none" stroke="#9D4EFF" stroke-width="1" opacity="0.2"/>
      
      <!-- Mystical runes on robe -->
      <circle cx="67.5" cy="70" r="5" fill="none" stroke="#9D4EFF" stroke-width="1"/>
      <path d="M 67.5 65 L 67.5 75 M 62.5 70 L 72.5 70" stroke="#9D4EFF" stroke-width="1"/>
    </svg>
  `,

  // XP Orb - Glowing crystal
  xp_orb: `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="10" cy="10" r="9" fill="#4AFFFF" opacity="0.3"/>
      <circle cx="10" cy="10" r="7" fill="#4AFFFF" opacity="0.5"/>
      
      <!-- Main orb -->
      <circle cx="10" cy="10" r="6" fill="#00FFFF" stroke="#00CCCC" stroke-width="1"/>
      
      <!-- Inner shine -->
      <circle cx="10" cy="10" r="4" fill="#FFFFFF" opacity="0.4"/>
      <circle cx="8" cy="8" r="2" fill="#FFFFFF" opacity="0.8"/>
      
      <!-- Sparkle effect -->
      <path d="M 10 4 L 10 16 M 4 10 L 16 10" stroke="#FFFFFF" stroke-width="0.5" opacity="0.6"/>
    </svg>
  `,

  // Enemy Arrow Projectile
  projectile_arrow: `
    <svg width="24" height="8" viewBox="0 0 24 8" xmlns="http://www.w3.org/2000/svg">
      <!-- Arrow shaft -->
      <rect x="0" y="3" width="20" height="2" fill="#8B4513" stroke="#654321" stroke-width="0.5"/>
      
      <!-- Arrow head -->
      <path d="M 20 4 L 24 2 L 24 6 Z" fill="#888888" stroke="#555555" stroke-width="0.5"/>
      
      <!-- Fletching -->
      <path d="M 2 2 L 0 4 L 2 6 Z" fill="#FF4444" opacity="0.8"/>
    </svg>
  `,

  // Magic projectile (for mages/elite)
  projectile_magic: `
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="8" cy="8" r="7" fill="#9D4EFF" opacity="0.4"/>
      
      <!-- Main orb -->
      <circle cx="8" cy="8" r="6" fill="#9D4EFF" stroke="#7B00FF" stroke-width="1"/>
      
      <!-- Inner core -->
      <circle cx="8" cy="8" r="4" fill="#FFFFFF" opacity="0.6"/>
      
      <!-- Sparkles -->
      <circle cx="5" cy="5" r="1" fill="#FFFFFF"/>
      <circle cx="11" cy="6" r="1" fill="#FFFFFF"/>
      <circle cx="6" cy="11" r="1" fill="#FFFFFF"/>
    </svg>
  `,

  // Power-up backgrounds (circular with different colors)
  powerup_health: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#4AFF4A" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#4AFF4A" stroke="#00CC00" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Highlight -->
      <circle cx="13" cy="13" r="4" fill="#FFFFFF" opacity="0.5"/>
      
      <!-- Cross icon -->
      <rect x="14" y="9" width="4" height="14" rx="1" fill="#FFFFFF"/>
      <rect x="9" y="14" width="14" height="4" rx="1" fill="#FFFFFF"/>
    </svg>
  `,

  powerup_speed: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#4AFFFF" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#4AFFFF" stroke="#00CCCC" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Lightning bolt -->
      <path d="M 18 8 L 12 16 L 16 16 L 14 24 L 20 14 L 16 14 Z" fill="#FFFFFF"/>
    </svg>
  `,

  powerup_damage: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#FF4A4A" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#FF4A4A" stroke="#CC0000" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Sword icon -->
      <rect x="14" y="8" width="4" height="16" rx="1" fill="#FFFFFF"/>
      <rect x="12" y="23" width="8" height="3" rx="1" fill="#FFFFFF"/>
      <path d="M 10 8 L 22 8 L 20 10 L 12 10 Z" fill="#FFFFFF"/>
    </svg>
  `,

  powerup_shield: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#4A9EFF" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#4A9EFF" stroke="#0066CC" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Shield icon -->
      <path d="M 16 8 L 22 11 L 22 17 C 22 21 16 24 16 24 C 16 24 10 21 10 17 L 10 11 Z" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="1"/>
    </svg>
  `,

  powerup_xp: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#FFD700" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#FFD700" stroke="#CC9900" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Star icon -->
      <path d="M 16 9 L 18 14 L 23 14 L 19 17 L 21 23 L 16 19 L 11 23 L 13 17 L 9 14 L 14 14 Z" fill="#FFFFFF"/>
    </svg>
  `,

  powerup_invincibility: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#FFD700" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#FFD700" stroke="#CC9900" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Crown icon -->
      <path d="M 10 18 L 12 13 L 16 16 L 20 13 L 22 18 L 10 18 Z" fill="#FFFFFF"/>
      <circle cx="12" cy="13" r="1.5" fill="#FF0000"/>
      <circle cx="16" cy="16" r="1.5" fill="#FF0000"/>
      <circle cx="20" cy="13" r="1.5" fill="#FF0000"/>
      <rect x="10" y="18" width="12" height="3" fill="#FFFFFF"/>
    </svg>
  `,

  powerup_magnet: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#C94AFF" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#C94AFF" stroke="#8B00FF" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Magnet icon -->
      <path d="M 10 16 L 10 12 C 10 9 13 9 13 12 L 13 16" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 22 16 L 22 12 C 22 9 19 9 19 12 L 19 16" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
      <rect x="10" y="16" width="3" height="5" fill="#FF0000" rx="1"/>
      <rect x="19" y="16" width="3" height="5" fill="#4A9EFF" rx="1"/>
    </svg>
  `,

  powerup_freeze: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#4A9EFF" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#4A9EFF" stroke="#0066CC" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Snowflake icon -->
      <path d="M 16 8 L 16 24 M 10 16 L 22 16 M 11.5 11.5 L 20.5 20.5 M 20.5 11.5 L 11.5 20.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <circle cx="16" cy="8" r="1.5" fill="#FFFFFF"/>
      <circle cx="16" cy="24" r="1.5" fill="#FFFFFF"/>
      <circle cx="10" cy="16" r="1.5" fill="#FFFFFF"/>
      <circle cx="22" cy="16" r="1.5" fill="#FFFFFF"/>
    </svg>
  `,

  powerup_bomb: `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer glow -->
      <circle cx="16" cy="16" r="15" fill="#FF8800" opacity="0.3"/>
      
      <!-- Main circle -->
      <circle cx="16" cy="16" r="12" fill="#FF8800" stroke="#CC6600" stroke-width="2"/>
      
      <!-- Inner shine -->
      <circle cx="16" cy="16" r="10" fill="#FFFFFF" opacity="0.3"/>
      
      <!-- Bomb icon -->
      <circle cx="16" cy="18" r="6" fill="#000000"/>
      <line x1="19" y1="13" x2="22" y2="10" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
      <circle cx="22" cy="10" r="2" fill="#FF4444"/>
      <path d="M 21 9 L 22 8 L 23 9" stroke="#FFFF00" stroke-width="1" fill="none"/>
    </svg>
  `
};

// Helper function to create Image from SVG string
export function createSpriteImage(svgString: string): HTMLImageElement {
  const img = new Image();
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  img.src = url;
  return img;
}

// Cache for loaded sprites
const spriteCache: Map<string, HTMLImageElement> = new Map();

export function getSprite(spriteName: keyof typeof SPRITES): HTMLImageElement {
  if (!spriteCache.has(spriteName)) {
    const img = createSpriteImage(SPRITES[spriteName]);
    spriteCache.set(spriteName, img);
  }
  return spriteCache.get(spriteName)!;
}

