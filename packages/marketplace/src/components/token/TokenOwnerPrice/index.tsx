import { gql } from '@apollo/client';

import {
  OwnerTransfer,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';

import { TokenOwnerPrice_tokenOwner } from './__generated__/index.graphql';

type Props = {
  tokenOwner: TokenOwnerPrice_tokenOwner | null;
};

export const TokenOwnerPrice = ({ tokenOwner }: Props) => {
  if (!tokenOwner) return null;

  const { priceWei, transferType, priceFiat } = tokenOwner;
  const renderPrice = () => {
    if (
      [
        OwnerTransfer.SINGLE_SALE_OFFER,
        OwnerTransfer.ENGLISH_AUCTION,
        OwnerTransfer.SINGLE_BUY_OFFER,
      ].includes(transferType) &&
      priceWei !== '0'
    ) {
      return (
        <AmountWithConversion
          monetaryAmount={{
            referenceCurrency: SupportedCurrency.WEI,
            [SupportedCurrency.WEI.toLowerCase()]: priceWei,
            ...priceFiat,
          }}
          usingLegacyFiat
        />
      );
    }
    return null;
  };

  return <div>{renderPrice()}</div>;
};

TokenOwnerPrice.fragments = {
  tokenOwner: gql`
    fragment TokenOwnerPrice_tokenOwner on TokenOwner {
      id
      transferType
      priceWei
      priceFiat {
        eur
        usd
        gbp
      }
    }
  `,
};
