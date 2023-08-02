import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import { TokenDetailsRow } from '@marketplace/components/ItemPreview/ui';
import FeesDetailsTooltip from '@marketplace/components/offer/FeesDetailsTooltip';

import { SalePrice_offer } from './__generated__/index.graphql';

const StyledTokenDetailsRow = styled(TokenDetailsRow)`
  justify-content: initial;
`;

type Props = {
  sale: SalePrice_offer;
  showFees?: boolean;
};

export const SalePrice = ({ sale, showFees }: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const belongsToUser = useTokenOfferBelongsToUser();
  const saleBelongsToUser = belongsToUser(sale);

  const {
    owners,
    marketFeeAmounts,
    receiverSide: { amounts: offerAmounts },
  } = sale;

  const price = owners?.[0]?.price || offerAmounts;

  const marketFeeMonetaryAmount =
    marketFeeAmounts && toMonetaryAmount(marketFeeAmounts);
  const hasFees = marketFeeMonetaryAmount && marketFeeMonetaryAmount.eur > 0;

  return (
    <StyledTokenDetailsRow>
      <AmountWithConversion monetaryAmount={price} />
      {showFees && saleBelongsToUser && hasFees && (
        <FeesDetailsTooltip
          completed
          monetaryAmount={toMonetaryAmount(price)}
          marketFeeMonetaryAmount={marketFeeMonetaryAmount}
          referenceCurrency={price.referenceCurrency}
        />
      )}
    </StyledTokenDetailsRow>
  );
};

SalePrice.fragments = {
  offer: gql`
    fragment SalePrice_offer on TokenOffer {
      id
      owners {
        id
        price {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
      marketFeeAmounts {
        ...MonetaryAmountFragment_monetaryAmount
      }
      acceptedAt
      sender {
        ... on User {
          slug
        }
      }
      receiverSide {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
      ...useTokenOfferBelongsToUser_offer
    }
    ${monetaryAmountFragment}
    ${useTokenOfferBelongsToUser.fragments.offer}
  ` as TypedDocumentNode<SalePrice_offer>,
};
