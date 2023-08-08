import styled from 'styled-components';

import { range } from '@core/lib/arrays';
import { tabletAndAbove } from '@core/style/mediaQuery';

export const PromoBanners = styled.div<{ only?: number }>`
  display: flex;
  gap: var(--unit);
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: space-between;
  &:empty {
    display: none;
  }

  @media ${tabletAndAbove} {
    gap: var(--double-unit);
  }
  & > * {
    flex: 1;
    flex-basis: 100%;

    @media ${tabletAndAbove} {
      flex-basis: 30%;
    }
  }

  ${({ only }) =>
    only &&
    `
    & > * {
      visibility: hidden;
      display: none !important;
      ${range(only)
        .map(
          (_, i) =>
            `
            &:nth-child(${i + 1}) {
              visibility: visible;
              display: flex !important;
            }
            `
        )
        .join('\n')}
    }
  `}
`;
