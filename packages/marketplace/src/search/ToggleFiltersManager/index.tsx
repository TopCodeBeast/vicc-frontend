import { FilterButton } from '@sorare/core/src/components/search/FilterButton';

import useFiltersCount from '@sorare/marketplace/src/search/FiltersManager/useFiltersCount';

interface ToggleFiltersManagerProps {
  toggleFilters: () => void;
}

export const ToggleFiltersManager = ({
  toggleFilters,
}: ToggleFiltersManagerProps) => {
  const filtersCount = useFiltersCount();

  return <FilterButton onClick={toggleFilters} filtersCount={filtersCount} />;
};

export default ToggleFiltersManager;
