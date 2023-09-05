import { TypedDocumentNode, gql } from '@apollo/client';

import { confirmVicc5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  ConfirmVicc5NoCardLineupMutation,
  ConfirmVicc5NoCardLineupMutationVariables,
} from './__generated__/useConfirmSo5NoCardLineup.graphql';

const CONFIRM_NO_CARD_LINEUP_MUTATION = gql`
  mutation ConfirmVicc5NoCardLineupMutation(
    $input: confirmVicc5NoCardLineupInput!
  ) {
    confirmVicc5NoCardLineup(input: $input) {
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
  ConfirmVicc5NoCardLineupMutation,
  ConfirmVicc5NoCardLineupMutationVariables
>;

const useConfirmVicc5NoCardLineup = () => {
  const [mutate] = useMutation(CONFIRM_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: confirmVicc5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useConfirmVicc5NoCardLineup;
