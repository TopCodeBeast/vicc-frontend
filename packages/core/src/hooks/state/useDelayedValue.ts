import { useEffect, useState } from 'react';

const useDelayedValue = <T>(value: T, delay = 400) => {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedValue(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return delayedValue;
};

export default useDelayedValue;
