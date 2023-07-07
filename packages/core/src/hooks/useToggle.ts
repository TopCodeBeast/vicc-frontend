import { useCallback, useState } from 'react';

export default (
  defaultValue: boolean
): [boolean, () => void, (val: boolean) => void] => {
  const [value, setValue] = useState(defaultValue);
  const toggleValue = useCallback(() => setValue(val => !val), [setValue]);

  return [value, toggleValue, setValue];
};
