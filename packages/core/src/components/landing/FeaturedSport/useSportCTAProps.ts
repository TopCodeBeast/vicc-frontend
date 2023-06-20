import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import { useDefaultSportPages } from '@sorare/core/src/constants/routes';
import { useConnectionContext } from 'contexts/connection';
import { useCurrentUserContext } from 'contexts/currentUser';
import useEvents from '@sorare/core/src/lib/events/useEvents';

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
