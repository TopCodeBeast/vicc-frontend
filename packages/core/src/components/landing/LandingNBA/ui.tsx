import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

export const MixedFontTitle = styled.h2`
  font-family: YWFT Maetl;

  font-style: normal;
  font-weight: 900;
  font-size: 20px;
  line-height: 100%;

  text-transform: uppercase;
  word-break: break-word;
  text-align: center;

  span {
    font-size: 30px;
    line-height: 107%;

    font-weight: 300;
    font-family: Druk Wide, sans-serif;
  }

  @media ${tabletAndAbove} {
    font-size: 48px;

    span {
      font-size: 76px;
      line-height: 100%;
    }
  }
`;

export const BlockTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  font-family: Druk Wide, sans-serif;
  text-transform: uppercase;

  @media ${tabletAndAbove} {
    font-size: 48px;
  }
`;

export const BlockSubTitle = styled.h3`
  font: var(--t-16);
  line-height: 120%;
  font-weight: normal;
  margin-top: var(--double-unit);

  @media ${tabletAndAbove} {
    margin-top: 0;
    font-size: 22px;
  }
`;
