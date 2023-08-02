import { TypedDocumentNode, gql } from '@apollo/client';

import { confirmSo5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  ConfirmSo5NoCardLineupMutation,
  ConfirmSo5NoCardLineupMutationVariables,
} from './__generated__/useConfirmSo5NoCardLineup.graphql';

const CONFIRM_NO_CARD_LINEUP_MUTATION = gql`
  mutation ConfirmSo5NoCardLineupMutation(
    $input: confirmSo5NoCardLineupInput!
  ) {
    confirmSo5NoCardLineup(input: $input) {
      currentUser {
        slug
      }
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  ConfirmSo5NoCardLineupMutation,
  ConfirmSo5NoCardLineupMutationVariables
>;

const useConfirmSo5NoCardLineup = () => {
  const [mutate] = useMutation(CONFIRM_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: confirmSo5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useConfirmSo5NoCardLineup;
