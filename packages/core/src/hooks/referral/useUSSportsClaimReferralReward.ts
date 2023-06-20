import { useCallback } from 'react';

import { Sport } from '__generated__/globalTypes';
import { useBaseballMutation } from '@sorare/core/src/hooks/graphql/baseball';
import {
  CLAIM_BASEBALL_REFERRAL_REWARDS_MUTATION,
  CLAIM_NBA_REFERRAL_REWARDS_MUTATION,
} from '@sorare/core/src/lib/usSportsGraphql/queries';

const claimQueryBySport = {
  [Sport.BASEBALL]: CLAIM_BASEBALL_REFERRAL_REWARDS_MUTATION,
  [Sport.NBA]: CLAIM_NBA_REFERRAL_REWARDS_MUTATION,
};

export default (sport: Sport.BASEBALL | Sport.NBA) => {
  const [claim] = useBaseballMutation(claimQueryBySport[sport]);

  return useCallback(
    async (referralRewardId: string) => {
      await claim({
        variables: {
          referralIDs: [referralRewardId],
        },
        refetchQueries: ['ConfigQuery'],
      });
    },
    [claim]
  );
};
