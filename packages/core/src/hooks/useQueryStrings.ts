import qs from 'qs';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export type State = {
  [key: string]: string | undefined;
};
export function useQueryStrings<T extends State>(state: T): T {
  const location = useLocation();

  return useMemo(() => {
    const newState: any = {};
    const parsedQs = qs.parse(location.search.slice(1));
    Object.keys(state).forEach(f => {
      const currentValue = state[f];
      newState[f] = (parsedQs[f] || currentValue)?.toString();
    });
    return newState;
  }, [state, location.search]);
}
