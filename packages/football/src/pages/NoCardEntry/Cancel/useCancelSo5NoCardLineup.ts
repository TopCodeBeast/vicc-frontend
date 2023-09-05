import { TypedDocumentNode, gql } from '@apollo/client';

import { declineVicc5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  DeclineVicc5NoCardLineupMutation,
  DeclineVicc5NoCardLineupMutationVariables,
} from './__generated__/useCancelSo5NoCardLineup.graphql';

const DECLINE_NO_CARD_LINEUP_MUTATION = gql`
  mutation DeclineVicc5NoCardLineupMutation(
    $input: declineVicc5NoCardLineupInput!
  ) {
    declineVicc5NoCardLineup(input: $input) {
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
  DeclineVicc5NoCardLineupMutation,
  DeclineVicc5NoCardLineupMutationVariables
>;

const useCancelVicc5NoCardLineup = () => {
  const [mutate] = useMutation(DECLINE_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: declineVicc5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useCancelVicc5NoCardLineup;
