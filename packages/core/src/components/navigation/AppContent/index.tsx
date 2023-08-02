import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

export const AppContent = styled.div`
  padding: var(--double-unit);
  @media ${tabletAndAbove} {
    padding: var(--quadruple-unit);
  }
`;
