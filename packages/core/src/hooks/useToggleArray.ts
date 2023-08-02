import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useToggleArray = (
  setArray: Dispatch<SetStateAction<boolean[]>>,
  trail = 100
) => {
  const [newBooleanValue, setNewBooleanValue] = useState<boolean[]>([]);
  // manually implement a trail
  useEffect(() => {
    if (newBooleanValue === null) {
      return () => {};
    }
    const interval = setInterval(() => {
      setArray(currentBooleanArray => {
        const newBooleanArray = [...currentBooleanArray];
        if (
          newBooleanValue.length &&
          newBooleanValue.length !== currentBooleanArray.length
        ) {
          // eslint-disable-next-line no-console
          console.warn(
            `useToggleArray: Array should be same size as parameter. (expected: ${newBooleanValue.length}, got: ${currentBooleanArray.length})`
          );
          return [];
        }
        const index = newBooleanArray.findIndex(
          (value, i) => value !== newBooleanValue[i]
        );
        if (index < 0) {
          clearInterval(interval);
        } else {
          newBooleanArray[index] = newBooleanValue[index];
        }
        return newBooleanArray;
      });
    }, trail);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [newBooleanValue, setArray, trail]);
  return setNewBooleanValue;
};
