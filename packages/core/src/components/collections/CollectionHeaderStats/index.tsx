import classnames from 'classnames';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Skeleton } from '@core/atoms/animations/Skeleton';
import { Caption } from '@core/atoms/typography';
import { Bonus } from '@core/components/collections/Bonus';
import { CardsNumber } from '@core/components/collections/CardsNumber';
import { ProgressBar } from '@core/components/collections/ProgressBar';
import { Ranking } from '@core/components/collections/Ranking';
import { Score } from '@core/components/collections/Score';
import { CollectionsTeamShield } from '@core/lib/collections';
import { fantasy, glossary } from '@core/lib/glossary';
import { laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--triple-unit);
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  @media ${tabletAndAbove} {
    gap: calc(8 * var(--unit));
    &.noBonus {
      justify-content: flex-start;
    }
  }
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
`;

const ProgressBarWrapper = styled.div`
  min-width: 100%;
  @media ${laptopAndAbove} {
    flex-grow: 1;
    min-width: 0;
  }
`;

const Label = styled(Caption)`
  color: var(--c-static-neutral-600);
  font-weight: var(--t-bold);
`;

const SkeletonName = styled(Skeleton)`
  --skeleton-highlight: rgba(var(--c-static-rgb-neutral-100), 0.1);
  background-color: rgba(var(--c-rgb-neutral-100), 0.1);
  width: calc(5 * var(--unit));
  height: var(--triple-unit);
`;

type SkeletonWrapperProps = {
  children: ReactNode;
  loading?: boolean;
};

const SkeletonWrapper = ({ children, loading }: SkeletonWrapperProps) => {
  if (loading) return <SkeletonName />;
  return <>{children}</>;
};

type HeaderStatsProps = {
  slotsCount: number;
  fulfilledSlotsCount?: number;
  liveRanking?: number;
  score?: number;
  bonus?: number;
  teamShield?: CollectionsTeamShield;
  showRanking?: boolean;
  showBonus?: boolean;
  loading?: boolean;
};

export const CollectionHeaderStats = ({
  slotsCount,
  fulfilledSlotsCount = 0,
  liveRanking = 0,
  score = 0,
  bonus = 0,
  teamShield,
  showRanking,
  showBonus,
  loading,
}: HeaderStatsProps) => {
  return (
    <Stats className={classnames({ noBonus: !showBonus })}>
      <StatBox>
        <Label>
          <FormattedMessage {...glossary.cards} />
        </Label>
        <SkeletonWrapper loading={loading}>
          <CardsNumber
            ownedCards={fulfilledSlotsCount}
            totalCards={slotsCount}
          />
        </SkeletonWrapper>
      </StatBox>
      {showRanking && (
        <StatBox>
          <Label>
            <FormattedMessage {...fantasy.rank} />
          </Label>
          <SkeletonWrapper loading={loading}>
            <Ranking liveRanking={liveRanking} />
          </SkeletonWrapper>
        </StatBox>
      )}
      <StatBox>
        <Label>
          <FormattedMessage {...fantasy.score} />
        </Label>
        <SkeletonWrapper loading={loading}>
          <Score score={score} />
        </SkeletonWrapper>
      </StatBox>
      {showBonus && (
        <>
          <StatBox>
            <Label>
              <FormattedMessage {...fantasy.bonus} />
            </Label>
            <SkeletonWrapper loading={loading}>
              <Bonus bonus={bonus} />
            </SkeletonWrapper>
          </StatBox>
          <ProgressBarWrapper>
            <ProgressBar score={score} teamShield={teamShield} />
          </ProgressBarWrapper>
        </>
      )}
    </Stats>
  );
};
