export const cardWidth = 257;
export const cardHeight = 416;
export const cardRatio = cardWidth / cardHeight;

export const gold = '#FACC90';
export const black = '#0D0C11';

export const cardBorderRadius = 12;
export const cardBorderRadius2022 = 26;

const font = (
  fontFamily: string,
  fontWeight: number,
  opts = {}
): { fontFamily: string; fontWeight: number; fontStyle: string } => ({
  fontFamily,
  fontWeight,
  fontStyle: 'normal',
  ...opts,
});

export const tradeGothicNextCondensedBold = font(
  'trade-gothic-next-condensed',
  700
);

export const bebasNeueRegular = font('bebas-neue', 400);

export const tradeGothicNextBold = font('trade-gothic-next', 700);

export const sofiaBold = font('sofia-pro', 700);

export const sofiaRegular = font('sofia-pro', 400);

export const obviaBold = font('obvia', 800);

export const obviaExpandedMedium = font('obvia-expanded', 600);

export const obviaExpandedBlack = font('obvia-expanded', 900);

export const rigidSquareSemiBold = font('rigid-square', 600);

export const rigidSquareBold = font('rigid-square', 700);
