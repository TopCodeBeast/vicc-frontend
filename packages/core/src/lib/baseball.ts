export type Scarcity = 'common' | 'limited' | 'rare' | 'super_rare' | 'unique';

export const getScarcityName = (scarcity: Scarcity): string =>
  scarcity.replace('_', ' ');
  
export const getPositionInitials = (p: any): string => {
  return '1B';
};

export const getPositionName = (p: any): string => {
  return 'Catcher';
};
