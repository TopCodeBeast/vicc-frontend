import { faCaretDown, faCaretUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import { LinkBox, LinkOther } from '@core/atoms/navigation/Box';
import { theme } from '@core/style/theme';

const Header = styled.header`
  display: none;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: grid;
    grid-template-columns: var(--columns);
    grid-template-areas: var(--areas);
    border-bottom: 1px solid var(--c-neutral-300);
    grid-gap: var(--unit);
    .dark-theme & {
      padding: var(--unit);
      border-bottom: none;
      row-gap: 0;
    }
  }
`;
export const Line = styled(LinkBox)`
  display: grid;
  align-items: center;
  grid-template-columns: var(--columns);
  grid-template-areas: var(--areas);
  column-gap: var(--unit);
  row-gap: var(--half-unit);
  overflow: auto;
  padding: var(--double-unit) 0;
  border-bottom: 1px solid var(--c-neutral-300);
  .dark-theme & {
    padding: var(--unit);
    background-color: var(--c-neutral-200);
    margin-bottom: var(--unit);
    border-radius: var(--unit);
    border-bottom: none;
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    overflow: visible;
    &:hover,
    &:focus-within {
      border-color: transparent;
      &::before {
        position: absolute;
        inset: 0 calc(var(--unit) * -1);
        border-radius: var(--double-unit);
        background: var(--c-neutral-300);
        content: '';
        z-index: -1;
        max-width: 100vw;
      }
      .dark-theme & {
        background: var(--c-neutral-300);
        &::before {
          content: unset;
        }
      }
    }
  }
`;
type Cell = {
  area: string;
  hideOnDesktop?: boolean;
  showOnDesktop?: boolean;
  align?: 'right' | 'left';
};
export const Cell = styled.article<Cell>`
  grid-area: ${({ area }) => area};
  display: ${({ showOnDesktop }) => (showOnDesktop ? 'none' : 'flex')};
  align-items: center;
  justify-content: ${({ align = 'left' }) => align};
  gap: var(--half-unit);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'flex')};
  }
`;

export const CellLink = styled(LinkOther)`
  &:focus,
  &:hover {
    color: inherit;
    &::before {
      background-color: var(--c-neutral-300);
    }
  }
`;

const alignToFlex = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const HeaderCell = styled.div<{ align: 'left' | 'center' | 'right' }>`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
  width: 100%;
  padding: var(--unit) 0;
  font: var(--t-12);
  font-weight: var(--t-bold);
  color: var(--c-neutral-800);
  height: 100%;
  justify-content: ${({ align }) => alignToFlex[align]};
`;

type SortButtonType = {
  hideIcon?: boolean;
  align: 'left' | 'center' | 'right';
};
const SortButton = styled(HeaderCell).attrs({
  as: 'button',
  type: 'button',
})<SortButtonType>`
  cursor: pointer;
  &:focus-visible {
    text-decoration: underline;
  }
  svg {
    opacity: ${({ hideIcon }) => (hideIcon ? 0 : 1)};
  }
  &:hover,
  &:focus-visible {
    svg {
      opacity: ${({ hideIcon }) => (hideIcon ? 0.5 : 1)};
    }
  }
`;

export type TableHeader = {
  id: string;
  cell?: string;
  title?: string;
  align?: 'left' | 'center' | 'right';
}[];
type Props = {
  defaultSortBy?: { id: string; descending: boolean };
  rows: {
    header: TableHeader;
    body: ReactNode;
  };
  onSortChange?: (sortBy?: { id: string; descending: boolean }) => void;
};
export const Table = ({
  defaultSortBy,
  rows,
  onSortChange,
  ...rest
}: Props) => {
  const { header, body } = rows;
  const [sortBy, setSortBy] = useState(defaultSortBy);

  const MaybeSortableHeader = onSortChange ? SortButton : HeaderCell;
  return (
    <section {...rest}>
      <Header>
        {header.map(({ cell, title, id, align = 'left' }) => {
          const isCurrentFilter = id === sortBy?.id;
          const descending = sortBy?.descending;
          return (
            <article key={id}>
              {cell && (
                <MaybeSortableHeader
                  hideIcon={!isCurrentFilter}
                  title={title}
                  align={align}
                  onClick={() => {
                    if (!onSortChange) {
                      return;
                    }
                    const sortByValue = {
                      id,
                      descending: !(isCurrentFilter && descending),
                    };
                    setSortBy(sortByValue);
                    onSortChange(sortByValue);
                  }}
                >
                  {cell}
                  {onSortChange && (
                    <FontAwesomeIcon
                      icon={
                        !isCurrentFilter || descending ? faCaretDown : faCaretUp
                      }
                    />
                  )}
                </MaybeSortableHeader>
              )}
            </article>
          );
        })}
      </Header>
      {body}
    </section>
  );
};
