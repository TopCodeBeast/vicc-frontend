import { ReactNode } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';
import styled, { css } from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Content as AppLayoutContent } from '@sorare/core/src/components/navigation/AppLayout';
import {
  desktopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

const gridCss = css<{ columns?: number }>`
  display: grid;
  gap: var(--double-unit);
  grid-template-columns: 1fr;
  &.hideDetails {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media ${tabletAndAbove} {
    &,
    &.hideDetails {
      grid-template-columns: repeat(5, minmax(0, 1fr));
      &.showDesktopFilter {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  }
  @media ${desktopAndAbove} {
    ${AppLayoutContent} &.showDesktopFilter {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
  }
`;

export const Grid = styled.div`
  ${gridCss}
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(var(--c-rgb-neutral-100), 0.4);
`;

const LoadingIndicatorContainer = styled.div`
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
`;

export const GridOverlayLoadingIndicator = () => {
  return (
    <LoadingOverlay>
      <LoadingIndicatorContainer>
        <LoadingIndicator />
      </LoadingIndicatorContainer>
    </LoadingOverlay>
  );
};

export const AnimatedGrid = styled(Flipper)`
  ${gridCss}
`;

const onAppear = (el: HTMLElement) => {
  el.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 400,
  });
  el.style.opacity = '1';
};

export const AnimatedGridItem = ({
  children,
  flipId,
  onMouseEnter,
  onMouseLeave,
}: {
  children: ReactNode;
  flipId: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <Flipped onAppear={onAppear} flipId={flipId}>
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {children}
      </div>
    </Flipped>
  );
};
