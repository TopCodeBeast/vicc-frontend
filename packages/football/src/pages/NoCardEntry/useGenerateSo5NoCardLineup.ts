import { gql } from '@apollo/client';

import { generateSo5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

const GENERATE_NO_CARD_LINEUP_MUTATION = gql`
  mutation GenerateSo5NoCardLineupMutation(
    $input: generateSo5NoCardLineupInput!
  ) {
    generateSo5NoCardLineup(input: $input) {
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
`;

const useGenerateSo5NoCardLineup = () => {
  const [mutate] = useMutation(GENERATE_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: generateSo5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useGenerateSo5NoCardLineup;
