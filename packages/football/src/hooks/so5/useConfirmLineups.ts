import { gql, useMutation } from '@apollo/client';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  ConfirmSo5LineupsMutation,
  ConfirmSo5LineupsMutationVariables,
} from './__generated__/useConfirmLineups.graphql';

const CONFIRM_SO5_LINEUPS_MUTATION = gql`
  mutation ConfirmSo5LineupsMutation($input: confirmVicc5LineupsInput!) {
    confirmVicc5Lineups(input: $input) {
      # currentUser {
      #   slug
      #   blockchainCardsInLineups
      # }
      so5Lineups: vicc5Lineups {
        id
        name
        draft
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
  const [confirmLineups] = useMutation<
    ConfirmSo5LineupsMutation,
    ConfirmSo5LineupsMutationVariables
  >(CONFIRM_SO5_LINEUPS_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (vicc5LineupIds: string[]) => {
    const result = await confirmLineups({
      variables: {
        input: {
          vicc5LineupIds,
        },
      },
    });

    const errors = result.data?.confirmVicc5Lineups?.errors || [];

    if (errors.length) {
      showNotification('errors', { errors: formatGqlErrors(errors) });
      return errors;
    }
    showNotification('so5LineupsConfirm');
    return null;
  };
};
