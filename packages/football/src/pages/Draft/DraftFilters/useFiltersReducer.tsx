import { useReducer } from 'react';

import {
  AvailableDraftPlayersSortInput,
  RangeInput,
} from '@sorare/core/src/__generated__/globalTypes';

import {
  getSortType,
  sortOptions,
} from '@football/pages/Draft/DraftFilters/draftFilters';

/*
  AppliedFilters are the filters that are sent to the API and are responsible for the displayed player list.
  They might differ from the SelectedFilters when the user did not confirm that he wants to apply the filters (on mobile)
  or when the callbacks for applied filters are debounced.
*/
export type AppliedFilters = {
  teamSlugs: string[] | null;
  value: RangeInput | null;
  sortType: AvailableDraftPlayersSortInput | null;
  query: string | null;
};

type Range = { min: number; max: number };

type SelectedFilters = {
  teamSlugs: string[];
  value: { min: number; max: number };
  sortType: AvailableDraftPlayersSortInput;
  query: string;
};

export type State = {
  boundariesRange: Range;
  appliedFilters: AppliedFilters;
  selectedFilters: SelectedFilters;
};

export type Action =
  | {
      type: 'changeSelectedValueRange';
      payload: {
        low: number;
        high: number;
      };
    }
  | {
      type: 'changeAppliedValueRange';
      payload: {
        low: number;
        high: number;
      };
    }
  | {
      type: 'changeSelectedTeams';
      payload: string[];
    }
  | {
      type: 'changeAppliedTeams';
      payload: string[];
    }
  | {
      type: 'changeSelectedSort';
      payload: string;
    }
  | {
      type: 'changeAppliedSort';
      payload: string;
    }
  | {
      type: 'changeSelectedSearch';
      payload: string;
    }
  | {
      type: 'changeAppliedSearch';
      payload: string;
    }
  | {
      type: 'clearSearch';
      payload?: null;
    }
  | {
      type: 'applyAllSelectedFilters';
      payload?: null;
    }
  | {
      type: 'clearMobileFilters';
      payload?: null;
    };

const changeSelectedFilter = (
  state: State,
  filterType: keyof SelectedFilters,
  filterValue: SelectedFilters[keyof SelectedFilters]
) => {
  return {
    ...state,
    selectedFilters: {
      ...state.selectedFilters,
      [filterType]: filterValue,
    },
  };
};

const changeAppliedFilter = (
  state: State,
  filterType: keyof AppliedFilters,
  filterValue: AppliedFilters[keyof AppliedFilters]
) => {
  return {
    ...state,
    appliedFilters: {
      ...state.appliedFilters,
      [filterType]: filterValue,
    },
  };
};

const initialState = (
  boundariesRange: Range,
  appliedQuery?: string | null,
  selectedQuery?: string
) => ({
  boundariesRange,
  appliedFilters: {
    teamSlugs: null,
    value: null,
    sortType: sortOptions[0].sortType,
    query: appliedQuery || null,
  },
  selectedFilters: {
    teamSlugs: [],
    value: boundariesRange,
    sortType: sortOptions[0].sortType,
    query: selectedQuery || '',
  },
});

export const isRangeFilterSelected = (
  currentRange: Range,
  boundariesRange: Range
) => {
  return !(
    currentRange.min === boundariesRange.min &&
    currentRange.max === boundariesRange.max
  );
};

type Args = { boundariesRange: Range };
export const useFiltersReducer = ({ boundariesRange }: Args) => {
  return useReducer((state: State, action: Action) => {
    const { type, payload } = action;

    switch (type) {
      case 'changeSelectedValueRange': {
        const { low, high } = payload;
        return changeSelectedFilter(state, 'value', { min: low, max: high });
      }
      case 'changeAppliedValueRange': {
        const { low, high } = payload;
        if (!isRangeFilterSelected({ min: low, max: high }, boundariesRange)) {
          return changeAppliedFilter(state, 'value', null);
        }
        return changeAppliedFilter(state, 'value', { min: low, max: high });
      }
      case 'changeSelectedTeams': {
        return changeSelectedFilter(state, 'teamSlugs', payload);
      }
      case 'changeAppliedTeams': {
        if (!payload.length) {
          return changeAppliedFilter(state, 'teamSlugs', null);
        }
        return changeAppliedFilter(state, 'teamSlugs', payload);
      }
      case 'changeSelectedSort': {
        return changeSelectedFilter(state, 'sortType', getSortType(payload));
      }
      case 'changeAppliedSort': {
        return changeAppliedFilter(state, 'sortType', getSortType(payload));
      }
      case 'changeSelectedSearch': {
        return changeSelectedFilter(state, 'query', payload);
      }
      case 'changeAppliedSearch': {
        return changeAppliedFilter(state, 'query', payload || null);
      }
      case 'clearSearch': {
        if (state.appliedFilters.query || state.selectedFilters.query) {
          return {
            boundariesRange,
            appliedFilters: {
              ...state.appliedFilters,
              query: null,
            },
            selectedFilters: {
              ...state.selectedFilters,
              query: '',
            },
          };
        }
        return state;
      }
      case 'applyAllSelectedFilters': {
        const {
          selectedFilters: { teamSlugs, value, sortType, query },
        } = state;

        return {
          ...state,
          appliedFilters: {
            teamSlugs: teamSlugs.length ? teamSlugs : null,
            value: isRangeFilterSelected(value, boundariesRange) ? value : null,
            sortType,
            query: query || null,
          },
        };
      }
      case 'clearMobileFilters': {
        return initialState(
          boundariesRange,
          state.appliedFilters.query,
          state.selectedFilters.query
        );
      }
      default: {
        return state;
      }
    }
  }, initialState(boundariesRange));
};

export default useFiltersReducer;
