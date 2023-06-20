import { useMemo } from 'react';

import { useCurrentUserContext } from 'contexts/currentUser';
import { joinFiltersWithAnd } from '@sorare/core/src/lib/algolia';

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
