import { useState } from 'react';
import { animated, config, useSpring } from '@react-spring/web';
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components';

import { tabletAndAbove } from '@core/style/mediaQuery';

import BG from './assets/BG.png';
import PlayNowButton from '../PlayNowButton';
import { FormattedMessage } from 'react-intl';
import { SectionFullText } from '../CollectCards/SectionFullText';

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
  @media ${tabletAndAbove} {
    padding: calc(6 * var(--unit)) var(--double-unit);
  }
`;

const PlayerCardImg = styled.img`
  max-width: 100%;
  min-width: 0;
  height: 0px;
  aspect-ratio: var(--card-aspect-ratio);
  filter: drop-shadow(0 var(--unit) var(--double-unit) rgba(0, 0, 0, 1));
  position: relative;
  z-index: 1;
  flex: 1;
  @media ${tabletAndAbove} {
    height: 300px;
  }
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
  return <PlayerCardImg src={card} className={className} />
};

const PlayerCardAbove = styled.div`
  z-index: 2;
  margin: 0 -314px;
  max-width: 100%;
  min-width: 0;
  height: 172px;
  background: url("assets/fields/eth.png");
  background-size: cover; 
  background-repeat: no-repeat;
  aspect-ratio: var(--card-aspect-ratio);
  filter: drop-shadow(0 var(--unit) var(--double-unit) rgba(0, 0, 0, 1));
  position: relative;
  flex: 1;
  @media ${tabletAndAbove} {
    height: 320px;
  }
`;

const AnimationTrigger = styled.div`
  position: absolute;
  top: 30%;
`;

const CopyAndLanguage = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--double-unit) 0;
  bottom: 0px;
  position: absolute;
  width: 100%;
  padding-left: 1em;
  padding-right: 1em;
  @media ${tabletAndAbove} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const CaptionContainer = styled.div`
  color: white;
`;

type Props = {
  cards: string[];
  mirror?: boolean;
};

const EpicCards = ({ cards, mirror = false }: Props) => {
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
    
      <PlayerCardAbove>
        <CopyAndLanguage>
          <CaptionContainer>
            <FormattedMessage
              id="Landing.CollectCards.WinBlock.subheading"
              defaultMessage="Money rewards{br}available"
              values={{
                br: <br />,
              }}
            />
          </CaptionContainer>
          <PlayNowButton
            style={{color:'white', 
                    background:'grey',
                    paddingLeft: '2em',
                    paddingRight: '2em'}}>
            <FormattedMessage
              id="OwnYourGame.cta"
              defaultMessage="Learn more"
            />
          </PlayNowButton>
        </CopyAndLanguage>
      </PlayerCardAbove>

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

export default EpicCards;
