import { useCallback } from 'react';

import { AlgoliaCardIndexesName } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import { getInteractionContext } from '@sorare/core/src/lib/events';

import useLifecycle, { LIFECYCLE, Lifecycle } from './useLifecycle';

export const useMarketplaceLifecycle = () => {
  const { sport } = useSportContext();
  const { update } = useLifecycle();
  const { currentUser } = useCurrentUserContext();

  const key = `${
    sport ? sport.toLocaleLowerCase() : ''
  }_${getInteractionContext()}`;

  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;

  const updateSort = useCallback(
    (sort: AlgoliaCardIndexesName) => {
      update(LIFECYCLE.marketSorts, {
        ...lifecycle?.marketSorts,
        [key]: sort,
      });
    },
    [update, lifecycle?.marketSorts, key]
  );

  return {
    sort: lifecycle?.marketSorts?.[key],
    updateSort,
  };
};
