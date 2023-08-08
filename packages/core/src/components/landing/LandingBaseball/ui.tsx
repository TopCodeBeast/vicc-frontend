import styled from 'styled-components';

import { desktopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

export const MixedFontTitle = styled.h2`
  font-family: Druk Wide, sans-serif;
  font-style: normal;
  font-weight: 900;
  font-size: 14px;
  line-height: 100%;

  text-transform: uppercase;
  text-align: center;

  span {
    font-size: 60px;
    line-height: 100%;

    font-weight: 300;
    font-family: Kreuz Extended Light;
  }

  @media ${tabletAndAbove} {
    font-size: 24px;

    span {
      font-size: 120px;
      line-height: 110px;
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
  font-weight: normal;
  margin-top: var(--double-unit);

  @media ${tabletAndAbove} {
    margin-top: 0;
    font-size: 22px;
  }
`;

export const Stitching = styled.img`
  position: absolute;
  left: 50%;
  max-width: 100%;
  transform: translate(-50%);
  bottom: 0;

  @media ${tabletAndAbove} {
    bottom: calc(var(--unit) * 10 * -1);
  }
  @media ${desktopAndAbove} {
    bottom: calc(var(--unit) * 8 * -1);
  }
`;
