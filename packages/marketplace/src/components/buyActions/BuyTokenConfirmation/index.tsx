import { gql } from '@apollo/client';
import Big from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import UninteractiveToken from '@sorare/core/src/components/token/UninteractiveToken';
import { divideFiat, multiplyFiat } from '@sorare/core/src/lib/fiat';

import BuyTokenSummary from 'components/buyActions/BuyTokenSummary';
import { Props as SelectedPaymentMethodForConfirmationProps } from 'components/buyActions/PaymentBox/Methods/SelectedPaymentMethodForConfirmation';
import SmallUser from 'components/user/SmallUser';

import BuyConfirmation from '../BuyConfirmation';
import { WalletPaymentMethod } from '../PaymentProvider/types';
import { BuyTokenConfirmation_tokenOffer } from './__generated__/index.graphql';

const Image = styled.div`
  width: 136px;
`;
export type Props = {
  offer: BuyTokenConfirmation_tokenOffer;
  payment: SelectedPaymentMethodForConfirmationProps;
};

export const BuyTokenConfirmation = ({ payment, offer }: Props) => {
  const {
    creditCardFee: fees,
    priceWei,
    priceFiat,
    sender,
    senderSide: { nfts },
  } = offer;

  if (!nfts || nfts.length === 0) return null;
  const token = nfts[0];

  const isFiat = payment?.paymentCurrency === Currency.FIAT;

  const subtotalBigAmount = isFiat
    ? new Big(priceWei).dividedBy(1 + fees)
    : new Big(priceWei);

  const subtotalFiatAmount = isFiat
    ? divideFiat(priceFiat, 1 + fees)
    : priceFiat;

  const feesWeiAmount = subtotalBigAmount
    .multipliedBy(isFiat ? fees : 0)
    .toString();

  const feesFiatAmount = multiplyFiat(subtotalFiatAmount, isFiat ? fees : 0);

  const summaryTableProps = {
    subtotalWeiAmount: subtotalBigAmount.toString(),
    subtotalFiatAmount,
    totalWeiAmount: priceWei,
    totalFiatAmount: priceFiat,
    feesWeiAmount,
    feesFiatAmount,
    fees,
    isFiat,
    isCreditCard:
      isFiat && payment?.paymentMethod !== WalletPaymentMethod.FIAT_WALLET,
    customAmountDisplay: null,
    usingConversionCredit: false,
    sport: token.sport,
  };

  return (
    <BuyConfirmation
      orderSummary={
        <BuyTokenSummary
          withoutRecentSales
          token={token}
          price={{
            weiAmount: subtotalBigAmount.toString(),
            amountInFiat: subtotalFiatAmount,
          }}
        />
      }
      itemPreview={
        <Image>
          <UninteractiveToken token={token} />
        </Image>
      }
      title={
        <Title3 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="BuyTokenConfirmation.title"
            defaultMessage="Score! The card is yours"
          />
        </Title3>
      }
      helper={
        <Text16 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="BuyTokenConfirmation.helper"
            defaultMessage="It could take 1-5 minutes for the card to appear in your gallery"
          />
        </Text16>
      }
      summaryTableProps={summaryTableProps}
      payment={payment}
      seller={<SmallUser user={sender} />}
    />
  );
};

BuyTokenConfirmation.fragments = {
  tokenOffer: gql`
    fragment BuyTokenConfirmation_tokenOffer on TokenOffer {
      id
      creditCardFee
      priceWei
      priceFiat {
        eur
        gbp
        usd
      }
      sender {
        ...SmallUser_user
        ...SmallUser_anonymousUser
      }
      senderSide {
        id
        nfts {
          assetId
          slug
          sport
          ...UninteractiveToken_token
          ...BuyTokenSummary_token
        }
      }
    }
    ${SmallUser.fragments.user}
    ${SmallUser.fragments.anonymousUser}
    ${UninteractiveToken.fragments.token}
    ${BuyTokenSummary.fragments.token}
  `,
};

export default BuyTokenConfirmation;
