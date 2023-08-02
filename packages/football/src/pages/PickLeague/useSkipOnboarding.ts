import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';

import { FOOTBALL_MARKET } from '@sorare/core/src/constants/routes';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import useNavigateWithDeeplink from '@sorare/core/src/hooks/useNavigateWithDeeplink';

import {
  SkipOnboardingMutation,
  SkipOnboardingMutationVariables,
} from './__generated__/useSkipOnboarding.graphql';

const SKIP_ONBOARDING_MUTATION = gql`
  mutation SkipOnboardingMutation($input: skipOnboardingInput!) {
    skipOnboarding(input: $input) {
      currentUser {
        slug
        onboardingStatus {
          id
          enabled
          completed
        }
      }
    }
  }
` as TypedDocumentNode<SkipOnboardingMutation, SkipOnboardingMutationVariables>;

export const useSkipOnboarding = () => {
  const [skip] = useMutation(SKIP_ONBOARDING_MUTATION);
  const navigateWithDeeplink = useNavigateWithDeeplink();
  const { updateQuery } = useConfigContext();
  const { currentUser } = useCurrentUserContext();
  const [isSkipping, setIsSkipping] = useState(false);

  return async () => {
    if (currentUser) {
      if (!isSkipping) {
        setIsSkipping(true);
        const { data } = await skip({ variables: { input: {} } });
        setIsSkipping(false);
        const newOnboardingStatus =
          data?.skipOnboarding?.currentUser?.onboardingStatus;

        if (newOnboardingStatus) {
          // update the onboarding status of currentConfigQuery to avoid redirection to onboarding
          updateQuery({
            ...currentUser,
            onboardingStatus: newOnboardingStatus,
          });
          navigateWithDeeplink(FOOTBALL_MARKET);
        }
      }
    }
  };
};
