import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import {
  StartOnboardingMutation,
  StartOnboardingMutationVariables,
} from './__generated__/useStartOnboarding.graphql';

const START_ONBOARDING_MUTATION = gql`
  mutation StartOnboardingMutation($input: startOnboardingInput!) {
    startOnboarding(input: $input) {
      currentUser {
        slug
        onboardingStatus {
          id
          tasks {
            id
            state
          }
        }
      }
    }
  }
` as TypedDocumentNode<
  StartOnboardingMutation,
  StartOnboardingMutationVariables
>;

export default function useStartOnboarding() {
  const [start] = useMutation(START_ONBOARDING_MUTATION);

  return async () => {
    await start({ variables: { input: {} } });
  };
}
