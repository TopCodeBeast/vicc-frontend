import useLocalStorage from '@sorare/core/src/hooks/useLocalStorage';

const useHideContentUnit = () => {
  const [hiddenUnits, setHiddenUnits] = useLocalStorage<string[]>(
    'vicc5/Home/OverView/hiddenContentUnits',
    []
  );

  return {
    hiddenUnits,
    hide: (unitId: string) => {
      setHiddenUnits(prev => [...new Set([...prev, unitId])]);
    },
  };
};

export default useHideContentUnit;
