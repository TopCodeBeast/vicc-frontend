import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { ActualReward } from './ActualReward';
import { ActualRewards_vicc5Reward } from './__generated__/index.graphql';

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
type Props = { rewards: ActualRewards_vicc5Reward[] };
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
  vicc5Reward: gql`
    fragment ActualRewards_vicc5Reward on Vicc5Reward {
      slug
      ...ActualReward_vicc5Reward
    }
    ${ActualReward.fragments.vicc5Reward}
  ` as TypedDocumentNode<ActualRewards_vicc5Reward>,
};

export default ActualRewards;
