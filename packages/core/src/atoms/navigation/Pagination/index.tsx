import {
  Pagination as MuiPagination,
  PaginationItem as MuiPaginationItem,
} from '@material-ui/lab';

import useScreenSize from '@core/hooks/device/useScreenSize';

import Simple from './simple';

type Props = {
  currentPage: number;
  pages: number;
  onSelect: (index: number) => void;
  inputPagination?: boolean;
};

export const Pagination = ({
  currentPage,
  pages,
  onSelect,
  inputPagination,
}: Props) => {
  const { up: isTablet } = useScreenSize('tablet');

  if (pages <= 1) return null;

  return inputPagination && !isTablet ? (
    <Simple currentPage={currentPage} pages={pages} onSelect={onSelect} />
  ) : (
    <MuiPagination
      page={currentPage + 1}
      count={pages}
      onChange={(_, pageNumber) => {
        onSelect(pageNumber - 1);
      }}
      renderItem={item => <MuiPaginationItem {...item} />}
    />
  );
};

export default Pagination;
