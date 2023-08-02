import { TypedDocumentNode, gql } from '@apollo/client';

import { requestSo5NoCardLineupEligibleLeaderboardsInput } from '@sorare/core/src/__generated__/globalTypes';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  RequestSo5NoCardLineupEligibleLeaderboardsMutation,
  RequestSo5NoCardLineupEligibleLeaderboardsMutationVariables,
} from './__generated__/useRequestSo5NoCardLineupEligibleLeaderboards.graphql';

const REQUEST_NO_CARD_LINEUP_ELIGIBLE_LEADERBOARDS_MUTATION = gql`
  mutation RequestSo5NoCardLineupEligibleLeaderboardsMutation(
    $input: requestSo5NoCardLineupEligibleLeaderboardsInput!
  ) {
    requestSo5NoCardLineupEligibleLeaderboards(input: $input) {
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
  RequestSo5NoCardLineupEligibleLeaderboardsMutation,
  RequestSo5NoCardLineupEligibleLeaderboardsMutationVariables
>;

const useRequestSo5NoCardLineupEligibleLeaderboards = () => {
  const [mutate] = useMutation(
    REQUEST_NO_CARD_LINEUP_ELIGIBLE_LEADERBOARDS_MUTATION,
    {
      showErrorsInForm: true,
    }
  );

  return async (input: requestSo5NoCardLineupEligibleLeaderboardsInput) =>
    mutate({ variables: { input } });
};

export default useRequestSo5NoCardLineupEligibleLeaderboards;
