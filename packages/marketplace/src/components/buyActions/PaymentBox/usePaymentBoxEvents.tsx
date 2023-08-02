import { useCallback } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { fromWei } from '@sorare/core/src/lib/wei';

type Props = {
  sport: Sport;
  monetaryAmount: MonetaryAmountOutput;
  fiatPayment: boolean;
};

const usePaymentBoxEvents = ({ monetaryAmount, fiatPayment, sport }: Props) => {
  const track = useEvents();

  const trackConfirmPurchaseForm = useCallback(() => {
    track('Confirm Purchase Form', {
      ethAmount: fromWei(monetaryAmount.wei),
      eurAmount: monetaryAmount.eur,
      fiatPayment,
      sport,
    });
  }, [fiatPayment, monetaryAmount.eur, monetaryAmount.wei, sport, track]);

  return {
    trackConfirmPurchaseForm,
  };
};

export default usePaymentBoxEvents;
