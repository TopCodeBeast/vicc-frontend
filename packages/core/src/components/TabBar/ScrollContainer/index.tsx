import { ReactNode, forwardRef } from 'react';
import styled from 'styled-components';

import { Container } from '@core/atoms/container';
import useIsReorgApp from '@core/hooks/ui/useIsReorgApp';
import { desktopAndAbove } from '@core/style/mediaQuery';
import { hideScrollbar } from '@core/style/utils';

const Wrapper = styled(Container)`
  overflow: hidden;
  --container-padding: 0px;
  @media ${desktopAndAbove} {
    --container-padding: var(--double-unit);
  }
`;

const Scroller = styled.div`
  ${hideScrollbar}
  display: flex;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: 0 var(--double-unit);
  scroll-padding-inline: var(--double-unit);
  scroll-snap-type: x mandatory;
  @media ${desktopAndAbove} {
    --mask-size: var(--quadruple-unit);
    scroll-padding-inline: var(--mask-size);
    padding-inline: var(--mask-size);
    margin-inline: calc(-1 * var(--mask-size));
    mask-image: linear-gradient(
      to right,
      transparent,
      white var(--mask-size),
      white calc(100% - var(--mask-size)),
      transparent
    );
  }
`;

type Props = {
  children: ReactNode;
};

export const ScrollContainer = forwardRef<HTMLDivElement, Props>(
  ({ children }, ref) => {
    const isReorgApp = useIsReorgApp();
    if (isReorgApp) {
      return <Scroller>{children}</Scroller>;
    }
    return (
      <Wrapper>
        <Scroller ref={ref}>{children}</Scroller>
      </Wrapper>
    );
  }
);
ScrollContainer.displayName = 'ScrollContainer';
