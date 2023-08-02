import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

export const useActiveOnboarding = () => {
  const { currentUser } = useCurrentUserContext();

  const onboardingEnabled =
    !currentUser || currentUser.onboardingStatus.enabled === true;
  const onboardingDone = currentUser?.onboardingStatus.completed === true;

  return onboardingEnabled && !onboardingDone;
};
