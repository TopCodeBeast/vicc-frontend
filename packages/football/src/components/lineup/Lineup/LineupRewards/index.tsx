import { TypedDocumentNode, gql } from '@apollo/client';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import { caption } from '@sorare/core/src/atoms/typography';
import useIsOverflowing from '@sorare/core/src/hooks/ui/useIsOverflowing';
import { hasEligibleRewards, hasRewards } from '@sorare/core/src/lib/rewards';
import { Link } from '@sorare/core/src/routing/Link';
import { hideScrollbar } from '@sorare/core/src/style/utils';

import ActualRewards from '@football/components/lineup/ActualRewards';
import { EligibleRewards } from '@football/components/lineup/EligibleRewards';
import { Rewards } from '@football/components/lineup/Rewards';
import { RewardType } from '@football/lib/lineupRewards';

import {
  LineupRewards_rewardsOverview,
  LineupRewards_vicc5Ranking,
} from './__generated__/index.graphql';

const Wrapper = styled(LinkOther)`
  display: flex;
  position: relative;
  padding: 0 var(--intermediate-unit);
  align-items: center;
  height: 32px;
  border-top: 1px solid var(--c-neutral-300);
  color: var(--c-neutral-600);
  &.empty {
    justify-content: center;
  }
  &:focus,
  &:hover {
    color: var(--c-neutral-600);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  overflow: auto;
  ${hideScrollbar}
  ${caption}
`;

const EligibleRewardsList = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const OverflowIcon = styled.div`
  background: linear-gradient(
    270deg,
    var(--c-neutral-200) 0%,
    var(--c-neutral-200) 54.55%,
    rgba(34, 36, 43, 0) 100%
  );
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 var(--intermediate-unit) 0 var(--quadruple-unit);
  border-bottom-right-radius: var(--unit);
`;

const RewardLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  padding-right: var(--unit);
  border-right: 1px solid var(--c-neutral-300);
`;

type Props = {
  rewardType: RewardType;
  rankingRewards?: LineupRewards_vicc5Ranking;
  totalRewards: LineupRewards_rewardsOverview;
  linkToCompetitionDetails: string;
};
export const LineupRewards = ({
  rewardType,
  rankingRewards,
  totalRewards,
  linkToCompetitionDetails,
}: Props) => {
  const { isOverflowing, containerRef } = useIsOverflowing();
  const { eligibleRewards, vicc5Rewards } = rankingRewards || {};
  const withEligibleRewards = !!eligibleRewards?.find(eligibleReward =>
    hasEligibleRewards(eligibleReward)
  );

  const displayEligibleRewards = () => {
    if (!withEligibleRewards) {
      return (
        <FormattedMessage
          id="LineupRewards.NoEligibleRewards"
          defaultMessage="No Projected Rewards"
        />
      );
    }
    return (
      <>
        <RewardLabel>
          <FormattedMessage
            id="LineupRewards.ProjectedReward"
            defaultMessage="Projected Reward"
          />
        </RewardLabel>
        <EligibleRewardsList>
          {(eligibleRewards || []).map(eligibleReward => (
            <EligibleRewards
              key={`${eligibleReward.ethAmount}-${eligibleReward.usdAmount}-${
                (eligibleReward.cards || []).length
              }-${(eligibleReward.experiences || []).length}`}
              rewards={eligibleReward}
            />
          ))}
        </EligibleRewardsList>
      </>
    );
  };

  const displayActualRewards = () => {
    if (!vicc5Rewards?.length) {
      return (
        <FormattedMessage
          id="LineupRewards.NoRealRewards"
          defaultMessage="No Rewards"
        />
      );
    }
    return (
      <>
        <RewardLabel>
          <FormattedMessage
            id="LineupRewards.Rewards"
            defaultMessage="Rewards"
          />
        </RewardLabel>
        <ActualRewards rewards={vicc5Rewards} />
      </>
    );
  };

  const displayGenericRewards = () =>
    hasRewards(totalRewards) ? (
      <>
        <RewardLabel>
          <FormattedMessage
            id="LineupRewards.PrizePool"
            defaultMessage="Prize Pool"
          />
        </RewardLabel>
        <Rewards rewards={totalRewards} />
      </>
    ) : null;

  return (
    <Wrapper
      as={Link}
      to={linkToCompetitionDetails}
      className={classNames({
        empty:
          (rewardType === RewardType.Eligible && !withEligibleRewards) ||
          (rewardType === RewardType.Actual && !vicc5Rewards?.length) ||
          (rewardType === RewardType.Generic && !hasRewards(totalRewards)),
      })}
    >
      <ContentWrapper ref={containerRef}>
        {rewardType === RewardType.Generic && displayGenericRewards()}
        {rewardType === RewardType.Eligible && displayEligibleRewards()}
        {rewardType === RewardType.Actual && displayActualRewards()}
      </ContentWrapper>
      {isOverflowing && (
        <OverflowIcon>
          <FontAwesomeIcon icon={faPlus} size="sm" />
        </OverflowIcon>
      )}
    </Wrapper>
  );
};

LineupRewards.fragments = {
  vicc5Ranking: gql`
    fragment LineupRewards_vicc5Ranking on Vicc5Ranking {
      id
      eligibleRewards {
        ...EligibleRewards_rewardConfig
        ...hasEligibleRewards_vicc5RewardConfig
      }
      vicc5Rewards {
        slug
        ...ActualRewards_vicc5Reward
      }
    }
    ${EligibleRewards.fragments.rewardConfig}
    ${hasEligibleRewards.fragments.rewardConfig}
    ${ActualRewards.fragments.vicc5Reward}
  ` as TypedDocumentNode<LineupRewards_vicc5Ranking>,
  rewardsOverview: gql`
    fragment LineupRewards_rewardsOverview on RewardsOverview {
      ...Rewards_rewardsOverview
      ...hasRewards_rewardsOverview
    }
    ${Rewards.fragments.reward}
    ${hasRewards.fragments.rewards}
  ` as TypedDocumentNode<LineupRewards_rewardsOverview>,
};
