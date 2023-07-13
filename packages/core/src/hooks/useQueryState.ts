import { useCallback } from 'react';

import { State, useQueryStrings } from './useQueryStrings';
import useUpdateQueryString from './useUpdateQueryString';

export const useQueryState = <T extends State>(
  state: T
): [T, (newState: ((state: T) => T) | T) => void] => {
  const qs = useQueryStrings(state);
  const updateQueryString = useUpdateQueryString();

  const setState = useCallback(
    function setState(newState: ((s: T) => T) | T): void {
      const newValue = newState instanceof Function ? newState(qs) : newState;
      updateQueryString(newValue);
    },
    [qs, updateQueryString]
  );

  return [qs, setState];
};
