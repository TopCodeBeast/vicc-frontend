import { gql } from '@apollo/client';

import { declineSo5NoCardLineupInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

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
`;

const useCancelSo5NoCardLineup = () => {
  const [mutate] = useMutation(DECLINE_NO_CARD_LINEUP_MUTATION, {
    showErrorsInForm: true,
  });

  return async (input: declineSo5NoCardLineupInput) =>
    mutate({ variables: { input } });
};

export default useCancelSo5NoCardLineup;
