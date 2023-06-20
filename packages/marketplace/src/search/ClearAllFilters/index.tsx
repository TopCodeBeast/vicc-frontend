import { useCallback } from 'react';
import { useClearRefinements } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { useSearchCardsContext } from '@sorare/core/src/contexts/searchCards';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { filters } from '@sorare/core/src/lib/glossary';

import useFiltersCount from '@sorare/marketplace/src/search/FiltersManager/useFiltersCount';

export const useClearAllFilters = () => {
  const track = useEvents();
  const { sport } = useSportContext();
  const filtersCount = useFiltersCount();
  const { refine: clearRefinements } = useClearRefinements({
    // this is required to also clear the query string
    excludedAttributes: [],
  });
  const { clearFilters } = useSearchCardsContext();

  return useCallback(() => {
    if (sport) {
      track('Clear Market Filters', {
        filtersCount,
      });
    }
    clearFilters();
    clearRefinements();
  }, [clearFilters, clearRefinements, filtersCount, sport, track]);
};

export const ClearAllFilters = () => {
  const clearAllFilters = useClearAllFilters();

  const onClick = () => {
    clearAllFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button onClick={onClick} medium color="darkGray">
      <FormattedMessage {...filters.clearAll} />
    </Button>
  );
};

export default ClearAllFilters;
