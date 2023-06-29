import { gql } from '@apollo/client';
import { useMemo } from 'react';

import { useReferralReward_referralReward } from './__generated__/useReferralReward.graphql';
import { useClaimReferralReward } from './referral/useClaimReferralReward';

export const useReferralReward = (
  reward: useReferralReward_referralReward | null
) => {
  const claim = useClaimReferralReward(reward);

  const claimed = false;

  const cardBack = useMemo(() => {
    return <>cardBack</>;
  }, []);

  const teasers = useMemo(() => {
    return [<>teasers</>];
  }, []);

  return {
    claim,
    claimed,
    usSportsReferralRewards: null,
    cardBack,
    teasers,
  };
};
