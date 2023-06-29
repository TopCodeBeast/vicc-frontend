import { animated } from '@react-spring/web';
import styled from 'styled-components';

import { drukwideSuper } from '@core/components/marketing/typography';
import { tabletAndAbove } from '@core/style/mediaQuery';

export const TitlesContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

export const Section = styled.div`
  padding-top: 60px;
  padding-bottom: 60px;
  @media ${tabletAndAbove} {
    padding-top: 100px;
    padding-bottom: 100px;
  }
`;

export const MixedFontTitle = styled.h2`
  ${drukwideSuper}
  font-size: 24px;
  line-height: 100%;
  text-transform: uppercase;
  word-break: break-word;
  text-align: center;

  span {
    font-size: 26px;
    font-family: Romie-Regular, sans-serif;
  }

  @media ${tabletAndAbove} {
    font-size: 60px;

    span {
      font-size: 60px;
    }
  }
`;

export const SubTitle = styled.h3`
  font: var(--t-16);
  line-height: 120%;
  font-weight: 600;
  max-width: 800px;
  margin: 0 auto;
  @media ${tabletAndAbove} {
    font-size: 22px;
  }
`;

export const BackgroundOverlay = styled.div<{ $color: string }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(51, 5, 58, 0) 21.91%,
    ${props => props.$color} 95%,
    ${props => props.$color} 100%
  );
`;
