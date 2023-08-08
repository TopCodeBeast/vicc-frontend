import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

export const CardsRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: var(--double-unit);
  padding: var(--double-unit);
  > * {
    width: 160px;
    flex: none;
    @media ${tabletAndAbove} {
      width: 200px;
    }
  }
`;
