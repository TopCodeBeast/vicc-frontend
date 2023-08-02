import styled, { css } from 'styled-components';

import { breakpoints } from '@core/style/mediaQuery';

export const Container = styled.div`
  display: grid;
  --container-padding: var(--double-unit);
  --container-width: min(
    ${breakpoints.desktop}px,
    calc(100% - 2 * var(--container-padding))
  );

  grid-template-columns:
    1fr
    var(--container-width)
    1fr;
  & > * {
    grid-column: 2;
  }
`;

const fullWidthStyles = css`
  width: 100%;
  grid-column: 1 / 4;
`;

export const FullWidth = styled.div`
  ${fullWidthStyles}
`;

export const FullWidthContainer = styled(Container)`
  ${fullWidthStyles}
`;

export const FullWidthScroll = styled(FullWidth)`
  padding: 0
    calc(
      (
          100% -
            min(
              min(
                ${breakpoints.desktop}px,
                calc(100% - 2 * var(--container-padding))
              )
            )
        ) / 2
    );
  scroll-padding-left: calc(
    (
        100% -
          min(
            min(
              ${breakpoints.desktop}px,
              calc(100% - 2 * var(--container-padding))
            )
          )
      ) / 2
  );
  overflow: auto;
  scroll-snap-type: x mandatory;
`;

export const SmallContainer = styled(Container)`
  grid-template-columns:
    1fr
    min(${breakpoints.tablet}px, calc(100% - 2 * var(--container-padding)))
    1fr;
`;
