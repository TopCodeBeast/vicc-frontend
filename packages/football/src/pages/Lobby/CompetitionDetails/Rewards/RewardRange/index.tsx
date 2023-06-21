import { ReactElement, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

import { ActionableRewardRow } from '@football/pages/Lobby/CompetitionDetails/Rewards/RewardRow';

const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  justify-content: space-between;
  align-items: flex-start;
  color: var(--c-neutral-1000);
  @media (max-width: ${theme.breakpoints.values.laptop}px) {
    flex-direction: column;
  }
`;

const Rewards = styled.div`
  background-color: var(--c-neutral-300);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  white-space: nowrap;
  overflow: hidden;
  flex-wrap: wrap;
  border-radius: ${theme.radius.md}px;
`;

const ProjectedRewardsWrapper = styled.div`
  background: var(--c-brand-600);
  border: 2px solid transparent;
  border-radius: ${theme.radius.md}px;
  width: 100%;
  & > ${Rewards} {
    background: linear-gradient(
        0deg,
        rgba(var(--c-rgb-brand-600), 0.4),
        rgba(var(--c-rgb-brand-600), 0.4)
      ),
      var(--c-neutral-300);
  }
  & ${ActionableRewardRow} {
    &:hover,
    &:focus {
      background-color: rgba(var(--c-rgb-brand-600), 0.4);
    }
  }
`;

const HighlightedTitle = styled.div`
  padding: var(--half-unit) var(--unit);
  font: var(--t-bold) var(--t-14);
`;
const Rank = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

type Props = {
  isProjectedReward?: boolean;
  projectedRewardTitle?: ReactNode;
  rewards: ReactNode;
  rank: ReactElement | null;
};
const RewardRange = ({
  isProjectedReward,
  projectedRewardTitle,
  rewards,
  rank,
}: Props) => {
  return (
    <Row>
      <Rank>{rank}</Rank>
      {isProjectedReward ? (
        <ProjectedRewardsWrapper>
          <HighlightedTitle>
            {projectedRewardTitle || (
              <FormattedMessage
                id="CompetitionDetails.Rewards.projectedRewards"
                defaultMessage="Projected Rewards"
              />
            )}
          </HighlightedTitle>
          <Rewards>{rewards}</Rewards>
        </ProjectedRewardsWrapper>
      ) : (
        <Rewards>{rewards}</Rewards>
      )}
    </Row>
  );
};

export default RewardRange;
