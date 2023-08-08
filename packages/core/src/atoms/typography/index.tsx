import styled, { css } from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';
import { Color } from '@core/style/types';

const variant = ({
  bold,
  uppercase,
}: {
  bold?: boolean;
  uppercase?: boolean;
}) => css`
  ${bold
    ? css`
        font-weight: var(--t-bold);
      `
    : null}
  ${uppercase
    ? css`
        text-transform: uppercase;
      `
    : null}
`;
const titleVariant = ({ uppercase }: { uppercase?: boolean }) => css`
  ${uppercase
    ? css`
        text-transform: uppercase !important;
        font-style: italic !important;
        font-weight: var(--t-bolder) !important;
      `
    : null}
`;

export type Props = {
  color?: Color;
  bold?: boolean;
  uppercase?: boolean;
};

const getColorsStyle = ({ color }: Props) => {
  return {
    style: { color },
  };
};

// Mixins to use when helper component isn't appropriate
export const title1 = css`
  font: var(--t-bold) var(--t-32);
  @media ${tabletAndAbove} {
    font: var(--t-bold) var(--t-48);
  }
  ${titleVariant}
`;
export const title2 = css`
  font: var(--t-bolder) var(--t-24);
  @media ${tabletAndAbove} {
    font: var(--t-bolder) var(--t-32);
  }
  ${titleVariant}
`;
export const title3 = css`
  font: var(--t-bold) var(--t-20);
  @media ${tabletAndAbove} {
    font: var(--t-bold) var(--t-24);
  }
  ${titleVariant}
`;
export const title4 = css`
  font: var(--t-bold) var(--t-18);
  @media ${tabletAndAbove} {
    font: var(--t-bold) var(--t-20);
  }
`;
export const title5 = css`
  font: var(--t-bold) var(--t-18);
`;
export const title6 = css`
  font: var(--t-bold) var(--t-16);
`;
export const text20 = css`
  font: var(--t-18-26);
  ${variant}
`;
export const text18 = css`
  font: var(--t-18-26);
  ${variant}
`;
export const text16 = css`
  font: var(--t-16);
  ${variant}
`;
export const text14 = css`
  font: var(--t-14);
  ${variant}
`;
export const button16 = css`
  text-transform: uppercase;
  font: italic var(--t-bolder) var(--t-16);
`;
export const button14 = css`
  text-transform: uppercase;
  font: italic var(--t-bolder) var(--t-14);
`;
export const button12 = css`
  text-transform: uppercase;
  font: italic var(--t-bolder) var(--t-12);
`;
export const overline = css`
  text-transform: uppercase;
  font: var(--t-14-16);
  ${variant}
`;
export const caption = css`
  font: var(--t-12);
  ${variant}
`;

// Helper component that can be used 90% of the time.
export const Title1 = styled.h1`
  ${title1};
`;
export const Title2 = styled.h2.attrs<Props>(getColorsStyle)<Props>`
  ${title2};
`;
export const Title3 = styled.h3.attrs<Props>(getColorsStyle)<Props>`
  ${title3};
`;
export const Title4 = styled.h4.attrs<Props>(getColorsStyle)<Props>`
  ${title4};
`;
export const Title5 = styled.h5.attrs<Props>(getColorsStyle)<Props>`
  ${title5};
`;
export const Title6 = styled.h6.attrs<Props>(getColorsStyle)<Props>`
  ${title6};
`;
export const Text20 = styled.p.attrs<Props>(getColorsStyle)<Props>`
  ${text20};
`;
export const Text18 = styled.p.attrs<Props>(getColorsStyle)<Props>`
  ${text18};
`;
export const Text16 = styled.p.attrs<Props>(getColorsStyle)<Props>`
  ${text16};
`;
export const Text14 = styled.p.attrs<Props>(getColorsStyle)<Props>`
  ${text14};
`;
export const Overline = styled.p.attrs<Props>(getColorsStyle)<Props>`
  ${overline};
`;
export const Caption = styled.p.attrs<Props>(getColorsStyle)<Props>`
  ${caption};
`;

export type TypographyVariant =
  | typeof Title1
  | typeof Title2
  | typeof Title3
  | typeof Title4
  | typeof Title5
  | typeof Title6
  | typeof Text20
  | typeof Text18
  | typeof Text16
  | typeof Text14
  | typeof Overline
  | typeof Caption
  | any;
