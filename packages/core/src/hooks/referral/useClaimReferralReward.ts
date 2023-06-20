import { gql } from '@apollo/client';
import { useCallback } from 'react';

import { Sport } from '__generated__/globalTypes';
import idFromObject from '@sorare/core/src/gql/idFromObject';

import { useClaimReferralReward_referralReward } from './__generated__/useClaimReferralReward.graphql';
import useSo5ClaimReferralReward from './useSo5ClaimReferralReward';
import useUSSportsClaimReferralReward from './useUSSportsClaimReferralReward';

export const useClaimReferralReward = (
  referralReward: useClaimReferralReward_referralReward | null
) => {
  const sport = referralReward?.token.sport;

  const claimSo5 = useSo5ClaimReferralReward();
  const claimUSSports = useUSSportsClaimReferralReward(
    sport === Sport.FOOTBALL || !sport ? Sport.BASEBALL : sport
  );

  return useCallback(() => {
    if (referralReward?.token.sport === Sport.FOOTBALL) {
      claimSo5(referralReward.id);
    } else {
      const baseballId = idFromObject(referralReward?.id);
      if (baseballId) {
        claimUSSports(baseballId);
      }
    }
  }, [
    claimSo5,
    claimUSSports,
    referralReward?.id,
    referralReward?.token.sport,
  ]);
};

useClaimReferralReward.fragments = {
  referralReward: gql`
    fragment useClaimReferralReward_referralReward on ReferralReward {
      id
      token {
        slug
        assetId
        sport
      }
    }
  `,
};
