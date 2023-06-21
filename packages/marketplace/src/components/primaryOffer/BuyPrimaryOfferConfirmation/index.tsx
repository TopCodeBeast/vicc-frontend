import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import CardsPreviewContainer from '@sorare/core/src/components/bundled/CardsPreviewContainer';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';

import BuyConfirmation from '@marketplace/components/buyActions/BuyConfirmation';
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
  customAmountDisplay,
  payment,
}: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const { priceWei, nfts } = primaryOffer;
  const isFiat = payment?.paymentCurrency === Currency.FIAT;
  const monetaryAmount = toMonetaryAmount({
    wei: priceWei,
    referenceCurrency: SupportedCurrency.WEI,
  });

  const sport = nfts?.[0]?.sport;

  const { totalMonetaryAmount, feesMonetaryAmount } = useCalculateAmounts({
    creditCardFee: 0,
    activeFee: isFiat,
    isFiat,
    sport,
    canUseConversionCredit: false,
    monetaryAmount,
    referenceCurrency: SupportedCurrency.WEI,
  });

  const summaryTableProps = {
    subtotalMonetaryAmount: monetaryAmount,
    totalMonetaryAmount,
    feesMonetaryAmount,
    feesWeiAmount: '0',
    fees: 0,
    isFiat,
    isCreditCard:
      isFiat && payment?.paymentMethod !== WalletPaymentMethod.FIAT_WALLET,
    customAmountDisplay,
    usingConversionCredit: false,
    sport: nfts[0].sport,
  };
  return (
    <BuyConfirmation
      orderSummary={
        <PrimaryOfferTokensSummary tokens={nfts} price={customAmountDisplay} />
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
    fragment BuyPrimaryOfferConfirmation_primaryOffer on TokenPrimaryOffer {
      id
      priceWei
      nfts {
        assetId
        slug
        sport
        ...PrimaryOfferTokensPreview_token
        ...PrimaryOfferTokensSummary_token
      }
    }
    ${PrimaryOfferTokensPreview.fragments.token}
    ${PrimaryOfferTokensSummary.fragments.token}
  `,
};

export default BuyPrimaryOfferConfirmation;
