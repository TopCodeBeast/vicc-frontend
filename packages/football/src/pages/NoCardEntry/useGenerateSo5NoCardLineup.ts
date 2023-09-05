import { TypedDocumentNode, gql } from '@apollo/client';

import { generateVicc5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  GenerateVicc5NoCardLineupMutation,
  GenerateVicc5NoCardLineupMutationVariables,
} from './__generated__/useGenerateSo5NoCardLineup.graphql';

const GENERATE_NO_CARD_LINEUP_MUTATION = gql`
  mutation GenerateVicc5NoCardLineupMutation(
    $input: generateVicc5NoCardLineupInput!
  ) {
    generateVicc5NoCardLineup(input: $input) {
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
  GenerateVicc5NoCardLineupMutation,
  GenerateVicc5NoCardLineupMutationVariables
>;

const useGenerateVicc5NoCardLineup = () => {
  const [mutate] = useMutation(GENERATE_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: generateVicc5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useGenerateVicc5NoCardLineup;
