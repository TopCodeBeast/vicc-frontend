import { defineMessages } from 'react-intl';

import { CamelCaseScarcity, rarities } from './cards';

export const scarcities = [...rarities, 'mix'] as const;

export type ScarcityType = (typeof scarcities)[number];

export const scarcityMessages = defineMessages({
  common: {
    id: 'ScarcityBall.common',
    defaultMessage: 'Common',
  },
  custom_series: {
    id: 'ScarcityBall.custom_series',
    defaultMessage: 'Custom Series',
  },
  limited: {
    id: 'ScarcityBall.limited',
    defaultMessage: 'Limited',
  },
  mix: {
    id: 'ScarcityBall.mix',
    defaultMessage: 'Mix',
  },
  rare: {
    id: 'ScarcityBall.rare',
    defaultMessage: 'Rare',
  },
  rare_pro: {
    id: 'ScarcityBall.rare_pro',
    defaultMessage: 'Rare Pro',
  },
  super_rare: {
    id: 'ScarcityBall.super_rare',
    defaultMessage: 'Super Rare',
  },
  unique: {
    id: 'ScarcityBall.unique',
    defaultMessage: 'Unique',
  },
});

export const rarityName = {
  common: 'COMMON',
  mix: 'MIX',
  unique: 'UNIQUE',
  super_rare: 'SUPER RARE',
  rare_pro: 'RARE PRO',
  rare: 'RARE',
  limited: 'LIMITED',
  custom_series: 'CUSTOM SERIES',
};
export type LobbyRarity = keyof typeof rarityName;

export const RANKED_SCARCITY = {
  global_cup: 0,
  custom_series: 1,
  academy1: 2,
  academy2: 3,
  academy3: 4,
  academy4: 5,
  academy5: 6,
  common: 7,
  limited: 8,
  rare: 9,
  rare_pro: 10,
  super_rare: 11,
  unique: 12,
  mix: 13,
  training: 14,
};

export type RankedScarcity = keyof typeof RANKED_SCARCITY;

export const camelCaseScarcityToScarcity = (
  scarcity: CamelCaseScarcity
): ScarcityType => {
  if (scarcity === 'superRare') {
    return 'super_rare';
  }
  if (scarcity === 'customSeries') {
    return 'custom_series';
  }
  return scarcity;
};

export function sortByRarity<T extends RankedScarcity>(items: T[]): T[];
export function sortByRarity<T>(
  items: T[],
  accessor: (it: T) => RankedScarcity
): T[];
export function sortByRarity<T>(
  items: T[],
  accessor?: (it: T) => RankedScarcity
): T[] {
  return [...(items ?? [])].sort(
    (a, b) =>
      RANKED_SCARCITY[accessor?.(b) ?? (b as RankedScarcity)] -
      RANKED_SCARCITY[accessor?.(a) ?? (a as RankedScarcity)]
  );
}
