import { defineMessages } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import { useConversionCredit } from '@sorare/core/src/hooks/useConversionCredit';

import { DumbConversionCreditBanner } from '../DumbConversionCreditBanner';

const messages = defineMessages({
  wonDiscountCredits: {
    id: 'ConversionCreditBanner.wonDiscountCredits',
    defaultMessage:
      'You have won <span>{maxDiscount} credits</span> to use on {sport} <link1>auctions</link1> or <link2>starter packs</link2>.',
  },
  wonDiscountCreditsUpTo: {
    id: 'ConversionCreditBanner.wonDiscountCreditsUpTo',
    defaultMessage:
      'You have won <span>{percentageDiscount}% credits (up to { maxDiscount })</span> to use on {sport} <link1>auctions</link1> or <link2>starter packs</link2>.',
  },
});

type Props = {
  sport?: Sport;
  rounded?: boolean;
};

export const ConversionCreditBanner = ({ sport, rounded = false }: Props) => {
  const sportContext = useSportContext();
  const conversionCredit = useConversionCredit(sport || sportContext?.sport);
  if (!conversionCredit) return null;

  const { endDate, maxDiscount, percentageDiscount } = conversionCredit;

  return (
    <DumbConversionCreditBanner
      discountCredits={messages.wonDiscountCredits}
      discountCreditsUpTo={messages.wonDiscountCreditsUpTo}
      endDate={endDate}
      maxDiscount={maxDiscount}
      percentageDiscount={percentageDiscount}
      sport={conversionCredit.sport}
      rounded={rounded}
    />
  );
};
