import { useSportContext } from '@sorare/core/src/contexts/sport';

import { useMarketplaceContext } from 'contexts/Marketplace';
import { useFormatFilterWidgetValue } from 'hooks/search/useFormatFilterWidgetValue';

import { FilterChip } from '../FilterChip';
import { RefinementItem } from '../types';

export const ListActiveFilter = ({ item }: { item: RefinementItem }) => {
  const { trackRemoveMarketFilterChip } = useMarketplaceContext();
  const { sport } = useSportContext();
  const { formatFilterWidgetValue } = useFormatFilterWidgetValue();

  const labels = formatFilterWidgetValue(item);

  return (
    <>
      {item.refinements.map((refinement, i) => {
        const label = labels[i];

        return (
          <FilterChip
            key={refinement.label}
            label={label}
            onClose={() => {
              item.refine(refinement);
              if (sport) {
                trackRemoveMarketFilterChip(item.attribute, label, sport);
              }
            }}
          />
        );
      })}
    </>
  );
};
