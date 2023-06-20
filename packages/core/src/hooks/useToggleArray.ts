import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useToggleArray = (
  setArray: Dispatch<SetStateAction<boolean[]>>,
  trail = 100
) => {
  const [newBooleanValue, setNewBooleanValue] = useState<null | boolean>(null);
  // manually implement a trail
  useEffect(() => {
    if (newBooleanValue === null) {
      return () => {};
    }
    const interval = setInterval(() => {
      setArray(currentBooleanArray => {
        const newBooleanArray = [...currentBooleanArray];
        const index = newBooleanArray.indexOf(!newBooleanValue);
        if (index < 0) {
          clearInterval(interval);
        } else {
          newBooleanArray[index] = newBooleanValue;
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
