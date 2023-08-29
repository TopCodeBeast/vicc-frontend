import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, useIntl } from 'react-intl';
import { animated } from '@react-spring/web';
import styled, { keyframes } from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import Gauge from '@sorare/core/src/atoms/ui/GaugeV2';

import { CardLevelPreview_card } from './__generated__/index.graphql';
import useCardLevelSprings from './useCardLevelSprings';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const GaugeContainer = styled.div`
  position: relative;
`;
const plusOneLevel = keyframes`
  0% {
    bottom: -10px;
    opacity: 0;
    transform: scale(1);
  }
  20% {
    bottom: -20px;
    opacity: 1;
    transform: scale(1.3);
  }
  80% {
    opacity: 1;
    transform: scale(1.3);
  }
  100% {
    bottom: -20px;
    opacity: 0;
    transform: scale(1);

  }
`;
const CompleteLevel = styled.div`
  position: absolute;
  right: 0;
  animation: ${plusOneLevel} 2s ease-out forwards;
`;

type Props = {
  card: CardLevelPreview_card;
};
const CardLevelPreview = ({ card }: Props) => {
  const { formatNumber } = useIntl();
  const { xpNeededForNextGrade } = card;
  const { grade, xp, size, nextlevelXP } = useCardLevelSprings(card as any); //TODO

  const leveling = size.get() === '100%';

  return (
    <Root>
      <Row>
        <div>
          <Caption bold>
            <FormattedMessage
              id="Title.level"
              defaultMessage="Level <animatedText></animatedText>"
              values={{
                animatedText: () => (
                  <animated.span>
                    {grade.to(n => formatNumber(Math.floor(n)))}
                  </animated.span>
                ),
              }}
            />
          </Caption>
        </div>
        {xpNeededForNextGrade && (
          <Caption>
            <FormattedMessage
              id="Title.xpNeeded"
              defaultMessage="<animatedText></animatedText> / {nextlevelXP, number} XP"
              values={{
                animatedText: () => (
                  <animated.span>
                    {xp.to(n => formatNumber(Math.floor(n)))}
                  </animated.span>
                ),
                nextlevelXP,
              }}
            />
          </Caption>
        )}
      </Row>
      <GaugeContainer>
        <Gauge percentage={size} />
        {leveling && (
          <CompleteLevel>
            <Caption bold color="var(--c-green-600)">
              +1
            </Caption>
          </CompleteLevel>
        )}
      </GaugeContainer>
    </Root>
  );
};

CardLevelPreview.fragments = {
  card: gql`
    fragment CardLevelPreview_card on Card {
      assetId
      slug
      grade
      xpNeededForCurrentGrade
      xpNeededForNextGrade
      xp
    }
  ` as TypedDocumentNode<CardLevelPreview_card>,
};

export default CardLevelPreview;
