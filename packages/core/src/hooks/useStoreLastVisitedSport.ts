import { useEffect } from 'react';

import { Sport } from '@core/__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import useLifecycle, { LIFECYCLE, Lifecycle } from './useLifecycle';

const useStoreLastVisitedSport = (sport?: Sport) => {
  const { currentUser } = useCurrentUserContext();
  const { update: storeLastVisitedSport } = useLifecycle();
  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const lastVisitedSport = lifecycle?.lastVisitedSport;

  useEffect(() => {
    if (currentUser && sport && sport !== lastVisitedSport) {
      storeLastVisitedSport(LIFECYCLE.lastVisitedSport, sport);
    }
  }, [currentUser, lastVisitedSport, sport, storeLastVisitedSport]);
};

export default useStoreLastVisitedSport;
