import { gql } from '@apollo/client';
import styled from 'styled-components';

import { ActualReward } from './ActualReward';
import { ActualRewards_so5Reward } from './__generated__/index.graphql';

const RewardsList = styled.div`
  display: inline-flex;
  gap: var(--unit);
`;
const RewardsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  white-space: nowrap;
`;
type Props = { rewards: ActualRewards_so5Reward[] };
const ActualRewards = ({ rewards }: Props) => {
  return (
    <RewardsList>
      {rewards.length > 0 && (
        <RewardsContainer>
          {rewards?.map(reward => {
            return <ActualReward key={reward.slug} reward={reward} />;
          })}
        </RewardsContainer>
      )}
    </RewardsList>
  );
};

ActualRewards.fragments = {
  so5Reward: gql`
    fragment ActualRewards_so5Reward on Vicc5Reward {
      slug
      ...ActualReward_so5Reward
    }
    ${ActualReward.fragments.so5Reward}
  `,
};

export default ActualRewards;
