// Upgrade system for level-ups

import type { UpgradeOption } from './types';
import { randomChoice, randomInt } from './utils';

export function generateUpgradeOptions(playerLevel: number, availableBallTypes: string[]): UpgradeOption[] {
  const allUpgrades = createAllUpgrades();
  const options: UpgradeOption[] = [];
  
  // Weighted random selection
  const weights = {
    combat: 0.4,
    ball: 0.35,
    utility: 0.25
  };
  
  for (let i = 0; i < 3; i++) {
    const rand = Math.random();
    let category: 'combat' | 'ball' | 'utility';
    
    if (rand < weights.combat) {
      category = 'combat';
    } else if (rand < weights.combat + weights.ball) {
      category = 'ball';
    } else {
      category = 'utility';
    }
    
    // Filter available upgrades
    const availableUpgrades = allUpgrades.filter(upgrade => {
      if (upgrade.category !== category) return false;
      
      // Check if ball type is already unlocked
      if (upgrade.id.startsWith('unlock_') && availableBallTypes.includes(upgrade.id.replace('unlock_', ''))) {
        return false;
      }
      
      return true;
    });
    
    if (availableUpgrades.length > 0) {
      const selected = randomChoice(availableUpgrades);
      options.push(selected);
      
      // Remove from pool to avoid duplicates
      const index = allUpgrades.indexOf(selected);
      if (index > -1) allUpgrades.splice(index, 1);
    }
  }
  
  return options;
}

function createAllUpgrades(): UpgradeOption[] {
  return [
    // Combat upgrades
    {
      id: 'max_hp',
      name: '+10 Max HP',
      description: 'Increase maximum health by 10',
      icon: '❤️',
      rarity: 'common',
      category: 'combat',
      apply: (game: any) => {
        game.player.stats.maxHp += 10;
        game.player.stats.hp += 10;
      }
    },
    {
      id: 'base_damage',
      name: '+5 Damage',
      description: 'Increase all ball damage by 5',
      icon: '⚔️',
      rarity: 'common',
      category: 'combat',
      apply: (game: any) => {
        game.baseDamageBonus = (game.baseDamageBonus || 0) + 5;
      }
    },
    {
      id: 'add_3_balls',
      name: '+3 Normal Balls',
      description: 'Add 3 Normal Balls to inventory',
      icon: '🔵',
      rarity: 'common',
      category: 'combat',
      apply: (game: any) => {
        game.player.inventory.normal += 3;
      }
    },
    {
      id: 'ball_speed',
      name: 'Ball Speed +20%',
      description: 'Increase ball throwing speed',
      icon: '⚡',
      rarity: 'uncommon',
      category: 'combat',
      apply: (game: any) => {
        game.ballSpeedMultiplier = (game.ballSpeedMultiplier || 1) * 1.2;
      }
    },
    {
      id: 'crit_chance',
      name: 'Critical Hit +10%',
      description: 'Increase critical hit chance (2x damage)',
      icon: '💥',
      rarity: 'rare',
      category: 'combat',
      apply: (game: any) => {
        game.player.critChance = Math.min(0.5, game.player.critChance + 0.1);
      }
    },
    {
      id: 'life_steal',
      name: 'Life Steal',
      description: 'Heal 5% of damage dealt',
      icon: '🩸',
      rarity: 'rare',
      category: 'combat',
      apply: (game: any) => {
        game.hasLifeSteal = true;
      }
    },
    
    // Ball additions (balls auto-upgrade, so we give normal balls)
    {
      id: 'add_5_balls',
      name: '+5 Normal Balls',
      description: 'Add 5 Normal Balls (auto-upgrade ready!)',
      icon: '🔵',
      rarity: 'common',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.normal += 5;
      }
    },
    {
      id: 'add_lightning',
      name: '+1 Lightning Ball',
      description: 'Gain 1 Lightning Ball directly',
      icon: '⚡',
      rarity: 'uncommon',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.lightning += 1;
      }
    },
    {
      id: 'add_ghost',
      name: '+1 Ghost Ball',
      description: 'Gain 1 Ghost Ball (top tier!)',
      icon: '👻',
      rarity: 'rare',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.ghost += 1;
      }
    },
    {
      id: 'add_bomb',
      name: '+1 Bomb Ball',
      description: 'Gain 1 Bomb Ball (explosive special)',
      icon: '💣',
      rarity: 'epic',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.bomb += 1;
      }
    },
    
    // Ball enhancements
    {
      id: 'ball_damage',
      name: '+50% Ball Damage',
      description: 'All balls deal 50% more damage',
      icon: '💪',
      rarity: 'uncommon',
      category: 'ball',
      apply: (game: any) => {
        game.player.damageMultiplier = (game.player.damageMultiplier || 1) * 1.5;
      }
    },
    {
      id: 'ball_size',
      name: 'Bigger Balls',
      description: 'Balls are 25% larger (easier to hit)',
      icon: '🔵',
      rarity: 'common',
      category: 'ball',
      apply: (game: any) => {
        game.ballSizeMultiplier = (game.ballSizeMultiplier || 1) * 1.25;
      }
    },
    
    // Utility upgrades
    {
      id: 'xp_magnet',
      name: 'XP Magnet Range +50%',
      description: 'Increase XP collection radius',
      icon: '🧲',
      rarity: 'common',
      category: 'utility',
      apply: (game: any) => {
        game.xpMagnetMultiplier = (game.xpMagnetMultiplier || 1) * 1.5;
      }
    },
    {
      id: 'move_speed',
      name: 'Movement Speed +25%',
      description: 'Move faster',
      icon: '👟',
      rarity: 'common',
      category: 'utility',
      apply: (game: any) => {
        game.player.stats.moveSpeed *= 1.25;
      }
    },
    {
      id: 'lucky_drops',
      name: 'Lucky Drops',
      description: '+20% power-up drop rate',
      icon: '🍀',
      rarity: 'uncommon',
      category: 'utility',
      apply: (game: any) => {
        game.dropRateBonus = (game.dropRateBonus || 0) + 0.2;
      }
    },
    {
      id: 'treasure_hunter',
      name: 'Treasure Hunter',
      description: '+50% XP from all sources',
      icon: '💰',
      rarity: 'rare',
      category: 'utility',
      apply: (game: any) => {
        game.xpMultiplier = (game.xpMultiplier || 1) * 1.5;
      }
    },
    {
      id: 'second_wind',
      name: 'Second Wind',
      description: 'Revive once at 50% HP (per run)',
      icon: '💚',
      rarity: 'epic',
      category: 'utility',
      apply: (game: any) => {
        game.hasSecondWind = true;
      }
    }
  ];
}

