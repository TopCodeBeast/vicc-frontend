import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { range } from '@sorare/core/src/lib/arrays';
import {
  breakpoints,
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';
import { hideScrollbar } from '@sorare/core/src/style/utils';

export const HOME_ROWS = 3;

const Wrapper = styled.div`
  ${hideScrollbar}
  overflow: auto;
  display: grid;
  gap: var(--double-unit);
  grid-template-columns: repeat(3, max(300px, 80%));
  grid-template-rows: 1fr;
  /* full width container but preserve paddings. */
  padding: 0 100vh;
  margin: 0 -100vh;
  scroll-snap-type: x mandatory;
  > * {
    scroll-snap-align: center;
  }
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(3, 520px);
  }
  @media ${laptopAndAbove} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: ${breakpoints.laptop}px) {
    &.singleChild {
      grid-template-columns: max(280px, 100%);
    }
  }
`;

export const EmptyBlock = styled.div`
  background-color: var(--c-neutral-200);
  border-radius: var(--double-unit);
  opacity: 0.23;
`;
type Props = {
  children: ReactNode;
  itemsCount?: number;
  loading?: boolean;
  minHeight?: number;
};

export const ItemRows = ({
  children,
  itemsCount,
  loading,
  minHeight = 250,
}: Props) => {
  const { up: isTablet } = useScreenSize('tablet');

  const getRowsToFill = () => {
    if (loading) {
      return HOME_ROWS;
    }
    if (isTablet) {
      return Math.max(0, HOME_ROWS - (itemsCount || 0));
    }
    return 0;
  };
  return (
    <Wrapper
      className={classnames({
        singleChild: Array.isArray(children) && children.length === 1,
      })}
      style={{ minHeight }}
    >
      {!loading && children}
      {range(getRowsToFill()).map(v => (
        <EmptyBlock key={v} />
      ))}
    </Wrapper>
  );
};
