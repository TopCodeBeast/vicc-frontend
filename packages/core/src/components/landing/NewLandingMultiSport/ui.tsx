import styled from 'styled-components';

import { desktopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

export const ContentContainer = styled.div`
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--double-unit);

  @media ${tabletAndAbove} {
    padding-inline: calc(var(--unit) * 5);
  }

  @media ${desktopAndAbove} {
    padding: 0;
    max-width: min(
      calc(var(--unit) * 165),
      calc(100% - 2 * var(--double-unit))
    );
  }
`;
