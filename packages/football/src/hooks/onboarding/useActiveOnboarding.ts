import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

export const useActiveOnboarding = () => {
  const { currentUser } = useCurrentUserContext();
  const {
    flags: { useDisableFootballOnboarding = false },
  } = useFeatureFlags();

  const onboardingEnabled =
    !currentUser ||
    useDisableFootballOnboarding ||
    currentUser.onboardingStatus.enabled === true;
  const onboardingDone = currentUser?.onboardingStatus.completed === true;

  return onboardingEnabled && !onboardingDone;
};
