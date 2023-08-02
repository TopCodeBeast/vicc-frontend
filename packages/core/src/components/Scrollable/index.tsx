import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import { Children, ReactNode, UIEventHandler, useState } from 'react';
import { useDebounce } from 'react-use';
import styled, { css } from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import useIsOverflowing from '@core/hooks/ui/useIsOverflowing';
import useScrollPosition from '@core/hooks/ui/useScrollPosition';
import useScrollToIndex from '@core/hooks/ui/useScrollToIndex';
import { range } from '@core/lib/arrays';
import { desktopAndAbove, laptopAndAbove } from '@core/style/mediaQuery';
import { hideScrollbar } from '@core/style/utils';

const ScrollableContent = styled.div<{
  itemToDisplay: number;
  withMask?: boolean;
  overhang?: boolean;
}>`
  --mask-size: calc(5 * var(--unit));
  --item-gap: var(--double-unit);

  display: flex;
  overflow: auto;
  scroll-snap-type: x mandatory;
  gap: var(--item-gap);
  padding: 0 100vw;
  margin: 0 -100vw;
  ${hideScrollbar};
  ${({ overhang }) =>
    overhang &&
    css`
      --item-wrapper-width: calc(100% - var(--double-unit));
    `}
  @media ${laptopAndAbove} {
    --item-wrapper-width: ${({ itemToDisplay }) =>
      itemToDisplay > 1
        ? `calc((100% - var(--item-gap) * ${
            itemToDisplay - 1
          }) / ${itemToDisplay})`
        : '100%'};
  }

  @media ${desktopAndAbove} {
    &.withMask {
      padding-inline: var(--mask-size);
      scroll-padding-inline: var(--mask-size);
      margin-inline: calc(-1 * var(--mask-size));
      mask-image: linear-gradient(
        to right,
        transparent,
        white var(--mask-size),
        white calc(100% - var(--mask-size)),
        transparent
      );
    }
  }
`;
const ItemWrapper = styled.div`
  scroll-snap-align: center;
  min-width: var(--item-wrapper-width, 100%);
  max-width: var(--item-wrapper-width, 100%);

  &:empty {
    display: none;
  }
`;
const ScrollButtonWrapper = styled.div`
  display: none;
  @media (hover: hover) {
    position: absolute;
    inset: 0 calc(-1 * var(--double-unit));
    display: flex;
    justify-content: space-between;
    align-items: center;
    visibility: hidden;
    pointer-events: none;
    z-index: 2;
    > * {
      pointer-events: auto;
      &[disabled] {
        visibility: hidden;
      }
    }
    &.contained {
      inset: 0 var(--unit);
    }
  }
`;
const Root = styled.div`
  position: relative;
  width: 100%;
  &:hover,
  &:focus-within {
    ${ScrollButtonWrapper} {
      visibility: visible;
    }
  }
`;

type Props = {
  children: ReactNode;
  itemToDisplay: number;
  withMask?: boolean;
  className?: string;
  onVisibleItemsChanged?: (items: number[]) => void;
  contained?: boolean;
  /**
   * In a mobile viewport when there are multiple items to display, show a
   * partial edge of the next offscreen item to indicate to the user that
   * there are more items to scroll to (since no arrow buttons shown in mobile).
   */
  overhang?: boolean;
  indexToScroll?: number;
};

const Scrollable = ({
  children,
  withMask,
  className,
  itemToDisplay,
  onVisibleItemsChanged,
  contained,
  overhang,
  indexToScroll,
}: Props) => {
  const numberOfItems = Children.toArray(children).length;
  const { containerRef, isOverflowing } = useIsOverflowing(numberOfItems);
  const [visibleIndexes, setVisibleIndexes] = useState(range(itemToDisplay));
  const { scrollPosition } = useScrollPosition(containerRef.current);

  const detectVisibleIndexes: UIEventHandler<HTMLDivElement> = e => {
    const { scrollLeft, children: child } = e.target as HTMLDivElement;
    const itemWidth = child[0].clientWidth;
    const firstVisibleItem = Math.floor(scrollLeft / itemWidth);

    setVisibleIndexes(
      range(itemToDisplay).map(i =>
        Math.min(firstVisibleItem + i, Children.count(children) - 1)
      )
    );
  };

  useScrollToIndex(indexToScroll, containerRef.current);
  useDebounce(() => onVisibleItemsChanged?.(visibleIndexes), 30, [
    visibleIndexes,
  ]);

  return (
    <Root>
      <ScrollableContent
        itemToDisplay={itemToDisplay}
        ref={containerRef}
        onScroll={onVisibleItemsChanged && detectVisibleIndexes}
        role="navigation"
        className={classnames(className, { withMask })}
        overhang={overhang && numberOfItems > 1}
      >
        {Children.toArray(children).map((child, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ItemWrapper key={index}>{child}</ItemWrapper>
        ))}
      </ScrollableContent>
      {isOverflowing && (
        <ScrollButtonWrapper className={classnames({ contained })}>
          <IconButton
            icon={faChevronLeft}
            color="white"
            small
            disabled={scrollPosition === 'start'}
            disableDebounce
            onClick={() => {
              containerRef.current?.scrollBy({
                left: -10,
                behavior: 'smooth',
              });
            }}
          />
          <IconButton
            icon={faChevronRight}
            color="white"
            small
            disabled={scrollPosition === 'end'}
            disableDebounce
            onClick={() => {
              containerRef.current?.scrollBy({
                left: 10,
                behavior: 'smooth',
              });
            }}
          />
        </ScrollButtonWrapper>
      )}
    </Root>
  );
};

export default Scrollable;
