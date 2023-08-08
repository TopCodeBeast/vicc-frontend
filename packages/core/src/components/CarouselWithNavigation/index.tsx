import { faAngleLeft, faAngleRight } from '@fortawesome/pro-solid-svg-icons';
import React, { ReactNode, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useKey } from 'react-use';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { Carousel } from '@core/components/Carousel';
import { glossary } from '@core/lib/glossary';

const CarouselNavigation = styled.div`
  display: flex;
  align-items: center;
  isolation: isolate;
  justify-content: space-between;
`;

const NavigationButton = styled(IconButton)`
  z-index: 1;
  border: 1px solid var(--c-static-neutral-1000) !important;
`;

const CarouselWrapper = styled.div`
  z-index: 0;
`;

type Props<T> = {
  elements: T[];
  renderElement: (element: T, index: number) => ReactNode;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onClick: (element: T, index: number) => void;
};

export const CarouselWithNavigation = <T,>({
  elements,
  renderElement,
  selectedIndex,
  setSelectedIndex,
  onClick,
}: Props<T>) => {
  const { formatMessage } = useIntl();

  const nbElements = elements.length;

  const safeSetSelectedIndex = useCallback(
    (newIndex: number) => {
      setSelectedIndex(Math.max(0, Math.min(nbElements - 1, newIndex)));
    },
    [setSelectedIndex, nbElements]
  );

  useKey(
    'ArrowLeft',
    () => safeSetSelectedIndex(selectedIndex - 1),
    undefined,
    [safeSetSelectedIndex, selectedIndex]
  );
  useKey(
    'ArrowRight',
    () => safeSetSelectedIndex(selectedIndex + 1),
    undefined,
    [safeSetSelectedIndex, selectedIndex]
  );

  return (
    <CarouselNavigation>
      {selectedIndex > 0 && (
        <NavigationButton
          disableDebounce
          color="white"
          onClick={() => safeSetSelectedIndex(selectedIndex - 1)}
          title={formatMessage(glossary.previous)}
          icon={faAngleLeft}
          aria-label={formatMessage(glossary.previous)}
        />
      )}
      <CarouselWrapper>
        <Carousel
          elements={elements}
          onClick={onClick}
          selectedIndex={selectedIndex}
          setSelectedIndex={(index: number) => safeSetSelectedIndex(index)}
          renderElement={renderElement}
        />
      </CarouselWrapper>
      {selectedIndex < nbElements - 1 && (
        <NavigationButton
          disableDebounce
          color="white"
          onClick={() => safeSetSelectedIndex(selectedIndex + 1)}
          title={formatMessage(glossary.next)}
          icon={faAngleRight}
          aria-label={formatMessage(glossary.next)}
        />
      )}
    </CarouselNavigation>
  );
};
