import { gql } from '@apollo/client';

import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

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
`;

export default () => {
  const [destroy] = useMutation<
    DestroyReferralMutation,
    DestroyReferralMutationVariables
  >(DESTROY_REFERRAL_MUTATION, { showErrorsWithSnackNotification: true });

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
