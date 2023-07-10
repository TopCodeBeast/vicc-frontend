import Big from 'bignumber.js';
import { useMemo } from 'react';

import { CardBonus_card } from './__generated__/index.graphql';
import useRenderValue from './useRenderValue';

export const useCardBonus = (
  card: CardBonus_card,
  {
    captainBonus,
    bonusOverride,
    withTransferMalus,
    powerBreakdown,
  }: {
    captainBonus?: number | null;
    bonusOverride?: number;
    withTransferMalus?: boolean;
    powerBreakdown?: { collection: string };
  }
) => {
  const { power, powerMalusAfterTransfer } = card;
  const renderValue = useRenderValue();

  const cardBonus = useMemo(() => {
    if (typeof bonusOverride === 'number') return renderValue(bonusOverride);

    let transformedPower = new Big(power).minus(1);
    if (withTransferMalus) {
      transformedPower = transformedPower.plus(powerMalusAfterTransfer);
      if (powerBreakdown?.collection)
        transformedPower = transformedPower.minus(powerBreakdown.collection);
    }
    if (captainBonus) {
      transformedPower = transformedPower.plus(captainBonus);
    }
    return renderValue(transformedPower);
  }, [
    bonusOverride,
    renderValue,
    power,
    withTransferMalus,
    captainBonus,
    powerMalusAfterTransfer,
    powerBreakdown,
  ]);

  return cardBonus;
};

export default useCardBonus;
