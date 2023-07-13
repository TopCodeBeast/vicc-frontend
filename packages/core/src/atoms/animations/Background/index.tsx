import { memo, useRef, useState } from 'react';
import { Globals, SpringValue, animated, useSprings } from '@react-spring/web';
import styled from 'styled-components';

import { proxyUrl } from '@core/atoms/ui/ResponsiveImg';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { range } from '@core/lib/arrays';
import { CARD_ASPECT_RATIO } from '@core/lib/cards';

import { MobileBackground } from './mobile';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  perspective: 1000px;
  background-size: contain;
  background-position: right center;
  height: 600px;
`;

const Columns = styled.div`
  transform-style: preserve-3d;
  transform: translateX(-100px) rotateX(5deg) rotateZ(-10deg);
  display: flex;
  justify-content: center;
  gap: calc(10 * var(--unit));
`;

const ColumnContainer = styled.div`
  width: 200px;
  position: relative;
  transform-style: preserve-3d;
  flex: none;
`;

const SlotWrapper = styled(animated.div)`
  position: absolute;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  width: 100%;
  aspect-ratio: var(--card-aspect-ratio);
`;

const Side = styled.div`
  mask-size: cover;
  backface-visibility: hidden;
  position: absolute;
  inset: 0;
  overflow: hidden;
  &:nth-child(2) {
    transform: rotateY(180deg);
  }
`;

const Img = styled.img`
  width: 100%;
`;

type ThreeFaces = [string, string, string];

type SlotProps = {
  card: ThreeFaces;
  iteration: number;
  style: Record<string, SpringValue<any>>;
};

const Slot = ({ card, iteration, style }: SlotProps) => {
  const [faceA, faceB, faceC] = card;

  const [front, back] = [
    [faceA, faceB],
    [faceC, faceB],
    [faceC, faceA],
    [faceB, faceA],
    [faceB, faceC],
    [faceA, faceC],
  ][iteration % 6];

  return (
    <SlotWrapper style={style}>
      <Side>
        <Img src={front} alt="" />
      </Side>
      <Side>
        <Img src={back} alt="" />
      </Side>
    </SlotWrapper>
  );
};

const DURATION = 6000;
const NB_SLOTS = 4;
const Column = ({
  cards,
  downward = false,
}: {
  cards: ThreeFaces[];
  downward: boolean;
}) => {
  const cardHeight = 200 / CARD_ASPECT_RATIO;
  const [cardForSlot, setCardForSlot] = useState<
    [ThreeFaces, ThreeFaces, ThreeFaces, ThreeFaces]
  >([cards[3], cards[2], cards[1], cards[0]]);
  const lastUsedCardSlot = useRef<number>(NB_SLOTS - 1);
  const [slideSprings] = useSprings(
    4,
    index => ({
      from: {
        y: downward ? -cardHeight - 100 : 3 * cardHeight,
      },
      to: {
        y: downward ? 3 * cardHeight : -cardHeight - 100,
      },
      config: {
        duration: 4 * DURATION,
        progress: (1 / 4) * index,
      },
      loop: !Globals.skipAnimation && { config: { progress: 0 }, reset: true },
      onRest: () => {
        if (!Globals.skipAnimation) {
          // show next cards
          setCardForSlot(arr => {
            const copy: [ThreeFaces, ThreeFaces, ThreeFaces, ThreeFaces] = [
              ...arr,
            ];
            lastUsedCardSlot.current =
              (lastUsedCardSlot.current + 1) % cards.length;
            copy[index] = cards[lastUsedCardSlot.current];
            return copy;
          });
        }
      },
    }),
    [cardHeight]
  );
  const loops = useRef([0, 0, 0, 0]);
  const [nbSpins, setNbSpins] = useState([0, 0, 0, 0]);
  const [rotateSprings] = useSprings(
    4,
    index => ({
      from: {
        rotateY: 0,
      },
      to: {
        rotateY: 180,
      },
      config: {
        duration: DURATION / 2,
        progress: [0, 0.05, 0.1, 0.15][index],
      },
      loop:
        !Globals.skipAnimation &&
        (() => {
          loops.current[index] += 1;
          const loop = loops.current[index];
          setNbSpins(arr => {
            const copy = [...arr];
            copy[index] += 1;
            return copy;
          });
          return {
            from: {
              rotateY: (loop % 2) * 180 + 0,
            },
            to: {
              rotateY: (loop % 2) * 180 + 180,
            },
            config: { progress: 0 },
            reset: true,
          };
        }),
    }),
    [setNbSpins]
  );

  return (
    <ColumnContainer>
      {range(NB_SLOTS).map(index => (
        <Slot
          key={index}
          card={cardForSlot[index]}
          iteration={nbSpins[index]}
          style={{ ...slideSprings[index], ...rotateSprings[index] }}
        />
      ))}
    </ColumnContainer>
  );
};

type Props = {
  multiFacedCardsUrlsColumns: ThreeFaces[][];
  className?: string;
};

const Animation = ({ multiFacedCardsUrlsColumns, className }: Props) => {
  const { up: isDesktop } = useScreenSize('desktop');
  if (!isDesktop) {
    return (
      <MobileBackground
        multiFacedCardsUrlsColumns={multiFacedCardsUrlsColumns}
        className={className}
      />
    );
  }

  return (
    <Wrapper className={className}>
      <Columns>
        {multiFacedCardsUrlsColumns.map((columnCards, index) => (
          <Column
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            cards={columnCards}
            downward={index % 2 === 0}
          />
        ))}
      </Columns>
    </Wrapper>
  );
};

export const BackgroundAnimation = memo(
  ({
    cardsA,
    cardsB,
    cardsC,
    nbColumns = 5,
    nbCardsPerColumns = 7,
    className,
  }: {
    cardsA: string[];
    cardsB: string[];
    cardsC: string[];
    nbColumns?: number;
    nbCardsPerColumns?: number;
    className?: string;
  }) => {
    return (
      <Animation
        className={className}
        multiFacedCardsUrlsColumns={range(nbColumns).map(colIndex =>
          range(nbCardsPerColumns).map(cardIndex => [
            cardsA.map(url => proxyUrl(url, { cropWidth: 160, dpis: 1 }))[
              (colIndex * nbCardsPerColumns + cardIndex) % cardsA.length
            ],
            cardsB.map(url => proxyUrl(url, { cropWidth: 160, dpis: 1 }))[
              (colIndex * nbCardsPerColumns + cardIndex) % cardsB.length
            ],
            cardsC.map(url => proxyUrl(url, { cropWidth: 160, dpis: 1 }))[
              (colIndex * nbCardsPerColumns + cardIndex) % cardsC.length
            ],
          ])
        )}
      />
    );
  }
);
BackgroundAnimation.displayName = 'BackgroundAnimation';
