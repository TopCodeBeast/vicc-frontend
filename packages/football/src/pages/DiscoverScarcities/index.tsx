import { useLocation, useNavigate } from 'react-router-dom';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { FOOTBALL_HOME } from '@sorare/core/src/constants/routes';
import { useConnectionContext } from '@sorare/core/src/contexts/connection';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useNavigateWithDeeplink from '@sorare/core/src/hooks/useNavigateWithDeeplink';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import { DesktopDiscoverScarcities } from '@football/components/onboarding/DiscoverScarcities/DesktopDiscoverScarcities';
import { MobileDiscoverScarcities } from '@football/components/onboarding/DiscoverScarcities/MobileDiscoverScarcities';

export const DiscoverScarcities = () => {
  const { up: isTablet } = useScreenSize('tablet');
  const location = useLocation();
  const fontStatus = useFontFaceObserver([{ family: 'Romie-Regular' }], {
    timeout: 1000,
  });
  const { signUp } = useConnectionContext();
  const { currentUser } = useCurrentUserContext();
  const navigate = useNavigate();
  const navigateWithDeeplink = useNavigateWithDeeplink();

  const locationState = (!!location.state &&
    typeof location.state === 'object' &&
    (location.state as {
      afterSignUpTarget?: string;
      commonCardPictureUrl?: string;
    })) || { afterSignUpTarget: '', commonCardPictureUrl: '' };

  if (currentUser && locationState.afterSignUpTarget) {
    navigate(locationState.afterSignUpTarget);
  }

  if (fontStatus === 'initial') return <LoadingIndicator fullScreen />;

  const commonCardPictureUrl = locationState.commonCardPictureUrl || '';

  const onFinishOnboarding = () => {
    if (currentUser) {
      navigateWithDeeplink(FOOTBALL_HOME);
    } else {
      signUp();
    }
  };

  if (isTablet) {
    return (
      <DesktopDiscoverScarcities
        commonCardPictureUrl={commonCardPictureUrl}
        onFinishOnboarding={onFinishOnboarding}
      />
    );
  }
  return (
    <MobileDiscoverScarcities
      commonCardPictureUrl={commonCardPictureUrl}
      onFinishOnboarding={onFinishOnboarding}
    />
  );
};

export default DiscoverScarcities;
