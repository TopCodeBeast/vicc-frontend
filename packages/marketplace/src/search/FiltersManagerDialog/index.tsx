import { useMemo, useState } from 'react';
import {
  useInstantSearch,
  usePagination,
  useSortBy,
} from 'react-instantsearch-hooks-web';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import Option from '@sorare/core/src/components/search/Option';
import {
  AlgoliaCardIndexesNames,
  useConfigContext,
} from '@sorare/core/src/contexts/config';
import { FilterWidget } from '@sorare/core/src/lib/filters';
import { filters, sorts as sortsMessages } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import { useClearAllFilters } from '@marketplace/search/ClearAllFilters';
import useFiltersCount from '@marketplace/search/FiltersManager/useFiltersCount';

import { MobileFilterWidget } from './MobileFilterWidget';

type Props = {
  widgets: FilterWidget[];
  sorts: AlgoliaCardIndexesNames;
  open: boolean;
  onClose: () => void;
};

const messages = defineMessages({
  title: {
    id: 'FiltersManagersDialog.title',
    defaultMessage: 'Filters',
  },
});

const Centered = styled.div`
  text-align: center;
`;
const Body = styled.div`
  padding: var(--triple-unit) 0;
`;
const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
  padding: var(--unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
  }
`;

export const FiltersManagerDialog = ({
  widgets,
  sorts,
  open,
  onClose,
}: Props) => {
  const [activeWidget, setActiveWidget] = useState<FilterWidget>();
  const clearAllFilters = useClearAllFilters();
  const filtersCount = useFiltersCount();
  const { results } = useInstantSearch();
  const { algoliaCardIndexes } = useConfigContext();
  const { formatMessage } = useIntl();

  const sortItems = useMemo(
    () =>
      sorts.map(label => ({
        value: algoliaCardIndexes[label],
        label: formatMessage(sortsMessages[label]),
      })),
    [sorts, algoliaCardIndexes, formatMessage]
  );

  const { refine, currentRefinement } = useSortBy({ items: sortItems });
  const { refine: setPage } = usePagination();

  const sortWidget: FilterWidget = useMemo(
    () => ({
      key: 'sort',
      type: 'sort',
      title: (
        <Text16 bold>
          <FormattedMessage
            id="FiltersManagerDialog.sortBy"
            defaultMessage="Sort by"
          />
        </Text16>
      ),
      component: (
        <div className="FilterWidget visible">
          {sortItems.map(sortItem => (
            <div key={sortItem.value}>
              <Option
                label={sortItem.label}
                active={currentRefinement === sortItem.value}
                onClick={() => {
                  setPage(0);
                  refine(sortItem.value);
                }}
                variant="radio"
              />
            </div>
          ))}
        </div>
      ),
    }),
    [currentRefinement, refine, setPage, sortItems]
  );

  return (
    // keepMounted is needed so that Algolia keeps filtering even when filters are hidden
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      keepMounted
      onBack={() => (activeWidget ? setActiveWidget(undefined) : onClose())}
      title={
        <Centered>
          {activeWidget ? (
            activeWidget.title
          ) : (
            <Text16 bold>
              <FormattedMessage {...messages.title} />
            </Text16>
          )}
        </Centered>
      }
      body={
        <Body>
          {[sortWidget, ...widgets].map(widget => (
            <MobileFilterWidget
              key={widget.key}
              widget={widget}
              activeWidget={activeWidget}
              value={
                sortItems.find(sortItem => sortItem.value === currentRefinement)
                  ?.label
              }
              onClick={() => setActiveWidget(widget)}
            />
          ))}
        </Body>
      }
      footer={
        <ButtonsWrapper>
          <Button
            color="red"
            medium
            onClick={clearAllFilters}
            disabled={!filtersCount}
            fullWidth
          >
            <Text16>
              <FormattedMessage {...filters.clearAll} />
            </Text16>
          </Button>
          <Button onClick={onClose} medium color="blue" fullWidth>
            <FormattedMessage
              id="FiltersManagerDialog.viewResults"
              defaultMessage="Show {results, number} results"
              values={{
                results: results ? results.nbHits : 0,
              }}
            />
          </Button>
        </ButtonsWrapper>
      }
    />
  );
};

export default FiltersManagerDialog;
