import styled, { css } from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

export const Gap = styled.div<{ size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }>`
  ${({ size }) => {
    switch (size) {
      case 'xs':
        return css`
          height: calc(2 * var(--double-and-a-half-unit));
        `;
      case 'sm':
        return css`
          height: calc(2 * var(--double-and-a-half-unit));
        `;
      case 'md':
        return css`
          height: calc(3 * var(--double-and-a-half-unit));
        `;
      case 'lg':
        return css`
          height: calc(3 * var(--double-and-a-half-unit));
        `;
      case 'xl':
        return css`
          height: calc(6 * var(--double-and-a-half-unit));
        `;
      default:
        return css`
          height: 40px;
        `;
    }
  }}
  @media ${tabletAndAbove} {
    ${({ size }) => {
      switch (size) {
        case 'xs':
          return css`
            height: calc(2 * var(--double-and-a-half-unit));
          `;
        case 'sm':
          return css`
            height: calc(3 * var(--double-and-a-half-unit));
          `;
        case 'md':
          return css`
            height: calc(4 * var(--double-and-a-half-unit));
          `;
        case 'lg':
          return css`
            height: calc(6 * var(--double-and-a-half-unit));
          `;
        case 'xl':
          return css`
            height: calc(9 * var(--double-and-a-half-unit));
          `;
        default:
          return css`
            height: calc(2 * var(--double-and-a-half-unit));
          `;
      }
    }}
  }
`;

export default Gap;
