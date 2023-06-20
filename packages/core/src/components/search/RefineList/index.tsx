import { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import { ElementType, useMemo, useState } from 'react';
import {
  RefinementListProps,
  useInstantSearch,
  useRefinementList,
} from 'react-instantsearch-hooks-web';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useDebounce } from 'react-use';

import useEvents from '@sorare/core/src/lib/events/useEvents';

import { FilterSearchInput } from '../FilterSearchInput';
import { FilterSection } from '../FilterSection';
import SearchOption from '../Option';

interface OptionType {
  option: string;
}
interface AtomListProps {
  attribute: string;
  formatOption?: (
    value: string,
    formatMessage: (message: MessageDescriptor) => string
  ) => string;
  BeforeOption?: ElementType<OptionType>;
  AfterOption?: ElementType<OptionType>;
  searchable?: boolean;
  items: RefinementListItem[];
  refine: (value: string) => void;
  searchForItems: (q: string) => void;
  hide?: (items: RefinementListItem[]) => boolean;
  isFromSearch?: boolean;
}

export interface RefineListProps
  extends RefinementListProps,
    Omit<AtomListProps, 'items' | 'refine' | 'searchForItems'> {}

const identity = (name: string) => name;

export const AtomList = ({
  attribute,
  formatOption = identity,
  BeforeOption,
  AfterOption,
  searchable = false,
  refine,
  items,
  searchForItems,
  hide = undefined,
  isFromSearch,
}: AtomListProps) => {
  const { formatMessage } = useIntl();
  const track = useEvents();
  const [search, setSearch] = useState('');

  useDebounce(() => searchForItems(search), 300, [search]);

  const handleChange = (event: {
    target: {
      value: string;
    };
  }) => {
    setSearch(event.target.value);
  };

  const doRefine = (value: string) => {
    setSearch('');
    refine(value);
    track('Use Market Filter', {
      filterName: attribute,
      filterValue: value,
    });
  };

  const hidden = !isFromSearch && (!items.length || hide?.(items));

  return (
    <FilterSection
      hidden={hidden}
      search={
        searchable ? (
          <FilterSearchInput handleChange={handleChange} value={search} />
        ) : null
      }
    >
      {items.map(item => (
        <SearchOption
          variant="checkbox"
          key={item.value}
          label={formatOption(item.label, formatMessage)}
          before={BeforeOption ? <BeforeOption option={item.label} /> : null}
          after={AfterOption && <AfterOption option={item.label} />}
          onClick={() => doRefine(item.value)}
          active={item.isRefined}
          count={item.count}
        />
      ))}
    </FilterSection>
  );
};

export const RefineList = (props: RefineListProps) => {
  const { attribute } = props;
  const { items, refine, searchForItems, isFromSearch } =
    useRefinementList(props);
  const { indexUiState } = useInstantSearch();

  const allItems = useMemo(() => {
    const uiRefinements = indexUiState.refinementList?.[attribute] || [];

    const optimisticRefinedItems = items.map(item => ({
      ...item,
      // we rather consider the refinement state from the UI
      // so that we don't rely on the Algolia answer to come back to reflect the checkbox state
      isRefined: !!uiRefinements.find(v => v === item.value),
    }));

    // if you load the page with more refinements than the actual
    // number of facet values retrieved by the widget, we need to
    // append them to the list, assuming counts of 0 (as we don't know the count - will be hidden).
    const extraItems = uiRefinements
      .map(v =>
        items.find(item => item.value === v)
          ? undefined
          : {
              label: v,
              value: v,
              isRefined: true,
              count: 0,
            }
      )
      .filter(Boolean);

    return [...optimisticRefinedItems, ...extraItems];
  }, [attribute, indexUiState.refinementList, items]);

  return (
    <AtomList
      {...props}
      refine={refine}
      items={allItems}
      searchForItems={searchForItems}
      isFromSearch={isFromSearch}
    />
  );
};

export default RefineList;
