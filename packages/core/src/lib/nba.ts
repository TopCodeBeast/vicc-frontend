import { NBAPlayerPosition } from '__generated__/usSportsGlobalTypes';

const positions = {
  [NBAPlayerPosition.NBA_GUARD]: {
    name: 'Guard',
    initials: 'G',
  },
  [NBAPlayerPosition.NBA_CENTER]: {
    name: 'Center',
    initials: 'C',
  },
  [NBAPlayerPosition.NBA_FORWARD]: {
    name: 'Forward',
    initials: 'F',
  },
} as const;

export type Position = keyof typeof positions;

export const Positions = Object.keys(positions) as Position[];

export const getPositionInitials = (p: Position): string => {
  return positions[p].initials;
};

export const getPositionName = (p: Position): string => {
  return positions[p].name;
};

export const calculateScoreWithBonus = (score: number, bonus: number) => {
  return score > 0 ? score * (1 + bonus) : score;
};
