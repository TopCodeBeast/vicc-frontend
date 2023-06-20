import { useCallback } from 'react';

import useLocalStorage from './useLocalStorage';

export default (key: string, defaultValue: boolean): [boolean, () => void] => {
  const [value, setValue] = useLocalStorage(key, defaultValue);
  const toggleValue = useCallback(() => setValue(val => !val), [setValue]);

  return [value, toggleValue];
};
