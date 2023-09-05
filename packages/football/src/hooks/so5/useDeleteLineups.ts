import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  DeleteUserVicc5LineupsMutation,
  DeleteUserVicc5LineupsMutationVariables,
} from './__generated__/useDeleteLineups.graphql';

const DELETE_USER_SO5_LINEUPS_MUTATION = gql`
  mutation DeleteUserVicc5LineupsMutation($input: deleteUserVicc5LineupsInput!) {
    deleteUserVicc5Lineups(input: $input) {
      currentUser {
        slug
        blockchainCardsInLineups
      }
      vicc5Fixture {
        slug
        vicc5Leaderboards {
          slug
          vicc5LineupsCount
          myVicc5Lineups {
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
` as TypedDocumentNode<
  DeleteUserVicc5LineupsMutation,
  DeleteUserVicc5LineupsMutationVariables
>;

export default () => {
  const [deleteVicc5Lineups] = useMutation(DELETE_USER_SO5_LINEUPS_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return useCallback(
    async (vicc5LeagueIds: string[], lineupIds?: string[]) => {
      const result = await deleteVicc5Lineups({
        variables: {
          input: {
            vicc5LeagueIds,
          },
        },
        update: cache => {
          if (lineupIds) {
            lineupIds.forEach(lineupId => {
              cache.evict({
                id: cache.identify({
                  __typename: 'Vicc5Lineup',
                  id: lineupId,
                }),
              });
              cache.gc();
            });
          }
        },
      });

      const errors = result.data?.deleteUserVicc5Lineups?.errors || [];

      if (errors.length) {
        showNotification('errors', { errors: formatGqlErrors(errors) });
        return errors;
      }
      showNotification('vicc5LineupsDelete');
      return null;
    },
    [deleteVicc5Lineups, showNotification]
  );
};
