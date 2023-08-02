import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  DestroyReferralMutation,
  DestroyReferralMutationVariables,
} from './__generated__/useDestroyReferral.graphql';

const DESTROY_REFERRAL_MUTATION = gql`
  mutation DestroyReferralMutation($input: destroyReferralInput!) {
    destroyReferral(input: $input) {
      errors {
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  DestroyReferralMutation,
  DestroyReferralMutationVariables
>;

export default () => {
  const [destroy] = useMutation(DESTROY_REFERRAL_MUTATION, {
    showErrorsWithSnackNotification: true,
  });

  return async (referralId: string) => {
    await destroy({
      variables: {
        input: {
          referralId,
        },
      },
      refetchQueries: ['RefereesListQuery'],
    });
  };
};
