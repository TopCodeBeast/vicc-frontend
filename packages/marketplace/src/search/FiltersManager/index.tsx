import { Collapse } from '@material-ui/core';
import classNames from 'classnames';
import { memo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FilterAccordion } from '@sorare/core/src/atoms/layout/Accordion';
import { Text16 } from '@sorare/core/src/atoms/typography';
import useLocalStorageToggle from '@sorare/core/src/hooks/useLocalStorageToggle';
import { FilterSeparator, FilterWidget } from '@sorare/core/src/lib/filters';

import ClearAllFilters from '../ClearAllFilters';

export type Props = {
  filters: (FilterWidget | FilterSeparator)[];
  advancedFilters?: (FilterWidget | FilterSeparator)[];
  skipClearAllButton?: boolean;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;
const FilterRoot = styled.div`
  &:not(:has(.FilterWidget.visible)) {
    display: none;
  }
`;
const Separator = styled.div`
  border-top: 1px solid var(--c-neutral-200);
`;
const Footer = styled.div`
  &.withBorder {
    border-top: 1px solid var(--c-neutral-200);
  }
  padding: var(--double-unit) 0;
`;

const messages = defineMessages({
  showMore: {
    id: 'FiltersManager.showMoreFilters',
    defaultMessage: 'Show more filters',
  },
  showLess: {
    id: 'FiltersManager.showLessFilters',
    defaultMessage: 'Show less filters',
  },
});

const Filter = ({
  filter,
  noBorder,
}: {
  filter: FilterWidget | FilterSeparator;
  noBorder?: boolean;
}) => {
  if (filter.type === 'separator') {
    return <Separator />;
  }

  return (
    <FilterRoot key={filter.key}>
      <FilterAccordion
        title={filter.title}
        startsOpen={filter.accordionOptions?.startsOpen}
        noBorder={noBorder}
      >
        {filter.component}
      </FilterAccordion>
    </FilterRoot>
  );
};

const Filters = ({
  filters,
}: {
  filters: (FilterWidget | FilterSeparator)[];
}) => {
  return (
    <>
      {filters.map((filter, i) => {
        const key = filter.type === 'separator' ? `separator-${i}` : filter.key;
        const followedWithSeparator = filters[i + 1]?.type === 'separator';

        return (
          <Filter key={key} filter={filter} noBorder={followedWithSeparator} />
        );
      })}
    </>
  );
};

export const FiltersManager = ({
  filters,
  advancedFilters,
  skipClearAllButton,
}: Props) => {
  const [showAdvancedFilters, toggleShowAdvancedFilters] =
    useLocalStorageToggle('SHOW_ADVANCED_FILTERS', false);

  const [lastFilter] = filters.slice(-1);
  const lastAdvancedFilter = advancedFilters
    ? advancedFilters.slice(-1)[0]
    : null;

  const lastItemIsSeparator =
    ((!showAdvancedFilters || !advancedFilters) &&
      lastFilter.type === 'separator') ||
    (showAdvancedFilters &&
      lastAdvancedFilter &&
      lastAdvancedFilter.type === 'separator');

  return (
    <Root>
      <div>
        <Filters filters={filters} />
        {advancedFilters && (
          <Collapse in={showAdvancedFilters}>
            <Filters filters={advancedFilters} />
          </Collapse>
        )}
      </div>
      {(!!advancedFilters || !skipClearAllButton) && (
        <Footer className={classNames({ withBorder: !lastItemIsSeparator })}>
          {advancedFilters && (
            <button type="button" onClick={toggleShowAdvancedFilters}>
              <Text16 color="var(--c-brand-300)">
                <FormattedMessage
                  {...(showAdvancedFilters
                    ? messages.showLess
                    : messages.showMore)}
                />
              </Text16>
            </button>
          )}
          {!skipClearAllButton && <ClearAllFilters />}
        </Footer>
      )}
    </Root>
  );
};

export default memo(FiltersManager);
