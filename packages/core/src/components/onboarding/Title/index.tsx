import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

export const OnboardingTitle = styled.h1`
  margin: 0;
  font-weight: bold;
  text-transform: uppercase;
  font-style: italic;
  margin-bottom: var(--double-unit);
  font-size: var(--quadruple-unit);
  @media ${tabletAndAbove} {
    font-size: calc(6 * var(--unit));
  }
`;
