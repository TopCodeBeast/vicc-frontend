import classnames from 'classnames';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import { Skeleton } from '@sorare/core/src/atoms/animations/Skeleton';
import { Caption } from '@sorare/core/src/atoms/typography';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { cardRatio } from '@sorare/core/src/lib/cardPicture';

import { positionShortNames } from '@football/lib/so5';

import footballField from './footballField.svg';

const Gradient = styled.div`
  background: linear-gradient(
      180deg,
      rgba(var(--c-rgb-neutral-100), 0.8) 0%,
      var(--c-neutral-200) 375px
    ),
    var(--c-gradient-limited);
  padding: var(--quadruple-unit) 0 var(--double-unit);
  display: flex;
  justify-content: center;
  position: relative;
`;
const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  .bigger & {
    gap: var(--double-unit);
  }
`;

const FootballField = styled.div`
  position: absolute;
  width: 100%;
  top: var(--double-unit);
  bottom: 0;
  background-image: url(${footballField});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  max-width: 600px;
`;
const Line = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--double-and-a-half-unit);
`;

const Card = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: var(--half-unit);
  align-items: center;
  width: 80px;
  .bigger & {
    width: 120px;
    gap: var(--unit);
  }
`;

const Wicketkeeper = styled(Card)`
  padding-top: var(--double-and-a-half-unit);
  .bigger & {
    padding-top: calc(2 * var(--quadruple-unit));
  }
`;

const ImgSkeleton = styled(Skeleton)`
  aspect-ratio: ${cardRatio};
  width: 80px;
  .bigger & {
    width: 120px;
  }
`;

type Props = {
  forwardCard?: ReactNode;
  extraCard?: ReactNode;
  defenderCard?: ReactNode;
  goalkeeperCard?: ReactNode;
  midfielderCard?: ReactNode;
  bigger?: boolean;
};

export const UninteractiveStarterBundlePreviewSkeleton = ({
  forwardCard = null,
  extraCard = null,
  defenderCard = null,
  goalkeeperCard = null,
  midfielderCard = null,
  bigger = false,
}: Props) => {
  const { up: isTablet } = useScreenSize('tablet');

  return (
    <Gradient className={classnames({ bigger: bigger && isTablet })}>
      <FootballField />
      <Cards>
        <Line>
          <Card>
            {forwardCard || <ImgSkeleton />}
            <Caption bold color="var(--c-neutral-500)">
              <FormattedMessage {...positionShortNames[Position.Bowler]} />
            </Caption>
          </Card>
          <Card>
            {extraCard || <ImgSkeleton />}
            <Caption bold color="var(--c-neutral-500)">
              <FormattedMessage {...positionShortNames['Extra Player']} />
            </Caption>
          </Card>
        </Line>
        <Line>
          <Card>
            {defenderCard || <ImgSkeleton />}
            <Caption bold color="var(--c-neutral-500)">
              <FormattedMessage {...positionShortNames[Position.Batsman]} />
            </Caption>
          </Card>
          <Wicketkeeper>
            {goalkeeperCard || <ImgSkeleton />}
            <Caption bold color="var(--c-neutral-500)">
              <FormattedMessage {...positionShortNames[Position.Wicketkeeper]} />
            </Caption>
          </Wicketkeeper>
          {/* <Card>
            {midfielderCard || <ImgSkeleton />}
            <Caption bold color="var(--c-neutral-500)">
              <FormattedMessage {...positionShortNames[Position.Fielder]} />
            </Caption>
          </Card> */}
        </Line>
      </Cards>
    </Gradient>
  );
};

export default UninteractiveStarterBundlePreviewSkeleton;
