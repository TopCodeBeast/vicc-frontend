import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import CardsPreviewContainer from '@sorare/core/src/components/bundled/CardsPreviewContainer';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import BuyConfirmation from '@marketplace/components/buyActions/BuyConfirmation';
import { PaymentBoxAmountWithConversion } from '@marketplace/components/buyActions/PaymentBox/AmountWithConversion';
import { Props as SelectedPaymentMethodForConfirmationProps } from '@marketplace/components/buyActions/PaymentBox/Methods/SelectedPaymentMethodForConfirmation';
import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';
import useCalculateAmounts from '@marketplace/components/buyActions/PaymentProvider/useCalculateAmounts';
import { PrimaryOfferTokensPreview } from '@marketplace/components/primaryOffer/PrimaryOfferTokensPreview';
import PrimaryOfferTokensSummary from '@marketplace/components/primaryOffer/PrimaryOfferTokensSummary';

import { BuyPrimaryOfferConfirmation_primaryOffer } from './__generated__/index.graphql';

const Images = styled.div`
  width: 286px;
`;

export type Props = {
  primaryOffer: BuyPrimaryOfferConfirmation_primaryOffer;
  customAmountDisplay?: ReactNode;
  payment: SelectedPaymentMethodForConfirmationProps;
};

export const BuyPrimaryOfferConfirmation = ({
  primaryOffer,
  payment,
}: Props) => {
  const {
    fiatCurrency: { code },
  } = useCurrentUserContext();
  const { toMonetaryAmount } = useMonetaryAmount();
  const { price, nfts } = primaryOffer;
  const isFiat = payment?.paymentCurrency === Currency.FIAT;
  const referenceCurrency = isFiat
    ? (code as SupportedCurrency)
    : SupportedCurrency.WEI;
  const monetaryAmount = toMonetaryAmount(price);

  const sport = nfts?.[0]?.sport;

  const {
    conversionCreditMonetaryAmount,
    totalMonetaryAmount,
    feesMonetaryAmount,
    usingConversionCredit,
  } = useCalculateAmounts({
    creditCardFee: 0,
    activeFee:
      isFiat && payment?.paymentMethod !== WalletPaymentMethod.FIAT_WALLET,
    isFiat,
    sport,
    canUseConversionCredit: true,
    monetaryAmount,
    referenceCurrency,
  });

  const summaryTableProps = {
    hideSubtotal: true,
    subtotalMonetaryAmount: monetaryAmount,
    totalMonetaryAmount,
    feesMonetaryAmount,
    feesWeiAmount: '0',
    fees: 0,
    isFiat,
    isCreditCard:
      isFiat && payment?.paymentMethod !== WalletPaymentMethod.FIAT_WALLET,
    customAmountDisplay: false,
    usingConversionCredit,
    conversionCreditMonetaryAmount,
    sport: nfts[0].sport,
    canChangeRefCurrency: true,
  };
  return (
    <BuyConfirmation
      orderSummary={
        <PrimaryOfferTokensSummary
          tokens={nfts}
          price={
            <PaymentBoxAmountWithConversion
              monetaryAmount={monetaryAmount}
              hideExponent
              primaryCurrency={isFiat ? Currency.FIAT : Currency.ETH}
            />
          }
        />
      }
      itemPreview={
        <Images>
          <CardsPreviewContainer>
            <PrimaryOfferTokensPreview nfts={nfts} />
          </CardsPreviewContainer>
        </Images>
      }
      title={
        <Title3 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="BuyPrimaryOfferConfirmation.title"
            defaultMessage="Score! The pack is yours"
          />
        </Title3>
      }
      helper={
        <Text16 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="BuyPrimaryOfferConfirmation.helper"
            defaultMessage="It could take 1-5 minutes for the cards to appear in your gallery"
          />
        </Text16>
      }
      summaryTableProps={summaryTableProps}
      payment={payment}
    />
  );
};

BuyPrimaryOfferConfirmation.fragments = {
  primaryOffer: gql`
    fragment BuyPrimaryOfferConfirmation_primaryOffer on Offer {
      id
      price {
        ...MonetaryAmountFragment_monetaryAmount
      }
      nfts {
        assetId
        slug
        sport
        ...PrimaryOfferTokensPreview_token
        ...PrimaryOfferTokensSummary_token
      }
    }
    ${monetaryAmountFragment}
    ${PrimaryOfferTokensPreview.fragments.token}
    ${PrimaryOfferTokensSummary.fragments.token}
  ` as TypedDocumentNode<BuyPrimaryOfferConfirmation_primaryOffer>,
};

export default BuyPrimaryOfferConfirmation;
