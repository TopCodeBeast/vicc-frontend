import { useCallback } from 'react';

import {
  SupportedCurrency,
  TokenPaymentMethod,
} from '@sorare/core/src/__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import useSignWalletChallenge from '@sorare/core/src/hooks/useSignWalletChallenge';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';

import usePrepareBid from '@marketplace/hooks/auctions/usePrepareBid';
import usePrepareAcceptOffer from '@marketplace/hooks/offers/usePrepareAcceptOffer';

export enum PreparePaymentType {
  BID = 'bid',
  ACCEPT_OFFER = 'acceptOffer',
}
type PrepareStripePaymentSharedArgs = {
  conversionCreditId?: string;
  savePaymentMethod: boolean;
};

type PrepareStripeBidArgs = PrepareStripePaymentSharedArgs & {
  type: PreparePaymentType.BID;
  englishAuctionId: string;
  monetaryAmount: MonetaryAmountOutput;
};
type PrepareStripeAcceptOfferArgs = PrepareStripePaymentSharedArgs & {
  type: PreparePaymentType.ACCEPT_OFFER;
  offerId: string;
};

type PrepareStripePaymentArgs =
  | PrepareStripeBidArgs
  | PrepareStripeAcceptOfferArgs;

const usePreparePayment = () => {
  const {
    fiatCurrency: { code: currencyCode },
  } = useCurrentUserContext();
  const { signWalletChallenge } = useSignWalletChallenge();
  const { fiatCurrencyForMonetaryAmount } = useFiatBalance();

  const { prepareBid } = usePrepareBid({ signAuthorizations: false });
  const { prepareAcceptOffer } = usePrepareAcceptOffer({
    signAuthorizations: false,
  });

  const prepareStripePayment = useCallback(
    async (args: PrepareStripePaymentArgs) => {
      const walletChallengeSignature = await signWalletChallenge();

      if (args.type === PreparePaymentType.BID) {
        const {
          englishAuctionId,
          monetaryAmount,
          conversionCreditId,
          savePaymentMethod,
        } = args;
        const { authorizations } = await prepareBid({
          supportedCurrency: currencyCode as SupportedCurrency,
          tokenPaymentMethod: TokenPaymentMethod.CREDIT_CARD,
          englishAuctionId,
          amount: monetaryAmount[fiatCurrencyForMonetaryAmount].toString(),
          conversionCreditId,
          savePaymentMethod,
          walletChallengeSignature,
        });

        return { authorizations, useAuthorizations: true };
      }
      const { offerId, conversionCreditId, savePaymentMethod } = args;
      return prepareAcceptOffer({
        supportedCurrency: currencyCode as SupportedCurrency,
        tokenPaymentMethod: TokenPaymentMethod.CREDIT_CARD,
        offerId,
        conversionCreditId,
        savePaymentMethod,
        walletChallengeSignature,
      });
    },
    [
      currencyCode,
      fiatCurrencyForMonetaryAmount,
      prepareAcceptOffer,
      prepareBid,
      signWalletChallenge,
    ]
  );

  return prepareStripePayment;
};

export default usePreparePayment;
