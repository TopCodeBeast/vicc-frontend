import { isFuture, parseISO } from 'date-fns';
import { useMemo } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

const useTradeButtonVisible = (userSlug: string) => {
  const { currentUser } = useCurrentUserContext();
  return useMemo(() => {
    if (!currentUser) {
      return false;
    }

    const { blockedUntil } = currentUser;
    const currentlyBlocked = blockedUntil && isFuture(parseISO(blockedUntil));
    if (currentlyBlocked) {
      return false;
    }

    if (currentUser.slug === userSlug) return false;

    return true;
  }, [currentUser, userSlug]);
};

export default useTradeButtonVisible;
