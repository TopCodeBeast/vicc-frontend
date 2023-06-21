import { gql, useMutation } from '@apollo/client';

// eslint-disable-next-line import/named
import { createOrUpdateSo5LineupInput } from '@sorare/core/src/__generated__/globalTypes';
import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import { HANDLED_RULES } from '@football/lib/so5';

import {
  CreateOrUpdateSo5LineupMutation,
  CreateOrUpdateSo5LineupMutationVariables,
} from './__generated__/useCreateOrUpdateLineup.graphql';

type CreateOrUpdateSo5LineupMutation_createOrUpdateSo5Lineup_errors =
  NonNullable<
    CreateOrUpdateSo5LineupMutation['createOrUpdateSo5Lineup']
  >['errors'][number];

const CREATE_OR_UPDATE_SO5_LINEUP_MUTATION = gql`
  mutation CreateOrUpdateSo5LineupMutation(
    $input: createOrUpdateSo5LineupInput!
  ) {
    createOrUpdateSo5Lineup(input: $input) {
      so5Lineup {
        id
        name
        draft
      }
      currentUser {
        slug
        blockchainCardsInLineups
        onboardingStatus {
          id
          tasks {
            id
            state
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

export default ({
  hideNotification = false,
}: {
  hideNotification?: boolean;
}) => {
  const [createOrUpdateSo5Lineup] = useMutation<
    CreateOrUpdateSo5LineupMutation,
    CreateOrUpdateSo5LineupMutationVariables
  >(CREATE_OR_UPDATE_SO5_LINEUP_MUTATION);

  const { showNotification } = useSnackNotificationContext();

  return async (input: createOrUpdateSo5LineupInput) => {
    const result = await createOrUpdateSo5Lineup({
      variables: { input },
    }).catch(e => {
      return {
        data: {
          createOrUpdateSo5Lineup: {
            errors: [e],
          },
        },
      };
    });
    const errors = result.data?.createOrUpdateSo5Lineup?.errors || [];
    if (!errors?.length) {
      if (!hideNotification) {
        showNotification('composeLineup');
      }
      return null;
    }

    const { unhandledErrors, handledErrors } = errors.reduce<{
      unhandledErrors: CreateOrUpdateSo5LineupMutation_createOrUpdateSo5Lineup_errors[];
      handledErrors: CreateOrUpdateSo5LineupMutation_createOrUpdateSo5Lineup_errors[];
    }>(
      (prev, curr) => {
        const ruleHandled = HANDLED_RULES.find(rule => {
          return rule.toLowerCase() === curr.path?.[1].toLowerCase();
        });
        if (ruleHandled) {
          prev.handledErrors.push(curr);
        } else {
          prev.unhandledErrors.push(curr);
        }
        return prev;
      },
      { unhandledErrors: [], handledErrors: [] }
    );
    if (unhandledErrors?.length) {
      showNotification(
        'errors',
        { errors: formatGqlErrors(unhandledErrors) },
        { level: Level.WARN }
      );
    }
    return { unhandledErrors, handledErrors };
  };
};
