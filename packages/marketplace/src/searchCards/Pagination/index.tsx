import { useCallback } from 'react';
import { usePagination } from 'react-instantsearch-hooks-web';

import PaginationAtom from '@sorare/core/src/atoms/navigation/Pagination';

interface Props {
  onPageChange?: () => void;
}

export const Pagination = ({ onPageChange }: Props) => {
  const { currentRefinement, nbPages, refine } = usePagination();

  const goToPage = useCallback(
    (page: number) => {
      refine(page);
      if (onPageChange) onPageChange();
    },
    [refine, onPageChange]
  );

  return (
    <PaginationAtom
      currentPage={currentRefinement}
      pages={nbPages}
      onSelect={goToPage}
    />
  );
};

export default Pagination;
