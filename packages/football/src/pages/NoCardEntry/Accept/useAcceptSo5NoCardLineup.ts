import { TypedDocumentNode, gql } from '@apollo/client';

import { acceptSo5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  AcceptSo5NoCardLineupMutation,
  AcceptSo5NoCardLineupMutationVariables,
} from './__generated__/useAcceptSo5NoCardLineup.graphql';

const ACCEPT_NO_CARD_LINEUP_MUTATION = gql`
  mutation AcceptSo5NoCardLineupMutation($input: acceptSo5NoCardLineupInput!) {
    acceptSo5NoCardLineup(input: $input) {
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
  AcceptSo5NoCardLineupMutation,
  AcceptSo5NoCardLineupMutationVariables
>;

const useAcceptSo5NoCardLineup = () => {
  const [mutate] = useMutation(ACCEPT_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: acceptSo5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useAcceptSo5NoCardLineup;
