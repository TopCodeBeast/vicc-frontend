import { useMemo } from 'react';

import { useFollowContext } from '@core/contexts/follow';
import { favoriteCardType } from '@core/contexts/follow/Provider';
import { useSportContext } from '@core/contexts/sport';
import { joinFiltersWithOr } from '@core/lib/algolia';

type IncludeOnlyFilter = 'Card' | 'Player';

export default (onlyType?: IncludeOnlyFilter) => {
  const followContext = useFollowContext();
  const { sport } = useSportContext();

  const { favoriteCardsBySport, favoritePlayersBySport } = followContext;

  const cardsForSport = favoriteCardsBySport?.[sport!];
  const playersForSport = favoritePlayersBySport?.[sport!];

  const showCards = !onlyType || onlyType === 'Card';
  const showPlayers = !onlyType || onlyType === 'Player';

  const favoriteFilterValue = useMemo(() => {
    // by construction it can only be both are undefined or none are
    if (!cardsForSport || !playersForSport) {
      return null;
    }

    const filterValue = joinFiltersWithOr([
      // objectID is only football for football
      ...(showCards
        ? cardsForSport
            .filter(c => c.subscribableType === favoriteCardType.FOOTBALL)
            .map(c => `objectID:${c.subscribableSlug}`)
        : []),
      // for other sports we use the slug
      ...(showCards
        ? cardsForSport
            .filter(c => c.subscribableType !== favoriteCardType.FOOTBALL)
            .map(c => `slug:${c.subscribableSlug}`)
        : []),
      // any sport
      ...(showPlayers
        ? playersForSport.map(p => `player.slug:${p.subscribableSlug}`)
        : []),
    ]);

    return filterValue && `(${filterValue})`;
  }, [cardsForSport, playersForSport, showCards, showPlayers]);

  return favoriteFilterValue;
};
