import { BaseballPlayerPosition } from '__generated__/usSportsGlobalTypes';

export type Scarcity = 'common' | 'limited' | 'rare' | 'super_rare' | 'unique';

export const getScarcityName = (scarcity: Scarcity): string =>
  scarcity.replace('_', ' ');

const positions = {
  [BaseballPlayerPosition.STARTING_PITCHER]: {
    name: 'Starting pitcher',
    initials: 'SP',
  },
  [BaseballPlayerPosition.RELIEF_PITCHER]: {
    name: 'Relief pitcher',
    initials: 'RP',
  },
  [BaseballPlayerPosition.FIRST_BASE]: { name: 'First base', initials: '1B' },
  [BaseballPlayerPosition.THIRD_BASE]: { name: 'Third base', initials: '3B' },
  [BaseballPlayerPosition.DESIGNATED_HITTER]: {
    name: 'Designated hitter',
    initials: 'DH',
  },
  [BaseballPlayerPosition.CATCHER]: { name: 'Catcher', initials: 'C' },
  [BaseballPlayerPosition.SECOND_BASE]: { name: 'Second base', initials: '2B' },
  [BaseballPlayerPosition.SHORTSTOP]: { name: 'Shortstop', initials: 'SS' },
  [BaseballPlayerPosition.OUTFIELD]: { name: 'Outfield', initials: 'OF' },
} as const;

export type Position = keyof typeof positions;

export const Positions = Object.keys(positions) as Position[];

export const getPositionInitials = (p: Position): string => {
  return positions[p].initials;
};

export const getPositionName = (p: Position): string => {
  return positions[p].name;
};
