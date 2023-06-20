import { gql } from '@apollo/client';
import styled from 'styled-components';

import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';

import ItemPrice from 'components/ItemPreview/ItemPrice';
import { TokenDetailsRow } from 'components/ItemPreview/ui';
import FeesDetailsTooltip from 'components/offer/FeesDetailsTooltip';

import { SalePrice_offer } from './__generated__/index.graphql';

const StyledTokenDetailsRow = styled(TokenDetailsRow)`
  justify-content: initial;
`;

type Props = {
  sale: SalePrice_offer;
  showFees?: boolean;
};

export const SalePrice = ({ sale, showFees }: Props) => {
  const belongsToUser = useTokenOfferBelongsToUser();
  const saleBelongsToUser = belongsToUser(sale);

  const {
    owners,
    priceWei: offerPriceWei,
    priceFiat: offerPriceFiat,
    marketFeeAmountWei,
    marketFeeAmountFiat,
  } = sale;

  const priceWei = owners?.[0]?.priceWei || offerPriceWei;
  const priceFiat = owners?.[0]?.priceFiat || offerPriceFiat;

  const hasFees = marketFeeAmountWei && Number(marketFeeAmountWei) > 0;

  return (
    <StyledTokenDetailsRow>
      <ItemPrice wei={priceWei} />
      {showFees && saleBelongsToUser && hasFees && (
        <FeesDetailsTooltip
          completed
          priceWei={priceWei}
          priceFiat={priceFiat}
          marketFeeAmountWei={marketFeeAmountWei}
          marketFeeAmountFiat={marketFeeAmountFiat}
        />
      )}
    </StyledTokenDetailsRow>
  );
};

SalePrice.fragments = {
  offer: gql`
    fragment SalePrice_offer on TokenOffer {
      id
      priceWei
      priceFiat {
        eur
        usd
        gbp
      }
      owners {
        id
        priceWei
        priceFiat {
          eur
          usd
          gbp
        }
      }
      marketFeeAmountWei
      marketFeeAmountFiat {
        eur
        usd
        gbp
      }
      acceptedAt
      sender {
        ... on User {
          slug
        }
      }
      ...useTokenOfferBelongsToUser_offer
    }
    ${useTokenOfferBelongsToUser.fragments.offer}
  `,
};
