import styled, { css } from 'styled-components';

import { laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';
import { Color } from '@core/style/types';

type Props = {
  color?: Color;
};

export const drukwideSuper = css`
  font-family: DrukWide-Super, sans-serif;
  font-style: normal;
  font-weight: 950;
`;

export const Romie20 = styled.h5<Props>`
  font-size: 20px;
  line-height: 140%;
  color: ${({ color }) => color || 'var(--c-static-neutral-1000)'};
  font-family: Romie-Regular, serif;
  font-weight: 400;

  & b {
    font-weight: 400;
    color: var(--c-pink-600);
  }
`;

export const DrukWide24 = styled.h3`
  font-family: Druk Wide;
  font-size: 24px;
  text-transform: uppercase;
  line-height: 100%;
  color: ${({ color }) => color || 'var(--c-static-neutral-1000)'};
`;

export const DrukWide40 = styled.h4<Props>`
  font-size: 40px;
  line-height: 140%;
  color: ${({ color }) => color || 'var(--c-static-neutral-1000)'};
  font-family: Druk Wide, sans-serif;
  font-weight: 400;
`;

export const DrukWide64 = styled.h4<Props>`
  font-size: 32px;
  line-height: 100%;
  color: ${({ color }) => color || 'var(--c-static-neutral-1000)'};
  text-transform: uppercase;
  font-family: Druk Wide, sans-serif;
  font-weight: 400;

  @media ${laptopAndAbove} {
    font-size: 64px;
  }

  & b {
    font-size: 32px;
    font-weight: 400;
    font-family: Romie-Regular, serif;
    @media ${laptopAndAbove} {
      font-size: 68px;
    }
  }
`;

export const DrukWide104 = styled.h4<Props>`
  font-size: 48px;
  line-height: 90%;
  text-transform: uppercase;
  font-family: Druk Wide, sans-serif;
  word-break: break-word;

  @media ${tabletAndAbove} {
    font-size: 104px;
  }
`;

export const MarketingText32 = styled.p`
  font-size: 32px;
  line-height: 115%;
  color: ${({ color }) => color || 'var(--c-static-neutral-1000)'};

  & b {
    font-weight: 400;
    font-style: italic;
    font-family: Romie-Italic, serif;
    color: var(--c-pink-600);
  }

  & a {
    font-weight: 400;
    font-style: italic;
    font-family: Romie-Italic, serif;
    color: var(--c-pink-1000);
  }
`;

export const MarketingText20 = styled.p`
  font-size: 20px;
  line-height: 140%;
  color: ${({ color }) => color || 'var(--c-static-neutral-1000)'};

  & b {
    font-weight: 400;
    font-style: italic;
    font-family: Romie-Italic, serif;
    background-color: var(--c-pink-600);
  }

  & a {
    font-weight: 400;
    font-style: italic;
    font-family: Romie-Italic, serif;
    color: var(--c-pink-1000);
  }
`;
