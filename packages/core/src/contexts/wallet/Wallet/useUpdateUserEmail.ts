import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';

import { updateUserEmailInput } from '__generated__/globalTypes';
import { walletRecovery } from '@core/contexts/currentUser/queries';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  UpdateUserEmailMutation,
  UpdateUserEmailMutationVariables,
} from './__generated__/useUpdateUserEmail.graphql';

const UPDATE_EMAIL_MUTATION = gql`
  mutation UpdateUserEmailMutation($input: updateUserEmailInput!) {
    updateUserEmail(input: $input) {
      currentUser {
        slug
        unconfirmedEmail
        ...CurrentUserProvider_walletRecovery
      }
      errors {
        path
        message
        code
      }
    }
  }
  ${walletRecovery}
` as TypedDocumentNode<
  UpdateUserEmailMutation,
  UpdateUserEmailMutationVariables
>;

export default () => {
  const [mutate] = useMutation(UPDATE_EMAIL_MUTATION, {
    showErrorsWithSnackNotification: false,
    sendErrors: true,
  });

  return useCallback(
    async (input: updateUserEmailInput) => {
      const { data } = await mutate({
        variables: {
          input,
        },
      });

      return data;
    },
    [mutate]
  );
};
