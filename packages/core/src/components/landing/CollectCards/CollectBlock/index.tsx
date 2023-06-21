import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { animated, config, useSpring } from '@react-spring/web';
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components';

import { useIntlContext } from '@core/contexts/intl';
import { theme } from '@core/style/theme';

import { SectionText } from '../SectionText';
import commonCard from './assets/common.png';
import limitedCard from './assets/limited.png';
import commonCardNBA from './assets/nba/common.png';
import limitedCardNBA from './assets/nba/limited.png';
import rareCardNBA from './assets/nba/rare.png';
import superRareCardNBA from './assets/nba/super-rare.png';
import uniqueCardNBA from './assets/nba/unique.png';
import rareCard from './assets/rare.png';
import superRareCard from './assets/super-rare.png';
import uniqueCard from './assets/unique.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  padding: calc(7 * var(--unit)) calc(3 * var(--unit));
  row-gap: calc(7 * var(--unit));
  column-gap: calc(10 * var(--unit));
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    column-gap: calc(21 * var(--unit));
  }
`;

const CardBackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 3 1 0;
  & > *:nth-child(odd) {
    margin-top: calc(3 * var(--unit));
  }
  gap: var(--unit);
  filter: drop-shadow(0 var(--half-unit) var(--unit) rgba(0, 0, 0, 0.5));
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    filter: drop-shadow(0 var(--unit) var(--double-unit) rgba(0, 0, 0, 0.5));
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    min-width: 300px;
    gap: var(--unit);
    justify-content: initial;
    & > *:nth-child(odd) {
      margin-top: 40px;
    }
  }
`;

const Img = styled(animated.img)`
  aspect-ratio: var(--card-aspect-ratio);
  max-width: 100%;
  min-width: 0;
`;

type AnimatedImgProps = {
  src: string;
  visible: boolean;
  fromX: number;
};
const AnimatedImg = ({ src, visible, fromX }: AnimatedImgProps) => {
  const fromDef = { x: fromX, y: 100 };
  const toDef = { x: 0, y: 0 };
  const animation = useSpring({
    from: fromDef,
    to: toDef,
    config: config.slow,
    pause: !visible,
  });
  return <Img style={animation} src={src} alt="" />;
};

const Illustration = ({ cards }: { cards: string[] }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Waypoint onEnter={() => setVisible(true)}>
      <CardBackContainer>
        <>
          {cards.map((card, index) => (
            <AnimatedImg
              key={card}
              src={card}
              visible={visible}
              fromX={-1 * (1000 + index * 100)}
            />
          ))}
        </>
      </CardBackContainer>
    </Waypoint>
  );
};

export const CollectBlock = () => (
  <Wrapper>
    <Illustration
      cards={[commonCard, limitedCard, rareCard, superRareCard, uniqueCard]}
    />
    <SectionText
      heading={
        <FormattedMessage
          id="Landing.CollectCards.CollectBlock.heading"
          defaultMessage="Build{br}Your Squad"
          values={{
            br: <br />,
          }}
        />
      }
      subHeading={
        <FormattedMessage
          id="Landing.CollectCards.CollectBlock.subHeading"
          defaultMessage="Collect, buy, sell, and trade officially licensed digital player cards in Sorare’s Marketplace
          to build your ultimate fantasy team. There are no sign-up costs."
        />
      }
    />
  </Wrapper>
);

export const CollectBlockNBA = () => {
  const { formatMessage } = useIntlContext();

  return (
    <Wrapper>
      <Illustration
        cards={[
          commonCardNBA,
          limitedCardNBA,
          rareCardNBA,
          superRareCardNBA,
          uniqueCardNBA,
        ]}
      />
      <SectionText
        heading={formatMessage({
          id: 'nbaLanding.CollectCards.lineOne',
          defaultMessage: 'Keep it official',
        })}
        subHeading={formatMessage({
          id: 'nbaLanding.CollectCards.collectText',
          defaultMessage:
            'Use your knowledge to scout, buy and trade digital player Cards in the only officially licensed NFT Fantasy NBA Game.',
        })}
      />
    </Wrapper>
  );
};
