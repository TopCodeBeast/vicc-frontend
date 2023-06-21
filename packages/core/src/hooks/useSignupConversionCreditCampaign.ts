import { isPast, parseISO } from 'date-fns';

import {
  ConversionCreditCampaign,
  ConversionCreditCampaignStatus,
  Sport,
} from '@core/__generated__/globalTypes';
import { useSportContext } from '@core/contexts/sport';
import useMonetaryAmount from '@core/hooks/useMonetaryAmount';

import { SESSION_STORAGE, useSessionStorage } from './useSessionStorage';

export const useSignupConversionCreditCampaign = ():
  | (ConversionCreditCampaign & { sport: Sport })
  | undefined => {
  const { sport } = useSportContext();
  const { getValue: getSignupPromo } = useSessionStorage(
    SESSION_STORAGE.signupPromo
  );
  const { toMonetaryAmount } = useMonetaryAmount();

  const campaign = getSignupPromo();
  if (
    !campaign?.sport ||
    campaign?.sport !== sport ||
    campaign?.status !== ConversionCreditCampaignStatus.ACTIVE ||
    isPast(parseISO(campaign?.endDate))
  )
    return undefined;

  const { maxDiscount } = campaign;
  const amounts = toMonetaryAmount(maxDiscount);

  return {
    ...campaign,
    maxDiscount: {
      eur: amounts.eur,
      usd: amounts.usd,
      gbp: amounts.gbp,
      wei: amounts.wei,
    },
  } as ConversionCreditCampaign & {
    sport: Sport;
    maxDiscount: {
      eur: number;
      usd: number;
      gbp: number;
      wei: string;
    };
  };
};
