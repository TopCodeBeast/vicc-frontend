import { faAngleLeft, faAngleRight } from '@fortawesome/pro-solid-svg-icons';
import { ElementType, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useKey, usePrevious } from 'react-use';
import styled from 'styled-components';

import { Revealer } from '@core/atoms/animations/Revealer';
import IconButton from '@core/atoms/buttons/IconButton';
import { Carousel } from '@core/components/Carousel';
import { useToggleArray } from '@core/hooks/useToggleArray';
import { range } from '@core/lib/arrays';
import { glossary } from '@core/lib/glossary';
import { tabletAndAbove } from '@core/style/mediaQuery';

const CarouselNavigation = styled.div`
  display: flex;
  align-items: center;
  isolation: isolate;
  justify-content: space-between;
  width: min(400px, 100vw);
`;

const NavigationButton = styled(IconButton)`
  z-index: 1;
  box-shadow: 0 0 var(--unit) rgba(0, 0, 0, 0.5) !important;
`;
const CarouselWrapper = styled.div`
  z-index: 0;
`;

const RevealerWrapped = styled(Revealer)`
  width: 160px;
  @media ${tabletAndAbove} {
    width: 200px;
  }
`;

export interface SelectableCardBackProps {
  isSelected?: boolean;
}

export interface CardFrontProps {
  card: any;
}

export interface CTAProps {
  allCardsRevealed: boolean;
  toggleRevealAll: () => void;
}

type Props = {
  cards: any[];
  CardBack: ElementType<SelectableCardBackProps>;
  CardFront: ElementType<CardFrontProps>;
  CTA: ElementType<CTAProps>;
  pickedCardIndex: number;
  onAllCardsRevealed: () => void;
};

export const ClaimAllCardsCarousel = ({
  cards,
  CardBack,
  CardFront,
  CTA,
  pickedCardIndex,
  onAllCardsRevealed,
}: Props) => {
  const { formatMessage } = useIntl();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cardsRevealed, setCardsRevealed] = useState<boolean[]>([]);
  const previousSelectedIndex = usePrevious(selectedIndex);
  const toggleRevealAll = useToggleArray(setCardsRevealed);
  const nbCards = cards.length;

  useEffect(() => {
    const newCardsRevealed = range(cards.length).map(() => false);
    if (pickedCardIndex >= 0) {
      newCardsRevealed[0] = true;
    }
    setCardsRevealed(newCardsRevealed);
  }, [setCardsRevealed, cards, pickedCardIndex]);

  const safeSetSelectedIndex = useCallback(
    (newIndex: number) => {
      setSelectedIndex(Math.max(0, Math.min(nbCards - 1, newIndex)));
    },
    [setSelectedIndex, nbCards]
  );

  useEffect(() => {
    if (previousSelectedIndex !== selectedIndex) {
      setCardsRevealed(x => {
        x[selectedIndex] = true;
        return [...x];
      });
    }
  }, [previousSelectedIndex, selectedIndex]);

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

  const allCardsRevealed =
    cardsRevealed.length !== 0 && !cardsRevealed.some(x => !x);
  useEffect(() => {
    if (allCardsRevealed) {
      onAllCardsRevealed();
    }
  }, [allCardsRevealed, onAllCardsRevealed]);
  return (
    <>
      <CarouselNavigation>
        <NavigationButton
          disableDebounce
          color="white"
          disabled={selectedIndex === 0}
          onClick={() => safeSetSelectedIndex(selectedIndex - 1)}
          title={formatMessage(glossary.previous)}
          icon={faAngleLeft}
        />
        <CarouselWrapper>
          <Carousel
            elements={cards}
            selectedIndex={selectedIndex}
            setSelectedIndex={number =>
              setSelectedIndex(Math.max(0, Math.min(cards.length, number)))
            }
            onClick={(_, index) => {
              if (index === selectedIndex) {
                setCardsRevealed(x => {
                  x[index] = true;
                  return [...x];
                });
              } else {
                setSelectedIndex(index);
              }
            }}
            renderElement={(card, index) => {
              return (
                <RevealerWrapped
                  front={<CardFront card={card} />}
                  back={<CardBack isSelected={selectedIndex === index} />}
                  revealed={cardsRevealed[index]}
                />
              );
            }}
          />
        </CarouselWrapper>
        <NavigationButton
          disableDebounce
          color="white"
          disabled={selectedIndex === nbCards - 1}
          onClick={() => safeSetSelectedIndex(selectedIndex + 1)}
          title={formatMessage(glossary.next)}
          icon={faAngleRight}
        />
      </CarouselNavigation>
      <CTA
        allCardsRevealed={allCardsRevealed}
        toggleRevealAll={() =>
          toggleRevealAll(new Array(cardsRevealed.length).fill(true))
        }
      />
    </>
  );
};
