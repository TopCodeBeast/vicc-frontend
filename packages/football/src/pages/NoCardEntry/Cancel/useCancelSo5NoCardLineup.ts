import { TypedDocumentNode, gql } from '@apollo/client';

import { declineSo5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  DeclineSo5NoCardLineupMutation,
  DeclineSo5NoCardLineupMutationVariables,
} from './__generated__/useCancelSo5NoCardLineup.graphql';

const DECLINE_NO_CARD_LINEUP_MUTATION = gql`
  mutation DeclineSo5NoCardLineupMutation(
    $input: declineSo5NoCardLineupInput!
  ) {
    declineSo5NoCardLineup(input: $input) {
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
  DeclineSo5NoCardLineupMutation,
  DeclineSo5NoCardLineupMutationVariables
>;

const useCancelSo5NoCardLineup = () => {
  const [mutate] = useMutation(DECLINE_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: declineSo5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useCancelSo5NoCardLineup;
