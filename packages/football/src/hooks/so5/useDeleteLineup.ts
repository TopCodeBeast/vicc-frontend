import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  DeleteVicc5LineupMutation,
  DeleteVicc5LineupMutationVariables,
} from './__generated__/useDeleteLineup.graphql';

const DELETE_SO5_LINEUP_MUTATION = gql`
  mutation DeleteVicc5LineupMutation($input: deleteVicc5LineupInput!) {
    deleteVicc5Lineup(input: $input) {
      currentUser {
        slug
        blockchainCardsInLineups
      }
      vicc5Leaderboard {
        slug
        vicc5LineupsCount
        myVicc5Lineups {
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
` as TypedDocumentNode<
  DeleteVicc5LineupMutation,
  DeleteVicc5LineupMutationVariables
>;

export default () => {
  const [deleteVicc5Lineup] = useMutation(DELETE_SO5_LINEUP_MUTATION, {
    update(cache, context, { variables }) {
      if (variables?.input.vicc5LineupId) {
        const lineupCacheId = cache.identify({
          __typename: 'Vicc5Lineup',
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
    const result = await deleteVicc5Lineup({
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
    showNotification('vicc5FixtureDelete');
    return null;
  };
};
