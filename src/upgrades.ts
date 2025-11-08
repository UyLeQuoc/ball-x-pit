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
      id: 'add_ball',
      name: '+1 Normal Ball',
      description: 'Add 1 Normal Ball to inventory',
      icon: '🔵',
      rarity: 'common',
      category: 'combat',
      apply: (game: any) => {
        game.player.inventory.normal += 1;
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
    
    // Ball type unlocks
    {
      id: 'unlock_fire',
      name: 'Unlock Fire Ball',
      description: 'Gain 1 Fire Ball (burn DoT + piercing)',
      icon: '🔥',
      rarity: 'uncommon',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.fire += 1;
      }
    },
    {
      id: 'unlock_ice',
      name: 'Unlock Ice Ball',
      description: 'Gain 1 Ice Ball (slow + AoE freeze)',
      icon: '❄️',
      rarity: 'uncommon',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.ice += 1;
      }
    },
    {
      id: 'unlock_lightning',
      name: 'Unlock Lightning Ball',
      description: 'Gain 1 Lightning Ball (chain lightning)',
      icon: '⚡',
      rarity: 'uncommon',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.lightning += 1;
      }
    },
    {
      id: 'unlock_poison',
      name: 'Unlock Poison Ball',
      description: 'Gain 1 Poison Ball (DoT + contagion)',
      icon: '☠️',
      rarity: 'uncommon',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.poison += 1;
      }
    },
    {
      id: 'unlock_bomb',
      name: 'Unlock Bomb Ball',
      description: 'Gain 1 Bomb Ball (AoE explosion)',
      icon: '💣',
      rarity: 'rare',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.bomb += 1;
      }
    },
    {
      id: 'unlock_ghost',
      name: 'Unlock Ghost Ball',
      description: 'Gain 1 Ghost Ball (phases through enemies)',
      icon: '👻',
      rarity: 'epic',
      category: 'ball',
      apply: (game: any) => {
        game.player.inventory.ghost += 1;
      }
    },
    
    // Ball enhancements
    {
      id: 'piercing',
      name: 'Piercing Shot',
      description: 'Balls pierce through 1 extra enemy',
      icon: '➡️',
      rarity: 'uncommon',
      category: 'ball',
      apply: (game: any) => {
        game.piercingCount = (game.piercingCount || 0) + 1;
      }
    },
    {
      id: 'bounce_boost',
      name: 'Bounce Boost',
      description: '+2 bounces before ball returns',
      icon: '🏀',
      rarity: 'common',
      category: 'ball',
      apply: (game: any) => {
        game.bonusBounces = (game.bonusBounces || 0) + 2;
      }
    },
    {
      id: 'explosive_impact',
      name: 'Explosive Impact',
      description: '15% chance for AoE explosion on hit',
      icon: '💥',
      rarity: 'rare',
      category: 'ball',
      apply: (game: any) => {
        game.explosiveChance = (game.explosiveChance || 0) + 0.15;
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

