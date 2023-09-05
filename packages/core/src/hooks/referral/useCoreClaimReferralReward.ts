import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { formatGqlErrors } from '@core/lib/gql';

import {
  ClaimVicc5ReferralRewardMutation,
  ClaimVicc5ReferralRewardMutationVariables,
} from './__generated__/useCoreClaimReferralReward.graphql';

const CLAIM_REFERRAL_REWARD_MUTATION = gql`
  mutation ClaimVicc5ReferralRewardMutation($input: claimReferralRewardInput!) {
    claimReferralReward(input: $input) {
      referralReward {
        id
        shippingState
        card {
          slug
          assetId
          visible
        }
      }
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  ClaimVicc5ReferralRewardMutation,
  ClaimVicc5ReferralRewardMutationVariables
>;

export default () => {
  const [claim] = useMutation(CLAIM_REFERRAL_REWARD_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return useCallback(
    async (referralRewardId: string) => {
      const result = await claim({
        variables: {
          input: {
            referralRewardId,
          },
        },
        refetchQueries: ['ConfigQuery'],
      });

      const errors = result.data?.claimReferralReward?.errors || [];

      if (errors.length) {
        showNotification('errors', { errors: formatGqlErrors(errors) });
        return errors;
      }
      return null;
    },
    [claim, showNotification]
  );
};
