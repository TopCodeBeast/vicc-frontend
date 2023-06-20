import { gql, useMutation } from '@apollo/client';

import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import {
  ConfirmSo5LineupsMutation,
  ConfirmSo5LineupsMutationVariables,
} from './__generated__/useConfirmLineups.graphql';

const CONFIRM_SO5_LINEUPS_MUTATION = gql`
  mutation ConfirmSo5LineupsMutation($input: confirmSo5LineupsInput!) {
    confirmSo5Lineups(input: $input) {
      currentUser {
        slug
        blockchainCardsInLineups
      }
      so5Lineups {
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

  return async (so5LineupIds: string[]) => {
    const result = await confirmLineups({
      variables: {
        input: {
          so5LineupIds,
        },
      },
    });

    const errors = result.data?.confirmSo5Lineups?.errors || [];

    if (errors.length) {
      showNotification('errors', { errors: formatGqlErrors(errors) });
      return errors;
    }
    showNotification('so5LineupsConfirm');
    return null;
  };
};
