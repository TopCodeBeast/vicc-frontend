import { useCallback } from 'react';

import { AlgoliaCardIndexesName } from '@core/contexts/config';
// import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSportContext } from '@core/contexts/sport';
// import { getInteractionContext } from '@core/lib/events';

import useLifecycle, { LIFECYCLE, Lifecycle } from './useLifecycle';

export const useMarketplaceLifecycle = () => {
  const { sport } = useSportContext();
  const { update } = useLifecycle();
  const currentUser = undefined;// const { currentUser } = useCurrentUserContext();

  //TODO**************
  const key = 'football';// const key = `${
  //   sport ? sport.toLocaleLowerCase() : ''
  // }_${getInteractionContext()}`;

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
