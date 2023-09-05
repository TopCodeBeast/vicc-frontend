import { TypedDocumentNode, gql } from '@apollo/client';

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
        unclaimedVicc5Rewards {
          slug
        }
        coinBalance
      }
      vicc5Rewards {
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
        vicc5Fixture {
          slug
          myVicc5Rewards {
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
` as TypedDocumentNode<ClaimRewardsMutation, ClaimRewardsMutationVariables>;

export default () => {
  const [claim, { loading }] = useMutation(CLAIM_REWARDS_MUTATION);
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
