import styled from 'styled-components';

import { theme } from '@core/style/theme';

export const ContentContainer = styled.div`
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--double-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-inline: calc(var(--unit) * 5);
  }

  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    padding: 0;
    max-width: min(
      calc(var(--unit) * 165),
      calc(100% - 2 * var(--double-unit))
    );
  }
`;
