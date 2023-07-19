import { gql } from '@apollo/client';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  ClaimRewardsMutation,
  ClaimRewardsMutationVariables,
} from './__generated__/useClaimRewards.graphql';

const CLAIM_REWARDS_MUTATION = gql`
  mutation ClaimRewardsMutation($input: claimRewardsInput!) {
    claimRewards(input: $input) {
      currentUser {
        slug
        unclaimedSo5Rewards: unclaimedVicc5Rewards {
          slug
        }
        coinBalance
      }
      so5Rewards: vicc5Rewards {
        slug
        aasmState
        rewardCards {
          id
          card {
            slug
            assetId
            visible
          }
        }
        so5Fixture: vicc5Fixture {
          slug
          mySo5Rewards: myVicc5Rewards {
            slug
            aasmState
          }
        }
      }
      errors {
        message
        code
      }
    }
  }
`;

export default () => {
  const [claim, { loading }] = useMutation<
    ClaimRewardsMutation,
    ClaimRewardsMutationVariables
  >(CLAIM_REWARDS_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return [
    async (vicc5RewardIds: string[]) => {
      const result = await claim({
        variables: {
          input: {
            vicc5RewardIds,
          },
        },
      });

      const errors = result.data?.claimRewards?.errors || [];

      if (errors.length) {
        showNotification('errors', { errors: formatGqlErrors(errors) });
        return errors;
      }
      return null;
    },
    { loading },
  ] as const;
};
