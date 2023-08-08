import { Sport } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import { useLocalStorageKey } from './useLocalStorageKey';

export const useOnboardingInProgress = (sport: Sport) => {
  const { currentUser } = useCurrentUserContext();
  // we need to look at the actual local storage key
  // because `useLocalStorage` is not a central store.
  const key = useLocalStorageKey(sport, currentUser?.id);
  const rawState = localStorage.getItem(key);
  if (!rawState) return false;
  try {
    const state = JSON.parse(rawState);
    return state.step > 0;
  } catch (e: any) {
    localStorage.removeItem(key);
    return false;
  }
};
