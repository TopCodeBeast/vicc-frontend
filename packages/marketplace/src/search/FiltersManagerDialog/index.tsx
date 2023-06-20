import { useMemo, useState } from 'react';
import {
  useInstantSearch,
  usePagination,
  useSortBy,
} from 'react-instantsearch-hooks-web';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import DialogContentWithNavigation from '@sorare/core/src/atoms/layout/DialogContentWithNavigation';
import { Text16 } from '@sorare/core/src/atoms/typography';
import Option from '@sorare/core/src/components/search/Option';
import {
  AlgoliaCardIndexesNames,
  useConfigContext,
} from '@sorare/core/src/contexts/config';
import { FilterWidget } from '@sorare/core/src/lib/filters';
import { filters, sorts as sortsMessages } from '@sorare/core/src/lib/glossary';

import { useClearAllFilters } from '@sorare/marketplace/src/search/ClearAllFilters';
import useFiltersCount from '@sorare/marketplace/src/search/FiltersManager/useFiltersCount';

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
      hideCloseButton
      noMargin
      keepMounted
    >
      <DialogContentWithNavigation
        title={
          activeWidget ? (
            activeWidget.title
          ) : (
            <Text16 bold>
              <FormattedMessage {...messages.title} />
            </Text16>
          )
        }
        onBackButton={() =>
          activeWidget ? setActiveWidget(undefined) : onClose()
        }
        stickyHeader
        footer={
          <Button onClick={onClose} fullWidth medium color="blue">
            <FormattedMessage
              id="FiltersManagerDialog.viewResults"
              defaultMessage="Show {results, number} results"
              values={{
                results: results ? results.nbHits : 0,
              }}
            />
          </Button>
        }
        right={
          <Button
            color="transparent"
            compact
            onClick={clearAllFilters}
            disabled={!filtersCount}
          >
            <Text16>
              <FormattedMessage {...filters.clearAll} />
            </Text16>
          </Button>
        }
        noPadding
      >
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
      </DialogContentWithNavigation>
    </Dialog>
  );
};

export default FiltersManagerDialog;
