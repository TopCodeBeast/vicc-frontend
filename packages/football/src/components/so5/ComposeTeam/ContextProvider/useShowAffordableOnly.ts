import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { BenchFilters } from '@football/components/so5/ComposeTeam/Context';
import { MAX_CARD_VALUE } from '@football/components/so5/ComposeTeam/responsive/BenchFilter/FilterContent';
import { EditableLineup } from '@football/lib/so5';

import { ContextProvider_so5Lineup } from './__generated__/index.graphql';

type ContextProvider_so5Lineup_so5Appearances_card =
  ContextProvider_so5Lineup['so5Appearances'][number]['card'];

const useShowAffordableOnly = ({
  lineup,
  setFilters,
  fifteenGameAverageTotalLimit,
}: {
  lineup: EditableLineup<ContextProvider_so5Lineup_so5Appearances_card>;
  setFilters: Dispatch<SetStateAction<BenchFilters>>;
  fifteenGameAverageTotalLimit: number | null | undefined;
}): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [showAffordableOnly, setShowAffordableOnly] = useState(false);

  const totalFifteenAverageScore = useMemo(
    () =>
      Object.values(lineup).reduce((acc, cur) => {
        return (cur.card?.lastFifteenVicc5AverageScore || 0) + acc;
      }, 0),
    [lineup]
  );
  useEffect(() => {
    if (
      showAffordableOnly &&
      typeof fifteenGameAverageTotalLimit === 'number'
    ) {
      const remainingPoints =
        fifteenGameAverageTotalLimit - totalFifteenAverageScore;
      setFilters(f => ({
        ...f,
        lastFifteenVicc5AverageScore:
          remainingPoints >= MAX_CARD_VALUE
            ? undefined
            : {
                min: 0,
                max: Math.max(0, remainingPoints),
              },
      }));
    }
  }, [
    totalFifteenAverageScore,
    showAffordableOnly,
    fifteenGameAverageTotalLimit,
    setFilters,
  ]);
  useEffect(() => {
    if (!showAffordableOnly) {
      setFilters(f => ({
        ...f,
        lastFifteenVicc5AverageScore: undefined,
      }));
    }
  }, [showAffordableOnly, setFilters]);

  return [showAffordableOnly, setShowAffordableOnly];
};

export default useShowAffordableOnly;
