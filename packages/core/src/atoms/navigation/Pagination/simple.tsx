import {
  faAngleLeft,
  faAngleRight,
  faChevronDoubleLeft,
  faChevronDoubleRight,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Bold from '@sorare/core/src/atoms/typography/Bold';

type Props = {
  currentPage: number;
  pages: number;
  onSelect: (index: number) => void;
  inputPagination?: boolean;
};

const Input = styled.input`
  display: inline-flex;
  border: 1px solid var(--c-neutral-300);
  padding: var(--unit);
  border-radius: var(--unit);
  min-width: 60px;
  font-size: inherit;
  color: inherit;
`;
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--double-unit);
  align-items: center;
  color: var(--c-neutral-600);
`;
const ArrowButton = styled.button`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: inherit;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
const PageInfo = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

export const Pagination = ({ currentPage, pages, onSelect }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<any>(null);
  const [page, setPage] = useState(currentPage);
  const { formatMessage } = useIntl();
  const isValidPage = (newPage: number) => newPage >= 0 && newPage < pages;
  const selectInput = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };
  const onPageChange = (newPage: number) => {
    if (isValidPage(newPage)) {
      onSelect(newPage);
    } else {
      selectInput();
    }
  };

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  if (pages <= 1) return null;

  return (
    <PaginationWrapper>
      <ArrowButton
        onClick={() => onSelect(0)}
        disabled={currentPage === 0}
        type="button"
      >
        <FontAwesomeIcon icon={faChevronDoubleLeft} />
      </ArrowButton>
      <ArrowButton
        onClick={() => onSelect(currentPage - 1)}
        type="button"
        disabled={currentPage <= 0}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </ArrowButton>
      <PageInfo>
        <Input
          min={1}
          max={pages}
          type="number"
          ref={inputRef}
          inputMode="numeric"
          pattern="[0-9]*"
          value={page + 1}
          onFocus={selectInput}
          onChange={e => {
            const newPage = +e.target.value - 1;
            if (newPage <= pages) {
              setPage(newPage);
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => {
                onPageChange(newPage);
              }, 150);
            }
          }}
        />
        <span>
          {formatMessage(
            {
              id: 'pagination.of',
              defaultMessage: 'of <b>{pages}</b>',
            },
            { pages, b: Bold }
          )}
        </span>
      </PageInfo>
      <ArrowButton
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
        disabled={currentPage >= pages - 1}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </ArrowButton>
      <ArrowButton
        onClick={() => onSelect(pages - 1)}
        disabled={currentPage === pages - 1}
        type="button"
      >
        <FontAwesomeIcon icon={faChevronDoubleRight} />
      </ArrowButton>
    </PaginationWrapper>
  );
};

export default Pagination;
