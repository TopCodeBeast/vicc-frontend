import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import {
  CreditCardBrand,
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { Currency } from '@sorare/core/src/lib/currency';
import { MonetaryAmountParams } from '@sorare/core/src/lib/monetaryAmount';

import { PaymentProvider_auction } from './__generated__/fragments.graphql';

type onSubmitArgs = {
  monetaryAmount: MonetaryAmountOutput;
  conversionCreditId?: string;
  supportedCurrency: SupportedCurrency;
};

export interface PaymentProviderProps {
  auction?: PaymentProvider_auction;
  onSuccess: (amount?: MonetaryAmountOutput) => void;
  onSubmit: (args: onSubmitArgs) => Promise<void | { err: string[] }>;
  objectId: string;
  price: MonetaryAmountParams;
  canChangeRefCurrency?: boolean;
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
