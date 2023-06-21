import { gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  DeleteUserSo5LineupsMutation,
  DeleteUserSo5LineupsMutationVariables,
} from './__generated__/useDeleteLineups.graphql';

const DELETE_USER_SO5_LINEUPS_MUTATION = gql`
  mutation DeleteUserSo5LineupsMutation($input: deleteUserSo5LineupsInput!) {
    deleteUserSo5Lineups(input: $input) {
      currentUser {
        slug
        blockchainCardsInLineups
      }
      so5Fixture {
        slug
        so5Leaderboards {
          slug
          so5LineupsCount
          mySo5Lineups {
            id
            name
          }
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
  const [deleteSo5Lineups] = useMutation<
    DeleteUserSo5LineupsMutation,
    DeleteUserSo5LineupsMutationVariables
  >(DELETE_USER_SO5_LINEUPS_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return useCallback(
    async (so5LeagueIds: string[], lineupIds?: string[]) => {
      const result = await deleteSo5Lineups({
        variables: {
          input: {
            so5LeagueIds,
          },
        },
        update: cache => {
          if (lineupIds) {
            lineupIds.forEach(lineupId => {
              cache.evict({
                id: cache.identify({
                  __typename: 'So5Lineup',
                  id: lineupId,
                }),
              });
              cache.gc();
            });
          }
        },
      });

      const errors = result.data?.deleteUserSo5Lineups?.errors || [];

      if (errors.length) {
        showNotification('errors', { errors: formatGqlErrors(errors) });
        return errors;
      }
      showNotification('so5LineupsDelete');
      return null;
    },
    [deleteSo5Lineups, showNotification]
  );
};
