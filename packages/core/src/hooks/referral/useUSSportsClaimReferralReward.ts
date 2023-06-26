import { useCallback } from 'react';

import { Sport } from '@core/__generated__/globalTypes';
// import { useBaseballMutation } from '@core/hooks/graphql/baseball';
// import {
//   CLAIM_BASEBALL_REFERRAL_REWARDS_MUTATION,
//   CLAIM_NBA_REFERRAL_REWARDS_MUTATION,
// } from '@core/lib/usSportsGraphql/queries';

// const claimQueryBySport = {
//   [Sport.BASEBALL]: CLAIM_BASEBALL_REFERRAL_REWARDS_MUTATION,
//   [Sport.NBA]: CLAIM_NBA_REFERRAL_REWARDS_MUTATION,
// };

export default (sport: Sport.BASEBALL | Sport.NBA) => {
  // const [claim] = useBaseballMutation(claimQueryBySport[sport]);

  // return useCallback(
  //   async (referralRewardId: string) => {
  //     await claim({
  //       variables: {
  //         referralIDs: [referralRewardId],
  //       },
  //       refetchQueries: ['ConfigQuery'],
  //     });
  //   },
  //   [claim]
  // );
  return (referralRewardId: string) => {
    console.log('referralRewardId', referralRewardId)
  }
};
