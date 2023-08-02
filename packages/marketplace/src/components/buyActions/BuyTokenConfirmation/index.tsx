import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import UninteractiveToken from '@sorare/core/src/components/token/UninteractiveToken';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import BuyTokenSummary from '@marketplace/components/buyActions/BuyTokenSummary';
import { Props as SelectedPaymentMethodForConfirmationProps } from '@marketplace/components/buyActions/PaymentBox/Methods/SelectedPaymentMethodForConfirmation';
import { Props as SummaryTableProps } from '@marketplace/components/buyActions/PaymentBox/SummaryTable';
import SmallUser from '@marketplace/components/user/SmallUser';

import BuyConfirmation from '../BuyConfirmation';
import { WalletPaymentMethod } from '../PaymentProvider/types';
import { useCalculateAmounts } from '../PaymentProvider/useCalculateAmounts';
import { BuyTokenConfirmation_tokenOffer } from './__generated__/index.graphql';

const Image = styled.div`
  width: 136px;
`;
export type Props = {
  offer: BuyTokenConfirmation_tokenOffer;
  payment: SelectedPaymentMethodForConfirmationProps;
};

export const BuyTokenConfirmation = ({ payment, offer }: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const {
    creditCardFee: fees,
    sender,
    senderSide: { nfts },
    receiverSide: { amounts },
  } = offer;
  const isFiat = payment?.paymentCurrency === Currency.FIAT;

  const monetaryAmount = toMonetaryAmount(amounts);

  const sport = nfts?.[0]?.sport;

  const { totalMonetaryAmount, feesMonetaryAmount } = useCalculateAmounts({
    creditCardFee: fees,
    activeFee: isFiat,
    isFiat,
    sport,
    canUseConversionCredit: false,
    monetaryAmount,
    referenceCurrency: amounts.referenceCurrency,
  });

  if (!nfts || nfts.length === 0) return null;
  const token = nfts[0];

  const summaryTableProps: SummaryTableProps = {
    fees,
    isFiat,
    isCreditCard:
      isFiat && payment?.paymentMethod !== WalletPaymentMethod.FIAT_WALLET,
    customAmountDisplay: null,
    usingConversionCredit: false,
    sport: token.sport,
    subtotalMonetaryAmount: monetaryAmount,
    feesMonetaryAmount,
    totalMonetaryAmount,
  };

  return (
    <BuyConfirmation
      orderSummary={
        <BuyTokenSummary
          withoutRecentSales
          token={token}
          monetaryAmount={monetaryAmount}
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
      receiverSide {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
    }
    ${monetaryAmountFragment}
    ${SmallUser.fragments.user}
    ${SmallUser.fragments.anonymousUser}
    ${UninteractiveToken.fragments.token}
    ${BuyTokenSummary.fragments.token}
  ` as TypedDocumentNode<BuyTokenConfirmation_tokenOffer>,
};

export default BuyTokenConfirmation;
