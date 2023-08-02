import { useMemo } from 'react';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import { joinFiltersWithAnd } from '@core/lib/algolia';

export const useNotInLineupFilterValue = () => {
  const { currentUser } = useCurrentUserContext();

  const notInLineupFilterValue = useMemo(
    () =>
      currentUser
        ? `(${joinFiltersWithAnd(
            currentUser.blockchainCardsInLineups.map(
              slug => `NOT objectID:${slug}`
            )
          )} AND NOT rarity:common)`
        : '',
    [currentUser]
  );

  return notInLineupFilterValue;
};
