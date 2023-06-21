import Big from 'bignumber.js';
import { useMemo, useState } from 'react';

import {
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { useConversionCredit } from '@sorare/core/src/hooks/useConversionCredit';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';

type Props = {
  canUseConversionCredit: boolean;
  isFiat: boolean;
  sport: Sport;
  monetaryAmount: MonetaryAmountOutput;
  creditCardFee: number;
  activeFee: boolean;
  referenceCurrency: SupportedCurrency;
};
export const useCalculateAmounts = ({
  isFiat,
  sport,
  monetaryAmount,
  creditCardFee,
  activeFee,
  canUseConversionCredit,
  referenceCurrency,
}: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const indexableReferenceCurrency = getMonetaryAmountIndex(referenceCurrency);

  const conversionCredit = useConversionCredit(sport);

  const [usingConversionCredit, setUsingConversionCredit] = useState<boolean>(
    canUseConversionCredit && !!conversionCredit
  );

  const conversionCreditId = usingConversionCredit
    ? conversionCredit?.id
    : undefined;

  const percentageDiscount =
    (usingConversionCredit && conversionCredit?.percentageDiscount) || 0;

  const readablePercentageDiscount = `${percentageDiscount * 100}%`;
  const maxDiscountMonetary = useMemo(
    () =>
      conversionCredit?.maxDiscount || {
        eur: 0,
        usd: 0,
        gbp: 0,
        wei: '0',
      },
    [conversionCredit?.maxDiscount]
  );

  const conversionCreditMonetaryAmount = useMemo(
    () =>
      Object.fromEntries(
        (['eur', 'usd', 'gbp', 'wei'] as const).map(currency => {
          const bigAmount = Big.minimum(
            new Big(monetaryAmount[currency]).multipliedBy(percentageDiscount),
            new Big(maxDiscountMonetary[currency])
          ).multipliedBy(-1);
          return [
            currency,
            currency === 'wei' ? bigAmount.toString() : bigAmount.toNumber(),
          ];
        })
      ) as MonetaryAmountOutput,
    [maxDiscountMonetary, monetaryAmount, percentageDiscount]
  );

  const fees = useMemo(
    () => (activeFee ? creditCardFee : 0),
    [activeFee, creditCardFee]
  );

  const feesMonetaryAmount = useMemo(
    () =>
      toMonetaryAmount({
        [indexableReferenceCurrency]: new Big(
          monetaryAmount[indexableReferenceCurrency]
        )
          .multipliedBy(fees)
          .toString(),
        referenceCurrency,
      }),
    [
      fees,
      indexableReferenceCurrency,
      monetaryAmount,
      referenceCurrency,
      toMonetaryAmount,
    ]
  );
  const totalMonetaryAmount = useMemo(() => {
    const total = new Big(monetaryAmount[indexableReferenceCurrency]).plus(
      conversionCreditMonetaryAmount[indexableReferenceCurrency]
    );
    const totalWithFees = total.plus(
      feesMonetaryAmount[indexableReferenceCurrency]
    );
    return toMonetaryAmount({
      [indexableReferenceCurrency]: isFiat
        ? totalWithFees.toString()
        : total.toString(),
      referenceCurrency,
    });
  }, [
    monetaryAmount,
    indexableReferenceCurrency,
    conversionCreditMonetaryAmount,
    isFiat,
    feesMonetaryAmount,
    toMonetaryAmount,
    referenceCurrency,
  ]);

  return {
    conversionCredit,
    conversionCreditId,
    usingConversionCredit,
    setUsingConversionCredit,
    percentageDiscount,
    readablePercentageDiscount,
    fees,
    feesMonetaryAmount,
    conversionCreditMonetaryAmount,
    maxDiscountMonetary: conversionCredit?.maxDiscount,
    totalMonetaryAmount,
  };
};

export default useCalculateAmounts;
