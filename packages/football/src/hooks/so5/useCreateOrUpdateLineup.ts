import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

// eslint-disable-next-line import/named
import { createOrUpdateVicc5LineupInput } from '@sorare/core/src/__generated__/globalTypes';
import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/gql';

import { HANDLED_RULES } from '@football/lib/so5';

import {
  CreateOrUpdateVicc5LineupMutation,
  CreateOrUpdateVicc5LineupMutationVariables,
} from './__generated__/useCreateOrUpdateLineup.graphql';

type CreateOrUpdateVicc5LineupMutation_createOrUpdateVicc5Lineup_errors =
  NonNullable<
    CreateOrUpdateVicc5LineupMutation['createOrUpdateVicc5Lineup']
  >['errors'][number];

const CREATE_OR_UPDATE_SO5_LINEUP_MUTATION = gql`
  mutation CreateOrUpdateVicc5LineupMutation(
    $input: createOrUpdateVicc5LineupInput!
  ) {
    createOrUpdateVicc5Lineup(input: $input) {
      vicc5Lineup {
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
` as TypedDocumentNode<
  CreateOrUpdateVicc5LineupMutation,
  CreateOrUpdateVicc5LineupMutationVariables
>;

export default ({
  hideNotification = false,
}: {
  hideNotification?: boolean;
}) => {
  const [createOrUpdateVicc5Lineup] = useMutation(
    CREATE_OR_UPDATE_SO5_LINEUP_MUTATION
  );

  const { showNotification } = useSnackNotificationContext();

  return async (input: createOrUpdateVicc5LineupInput) => {
    const result = await createOrUpdateVicc5Lineup({
      variables: { input },
    }).catch(e => {
      return {
        data: {
          createOrUpdateVicc5Lineup: {
            errors: [e],
          },
        },
      };
    });
    const errors = result.data?.createOrUpdateVicc5Lineup?.errors || [];
    if (!errors?.length) {
      if (!hideNotification) {
        showNotification('composeLineup');
      }
      return {
        data: result.data,
      };
    }

    const { unhandledErrors, handledErrors } = errors.reduce<{
      unhandledErrors: CreateOrUpdateVicc5LineupMutation_createOrUpdateVicc5Lineup_errors[];
      handledErrors: CreateOrUpdateVicc5LineupMutation_createOrUpdateVicc5Lineup_errors[];
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
