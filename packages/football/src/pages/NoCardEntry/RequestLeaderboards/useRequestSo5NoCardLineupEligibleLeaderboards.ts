import { TypedDocumentNode, gql } from '@apollo/client';

import { requestVicc5NoCardLineupEligibleLeaderboardsInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  RequestVicc5NoCardLineupEligibleLeaderboardsMutation,
  RequestVicc5NoCardLineupEligibleLeaderboardsMutationVariables,
} from './__generated__/useRequestSo5NoCardLineupEligibleLeaderboards.graphql';

const REQUEST_NO_CARD_LINEUP_ELIGIBLE_LEADERBOARDS_MUTATION = gql`
  mutation RequestVicc5NoCardLineupEligibleLeaderboardsMutation(
    $input: requestVicc5NoCardLineupEligibleLeaderboardsInput!
  ) {
    requestVicc5NoCardLineupEligibleLeaderboards(input: $input) {
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
  RequestVicc5NoCardLineupEligibleLeaderboardsMutation,
  RequestVicc5NoCardLineupEligibleLeaderboardsMutationVariables
>;

const useRequestVicc5NoCardLineupEligibleLeaderboards = () => {
  const [mutate] = useMutation(
    REQUEST_NO_CARD_LINEUP_ELIGIBLE_LEADERBOARDS_MUTATION,
    {
      showErrorsInForm: true,
    }
  );

  return async (input: requestVicc5NoCardLineupEligibleLeaderboardsInput) =>
    mutate({ variables: { input } });
};

export default useRequestVicc5NoCardLineupEligibleLeaderboards;
