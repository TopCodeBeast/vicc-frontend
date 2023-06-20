import { useState } from 'react';
import { animated, config, useSpring } from 'react-spring';
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

import BG from './assets/BG.png';

const Wrapper = styled.div<{ $webGlobalCup?: boolean }>`
  background-image: url(${BG});
  background-position: center top;
  background-size: 100% 80%;
  background-repeat: no-repeat;
  isolation: isolate;
  display: flex;
  align-items: center;
  gap: var(--unit);
  padding: calc(3 * var(--unit)) calc(1 * var(--unit));
  position: relative;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: calc(6 * var(--unit)) var(--double-unit);
  }
`;

const PlayerCardImg = styled(animated.img)`
  max-width: 100%;
  min-width: 0;
  aspect-ratio: var(--card-aspect-ratio);
  filter: drop-shadow(0 var(--unit) var(--double-unit) rgba(0, 0, 0, 1));
  position: relative;
  z-index: 1;
  flex: 1;
`;

const HidingElement = styled.div`
  position: absolute;
  inset: 0;
  background-color: black;
  z-index: 3;
`;

const ROTATION_FROM = -45;
const ROTATION_TO = 0;
const DISTANCE_FAR = 1000;
const DISTANCE_CLOSE = 300;

type PlayerCardProps = {
  card: string;
  fromX: number;
  fromY: number;
  toX?: number;
  toY?: number;
  fromAngle: number;
  toAngle: number;
  fromScale?: number;
  toScale?: number;
  visible: boolean;
  className?: string;
};

const PlayerCard = ({
  card,
  fromX,
  fromY,
  toX = 0,
  toY = 0,
  fromAngle,
  toAngle,
  fromScale = 1,
  toScale = 1,
  visible,
  className,
}: PlayerCardProps) => {
  const fromDef = {
    x: fromX,
    y: fromY,
    transform: `scale(${fromScale}) rotate(${fromAngle}deg)`,
  };
  const toDef = {
    x: toX,
    y: toY,
    transform: `scale(${toScale}) rotate(${toAngle}deg)`,
  };
  const animation = useSpring({
    from: fromDef,
    to: toDef,
    config: config.slow,
    pause: !visible,
  });
  return <PlayerCardImg style={animation} src={card} className={className} />;
};

const PlayerCardAbove = styled(PlayerCard)`
  z-index: 2;
  margin: 0 -25px;
`;

const AnimationTrigger = styled.div`
  position: absolute;
  top: 30%;
`;

type Props = {
  cards: string[];
  mirror?: boolean;
};

const PlayerCardsAnimation = ({ cards, mirror = false }: Props) => {
  const getMirrorValue = (value: number): number =>
    mirror ? value * -1 : value;
  const [visible, setVisible] = useState(false);

  return (
    <Wrapper>
      <PlayerCard
        card={cards[0]}
        fromX={-DISTANCE_FAR}
        fromY={-DISTANCE_CLOSE}
        toX={0}
        fromAngle={getMirrorValue(ROTATION_FROM)}
        toAngle={getMirrorValue(ROTATION_TO)}
        visible={visible}
      />

      <PlayerCardAbove
        card={cards[1]}
        fromX={getMirrorValue(DISTANCE_CLOSE)}
        fromY={-DISTANCE_FAR / 2}
        fromAngle={getMirrorValue(-ROTATION_FROM)}
        toAngle={getMirrorValue(-ROTATION_TO)}
        toScale={1.1}
        visible={visible}
      />

      <PlayerCard
        card={cards[2]}
        fromX={DISTANCE_FAR}
        fromY={-DISTANCE_CLOSE}
        toX={-0}
        fromAngle={getMirrorValue(ROTATION_FROM)}
        toAngle={getMirrorValue(ROTATION_TO)}
        visible={visible}
      />
      <AnimationTrigger>
        <Waypoint onEnter={() => setVisible(true)} />
      </AnimationTrigger>
      {!visible && <HidingElement />}
    </Wrapper>
  );
};

export default PlayerCardsAnimation;
