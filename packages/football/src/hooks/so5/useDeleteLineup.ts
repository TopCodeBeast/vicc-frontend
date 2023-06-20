import { gql, useMutation } from '@apollo/client';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  DeleteSo5LineupMutation,
  DeleteSo5LineupMutationVariables,
} from './__generated__/useDeleteLineup.graphql';

const DELETE_SO5_LINEUP_MUTATION = gql`
  mutation DeleteSo5LineupMutation($input: deleteSo5LineupInput!) {
    deleteSo5Lineup(input: $input) {
      currentUser {
        slug
        blockchainCardsInLineups
      }
      so5Leaderboard {
        slug
        so5LineupsCount
        mySo5Lineups {
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
      if (variables?.input.so5LineupId) {
        const lineupCacheId = cache.identify({
          __typename: 'So5Lineup',
          id: variables?.input.so5LineupId,
        });

        cache.evict({
          id: lineupCacheId,
        });
      }
    },
  });
  const { showNotification } = useSnackNotificationContext();

  return async (so5LineupId: string) => {
    const result = await deleteSo5Lineup({
      variables: {
        input: {
          so5LineupId,
        },
      },
    });

    const errors = result.data?.deleteSo5Lineup?.errors || [];

    if (errors.length) {
      showNotification('errors', { errors: formatGqlErrors(errors) });
      return errors;
    }
    showNotification('so5FixtureDelete');
    return null;
  };
};
