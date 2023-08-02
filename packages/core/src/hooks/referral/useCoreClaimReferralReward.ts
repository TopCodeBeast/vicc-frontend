import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { formatGqlErrors } from '@core/lib/gql';

import {
  ClaimSo5ReferralRewardMutation,
  ClaimSo5ReferralRewardMutationVariables,
} from './__generated__/useCoreClaimReferralReward.graphql';

const CLAIM_REFERRAL_REWARD_MUTATION = gql`
  mutation ClaimSo5ReferralRewardMutation($input: claimReferralRewardInput!) {
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
  ClaimSo5ReferralRewardMutation,
  ClaimSo5ReferralRewardMutationVariables
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
