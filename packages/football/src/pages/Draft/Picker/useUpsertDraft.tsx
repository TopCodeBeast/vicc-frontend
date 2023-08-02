import { TypedDocumentNode, gql } from '@apollo/client';

import { onboardingStatus } from '@sorare/core/src/contexts/currentUser/queries';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  UpsertCommonDraftInputMutation,
  UpsertCommonDraftInputMutationVariables,
} from './__generated__/useUpsertDraft.graphql';

const UPSERT_COMMON_DRAFT_MUTATION = gql`
  mutation UpsertCommonDraftInputMutation($input: upsertCommonDraftInput!) {
    upsertCommonDraft(input: $input) {
      clientMutationId
      currentUser {
        id
        slug
        ...CurrentUserProvider_onboardingStatus
      }
      draftError {
        error
        code
        printablePlayers {
          id
          player {
            slug
          }
        }
      }
    }
  }
  ${onboardingStatus}
` as TypedDocumentNode<
  UpsertCommonDraftInputMutation,
  UpsertCommonDraftInputMutationVariables
>;

const useUpsertDraft = () => {
  const [upsertDraft] = useMutation(UPSERT_COMMON_DRAFT_MUTATION, {
    showErrorsWithSnackNotification: false,
    warnIfNoErrorHandling: false,
  });
  return { upsertDraft };
};

export default useUpsertDraft;
