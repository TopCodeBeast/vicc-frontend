import { TypedDocumentNode, gql } from '@apollo/client';

import { acceptVicc5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  AcceptVicc5NoCardLineupMutation,
  AcceptVicc5NoCardLineupMutationVariables,
} from './__generated__/useAcceptSo5NoCardLineup.graphql';

const ACCEPT_NO_CARD_LINEUP_MUTATION = gql`
  mutation AcceptVicc5NoCardLineupMutation($input: acceptVicc5NoCardLineupInput!) {
    acceptVicc5NoCardLineup(input: $input) {
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
  AcceptVicc5NoCardLineupMutation,
  AcceptVicc5NoCardLineupMutationVariables
>;

const useAcceptVicc5NoCardLineup = () => {
  const [mutate] = useMutation(ACCEPT_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: acceptVicc5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useAcceptVicc5NoCardLineup;
