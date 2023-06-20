import { animated } from 'react-spring';
import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

export const TitlesContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

export const Section = styled.div`
  padding-top: 60px;
  padding-bottom: 60px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-top: 100px;
    padding-bottom: 100px;
  }
`;

export const MixedFontTitle = styled.h2`
  ${theme.styledFonts.drukWideSuper}
  font-size: 24px;
  line-height: 100%;
  text-transform: uppercase;
  word-break: break-word;
  text-align: center;

  span {
    font-size: 26px;
    font-family: Romie-Regular, sans-serif;
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
