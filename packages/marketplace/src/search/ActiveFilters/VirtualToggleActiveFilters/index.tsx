import { useSearchCardsContext } from '@sorare/core/src/contexts/searchCards';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import { VIRTUAL_TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';

import { useMarketplaceContext } from '@marketplace/contexts/Marketplace';
import { useFormatFilterWidgetValue } from '@marketplace/hooks/search/useFormatFilterWidgetValue';

import { FilterChip } from '../FilterChip';

export const VirtualToggleActiveFilters = ({
  setVirtualToggleFilters,
}: {
  setVirtualToggleFilters: (virtualToggle: {
    [name: string]: string | string[] | boolean | undefined;
  }) => void;
}) => {
  const {
    playingNextGameweekFilter,
    favoriteFilter,
    notInLineUpFilter,
    hasCollectibleFilter,
    nonPlayableCards,
    legend,
    leagueFilter,
    promotion,
    customDecksFilter,
  } = useSearchCardsContext();
  const { trackRemoveMarketFilterChip } = useMarketplaceContext();
  const { formatFilterWidgetValue } = useFormatFilterWidgetValue();
  const { sport } = useSportContext();

  const virtualToggleFilters = [
    {
      filter: VIRTUAL_TOGGLE_FILTERS.playingNextGameweekFilter,
      condition: playingNextGameweekFilter,
      value: playingNextGameweekFilter,
    },
    {
      filter: VIRTUAL_TOGGLE_FILTERS.favoriteFilter,
      condition: favoriteFilter,
      value: favoriteFilter,
    },
    {
      filter: VIRTUAL_TOGGLE_FILTERS.notInLineupFilter,
      condition: notInLineUpFilter,
    },
    {
      filter: VIRTUAL_TOGGLE_FILTERS.nonPlayableCardsFilter,
      condition: hasCollectibleFilter && nonPlayableCards,
      value: nonPlayableCards,
    },
    {
      filter: VIRTUAL_TOGGLE_FILTERS.legendFilter,
      condition: hasCollectibleFilter && legend,
      value: legend,
    },
    {
      filter: VIRTUAL_TOGGLE_FILTERS.leagueFilter,
      condition: leagueFilter,
    },
    {
      filter: VIRTUAL_TOGGLE_FILTERS.promotedCardsFilter,
      condition: promotion,
    },
    {
      filter: VIRTUAL_TOGGLE_FILTERS.customDecksFilter,
      condition: customDecksFilter,
    },
  ];

  return (
    <>
      {virtualToggleFilters
        .filter(({ condition }) => !!condition)
        .map(virtualToggle => {
          const labels = formatFilterWidgetValue(virtualToggle.filter);
          return labels.map(label => (
            <FilterChip
              key={label}
              label={label}
              onClose={() => {
                setVirtualToggleFilters({
                  [virtualToggle.filter.name]:
                    virtualToggle.filter.defaultValue,
                });
                if (sport) {
                  trackRemoveMarketFilterChip(
                    virtualToggle.filter.trackingName,
                    virtualToggle.value?.toString() || label,
                    sport
                  );
                }
              }}
            />
          ));
        })}
    </>
  );
};
