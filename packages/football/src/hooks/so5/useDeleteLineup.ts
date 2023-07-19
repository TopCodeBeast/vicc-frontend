import { gql, useMutation } from '@apollo/client';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  DeleteSo5LineupMutation,
  DeleteSo5LineupMutationVariables,
} from './__generated__/useDeleteLineup.graphql';

const DELETE_SO5_LINEUP_MUTATION = gql`
  mutation DeleteSo5LineupMutation($input: deleteVicc5LineupInput!) {
    deleteVicc5Lineup(input: $input) {
      # currentUser {
      #   slug
      #   blockchainCardsInLineups
      # }
      so5Leaderboard: vicc5Leaderboard {
        slug
        so5LineupsCount: vicc5LineupsCount
        mySo5Lineups: myVicc5Lineups {
          id
          name
          draft
        }
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

export default () => {
  const [deleteSo5Lineup] = useMutation<
    DeleteSo5LineupMutation,
    DeleteSo5LineupMutationVariables
  >(DELETE_SO5_LINEUP_MUTATION, {
    update(cache, context, { variables }) {
      if (variables?.input.vicc5LineupId) {
        const lineupCacheId = cache.identify({
          __typename: 'So5Lineup',
          id: variables?.input.vicc5LineupId,
        });

        cache.evict({
          id: lineupCacheId,
        });
      }
    },
  });
  const { showNotification } = useSnackNotificationContext();

  return async (vicc5LineupId: string) => {
    const result = await deleteSo5Lineup({
      variables: {
        input: {
          vicc5LineupId,
        },
      },
    });

    const errors = result.data?.deleteVicc5Lineup?.errors || [];

    if (errors.length) {
      showNotification('errors', { errors: formatGqlErrors(errors) });
      return errors;
    }
    showNotification('so5FixtureDelete');
    return null;
  };
};
