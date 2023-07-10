import { useMemo } from 'react';
import { usePagination, useSortBy } from 'react-instantsearch-hooks-web';
import { useIntl } from 'react-intl';

import RadioGroup from '@sorare/core/src/atoms/inputs/RadioGroup';
import FilterInDropdown from '@sorare/core/src/components/FilterInDropdown';
import {
  AlgoliaCardIndexesName,
  AlgoliaCardIndexesNames,
  useConfigContext,
} from '@sorare/core/src/contexts/config';
import { useMarketplaceLifecycle } from '@sorare/core/src/hooks/useMarketplaceLifecycle';
import { sorts } from '@sorare/core/src/lib/glossary';

interface Props {
  indexes: AlgoliaCardIndexesNames;
}

const SortCards = ({ indexes }: Props) => {
  const { algoliaCardIndexes } = useConfigContext();
  const { formatMessage } = useIntl();
  const { refine: setPage } = usePagination();

  const { updateSort } = useMarketplaceLifecycle();

  const items = useMemo(
    () =>
      indexes.map(label => ({
        value: algoliaCardIndexes[label],
        label: formatMessage(sorts[label]),
        index: label,
      })),
    [indexes, algoliaCardIndexes, formatMessage]
  );

  const { refine, currentRefinement } = useSortBy({ items });
  const selectedSort = items.find(i => i.value === currentRefinement);

  return (
    <FilterInDropdown buttonLabel={selectedSort?.label}>
      {({ closeDropdown }) => (
        <RadioGroup
          options={items}
          value={selectedSort?.value}
          name="draft-sort-type"
          onChange={(value: string) => {
            const selected = items.find(i => i.value === value);
            if (selected) {
              setPage(0);
              refine(selected.value);
              updateSort(selected.index as AlgoliaCardIndexesName);
              setTimeout(() => closeDropdown(), 100);
            }
          }}
        />
      )}
    </FilterInDropdown>
  );
};

export default SortCards;
