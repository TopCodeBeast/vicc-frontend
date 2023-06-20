import { useCallback, useState } from 'react';

import { local as localStorage } from '@sorare/core/src/lib/storage';

export const STORAGE = {
  lobby: {
    sortFilterPreference: 'lobby__sortFilterPreference',
  },
  sawDraftTuto: 'sawDraftTuto',
  sawComposeTeamCongrats: 'sawComposeTeamCongrats',
  sawMarketplaceOnboarding: 'sawMarketplaceOnboarding',
  selectedPlayers: 'selectedPlayers',
  leaderboardMode: 'leaderboardMode',
  inviteCode: 'invite-code',
} as const;

const getInitialState = <T>(
  key: string | undefined,
  initialValue: T | (() => T)
) => {
  const initialValueToUse =
    initialValue instanceof Function ? initialValue() : initialValue;

  if (!(localStorage && key)) {
    return initialValueToUse;
  }
  try {
    // Get from local storage by key
    const item = localStorage.getItem(key);

    // Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : initialValueToUse;
  } catch (error) {
    // If error also return initialValue
    return initialValueToUse;
  }
};

export default function useLocalStorage<T>(
  key: string | undefined,
  initialValue: T | (() => T)
): [T, (newValue: T | ((curValue: T) => T)) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() =>
    getInitialState<T>(key, initialValue)
  );

  // To avoid the useEffect infinite loops pitfall,
  // We can use the idiomatic way of doing GetDerivedStateFromProps for hooks
  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  const [stateKey, setStateKey] = useState(key);
  if (stateKey !== key) {
    setStateKey(key);
    setStoredValue(getInitialState<T>(key, initialValue));
  }

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((curValue: T) => T)) => {
      // Allow value to be a function so we have same API as useState
      setStoredValue(currentValue => {
        const newValue =
          value instanceof Function ? value(currentValue) : value;
        if (localStorage && key) {
          try {
            // Save to local storage
            localStorage.setItem(key, JSON.stringify(newValue));
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
              `Failed persisting value of ${key} to local storage: ${e}`
            );
          }
        }
        return newValue;
      });
    },
    [key]
  );
  const removeItem = useCallback(() => {
    if (key) {
      localStorage.removeItem(key);
      setValue(initialValue);
    }
  }, [key, setValue, initialValue]);

  return [storedValue, setValue, removeItem];
}
