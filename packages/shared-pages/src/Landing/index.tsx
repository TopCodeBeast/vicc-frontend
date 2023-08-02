import { useEffect } from 'react';

import LandingMultiSport from '@sorare/core/src/components/landing/LandingMultiSport';
import { NewLandingMultiSport } from '@sorare/core/src/components/landing/NewLandingMultiSport';
import { useConnectionContext } from '@sorare/core/src/contexts/connection';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useAfterLoggedInTarget from '@sorare/core/src/hooks/useAfterLoggedInTarget';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { metadatas } from '@sorare/core/src/lib/seo/common';

const Landing = () => {
  useTitleAndDescription(
    metadatas.landing.title,
    metadatas.landing.description
  );
  const {
    flags: { useLanding20 = false },
  } = useFeatureFlags();
  const { currentUser } = useCurrentUserContext();
  const { signIn } = useConnectionContext();

  const afterLoggedInTarget = useAfterLoggedInTarget();

  useEffect(() => {
    if (!currentUser && afterLoggedInTarget) {
      signIn();
    }
  }, [currentUser, afterLoggedInTarget, signIn]);

  return useLanding20 ? <NewLandingMultiSport /> : <LandingMultiSport />;
};

export default Landing;
