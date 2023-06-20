import { useMemo } from 'react';

import { useFollowContext } from 'contexts/follow';
import { favoriteCardType, favoritePlayerType } from 'contexts/follow/Provider';
import { useSportContext } from 'contexts/sport';
import { joinFiltersWithOr } from '@sorare/core/src/lib/algolia';

type IncludeOnlyFilter = 'Card' | 'Player';

export default (onlyType?: IncludeOnlyFilter) => {
  const followContext = useFollowContext();
  const { sport } = useSportContext();

  const { favoriteCards, favoritePlayers } = followContext;
  const stringifiedFavorites = JSON.stringify({
    favoriteCards,
    favoritePlayers,
  });

  const { cardsForSport, playersForSport } = useMemo(() => {
    const {
      favoriteCards: allCards,
      favoritePlayers: allPlayers,
    }: typeof followContext = JSON.parse(stringifiedFavorites);

    return {
      cardsForSport: allCards?.filter(
        c => c.subscribableType === favoriteCardType[sport!]
      ),
      playersForSport: allPlayers?.filter(
        p => p.subscribableType === favoritePlayerType[sport!]
      ),
    };
  }, [stringifiedFavorites, sport]);

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
