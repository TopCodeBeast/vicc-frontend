import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import {
  CreditCardBrand,
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Currency } from '@sorare/core/src/lib/currency';

import { PaymentProvider_auction } from './__generated__/fragments.graphql';

type onSubmitArgs = {
  weiAmount: string;
  totalFiatAmountInCents: string;
  conversionCreditId?: string;
  supportedCurrency: SupportedCurrency;
};

export interface PaymentProviderProps {
  auction?: PaymentProvider_auction;
  onSuccess: (weiAmount?: string) => void;
  onSubmit: (args: onSubmitArgs) => Promise<void | { err: string[] }>;
  objectId: string;
  priceInWei: string;
  creditCardFee?: number;
  activeFee?: boolean;
  cta: MessageDescriptor;
  currencies?: Currency[];
  canUseConversionCredit?: boolean;
  buyOnAuctionPoweredByAlgolia?: ReactNode;
  sport: Sport;
}

export type PaymentProvider_paymentMethod = {
  __typename: any;
  id: string;
  card: {
    __typename: any;
    last4: string;
    brand: CreditCardBrand;
  };
};

export enum WalletPaymentMethod {
  ETH_WALLET = 'eth_wallet',
  FIAT_WALLET = 'fiat_wallet',
}
