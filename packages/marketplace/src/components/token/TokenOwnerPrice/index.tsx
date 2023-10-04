import { TypedDocumentNode, gql } from '@apollo/client';

import { OwnerTransfer } from '@sorare/core/src/__generated__/globalTypes';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import { TokenOwnerPrice_tokenOwner } from './__generated__/index.graphql';

type Props = {
  tokenOwner: TokenOwnerPrice_tokenOwner | null;
};

export const TokenOwnerPrice = ({ tokenOwner }: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  if (!tokenOwner) return null;

  const { price, transferType } = tokenOwner;
  const priceMonetaryAmount = toMonetaryAmount(price);
  const renderPrice = () => {
    if (
      [
        OwnerTransfer.SINGLE_SALE_OFFER,
        OwnerTransfer.ENGLISH_AUCTION,
        OwnerTransfer.SINGLE_BUY_OFFER,
      ].includes(transferType) &&
      priceMonetaryAmount.eur !== 0
    ) {
      return <AmountWithConversion monetaryAmount={priceMonetaryAmount} />;
    }
    return null;
  };

  return <div>{renderPrice()}</div>;
};

TokenOwnerPrice.fragments = {
  tokenOwner: gql`
    fragment TokenOwnerPrice_tokenOwner on Owner {
      id
      transferType
      price {
        ...MonetaryAmountFragment_monetaryAmount
      }
    }
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<TokenOwnerPrice_tokenOwner>,
};
