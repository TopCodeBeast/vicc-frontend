import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Sport } from '@core/__generated__/globalTypes';
import { useDefaultSportPages } from '@core/constants/routes';
import { useConnectionContext } from '@core/contexts/connection';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useEvents from '@core/lib/events/useEvents';

export const useSportCTAProps = (sport: Sport) => {
  const track = useEvents();

  const trackClickPlayNow = useCallback(() => {
    track('Click Play Now', {
      sport,
    });
  }, [sport, track]);
  const { currentUser } = useCurrentUserContext();

  const { signUp } = useConnectionContext();
  const defaultSportPages = useDefaultSportPages();
  return currentUser
    ? {
        to: defaultSportPages[sport],
        component: Link,
        onClick: () => {
          trackClickPlayNow();
        },
      }
    : {
        onClick: () => {
          trackClickPlayNow();
          return signUp();
        },
      };
};
