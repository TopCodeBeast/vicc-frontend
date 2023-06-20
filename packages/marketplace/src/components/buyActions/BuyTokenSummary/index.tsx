import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Fiat } from '@sorare/core/src/__generated__/globalTypes';
import { Text14, Text16, Title5 } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';

import TokenSummary from '@sorare/marketplace/src/components/buyActions/TokenSummary';

import { BuyTokenSummary_token } from './__generated__/index.graphql';

const Price = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  text-align: right;
`;

type Props = {
  token: BuyTokenSummary_token;
  withoutRecentSales?: boolean;
  price?: {
    weiAmount: string;
    amountInFiat: Fiat;
  };
};

export const BuyTokenSummary = ({
  token,
  withoutRecentSales = false,
  price: customPrice,
}: Props) => {
  const { main, exponent } = useAmountWithConversion({
    amount:
      customPrice?.weiAmount || token?.liveSingleSaleOffer?.priceWei || '0',
    ...(customPrice?.amountInFiat && {
      amountInFiat: customPrice?.amountInFiat,
    }),
    unit: 'wei',
    context: 'BuyTokenSummary',
  });

  const price = (
    <Price>
      <Text16 color="var(--c-neutral-1000)">{main}</Text16>
      {exponent && <Text14 color="var(--c-neutral-600)">{exponent}</Text14>}
    </Price>
  );

  return (
    <TokenSummary
      title={
        <Title5>
          <FormattedMessage
            id="buyField.tokenSummary.title"
            defaultMessage="Order Summary"
          />
        </Title5>
      }
      withoutRecentSales={withoutRecentSales}
      token={token}
      price={price}
    />
  );
};

BuyTokenSummary.fragments = {
  token: gql`
    fragment BuyTokenSummary_token on Token {
      assetId
      slug
      collection
      liveSingleSaleOffer {
        id
        priceWei
      }
      ...TokenSummary_token
    }
    ${TokenSummary.fragments.token}
  `,
};

export default BuyTokenSummary;
