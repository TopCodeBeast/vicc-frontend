import { defineMessages } from 'react-intl';

import { useSignupConversionCreditCampaign } from '@core/hooks/useSignupConversionCreditCampaign';

import { DumbConversionCreditBanner } from '../DumbConversionCreditBanner';

const messages = defineMessages({
  signUpToWinDiscountCredits: {
    id: 'ConversionCreditCampaignBanner.signUpToWinDiscountCredits',
    defaultMessage:
      'Sign up now to win <span>{maxDiscount} credits</span> to use on {sport} <link1>auctions</link1> or <link2>starter packs</link2>.',
  },
  signUpToWinDiscountCreditsUpTo: {
    id: 'ConversionCreditCampaignBanner.signUpToWinDiscountCreditsUpTo',
    defaultMessage:
      'Sign up now to win <span>{percentageDiscount}% credits (up to { maxDiscount })</span> to use on {sport} <link1>auctions</link1> or <link2>starter packs</link2>.',
  },
});

export const ConversionCreditCampaignBanner = () => {
  const campaign = useSignupConversionCreditCampaign();
  if (!campaign) return null;

  const { endDate, maxDiscount, percentageDiscount } = campaign;

  return (
    <DumbConversionCreditBanner
      discountCredits={messages.signUpToWinDiscountCredits}
      discountCreditsUpTo={messages.signUpToWinDiscountCreditsUpTo}
      endDate={endDate}
      maxDiscount={maxDiscount}
      percentageDiscount={percentageDiscount}
      sport={campaign.sport}
    />
  );
};
