import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Title5 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';

import TokenSummary from '@marketplace/components/buyActions/TokenSummary';

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
  monetaryAmount?: MonetaryAmountOutput;
};

export const BuyTokenSummary = ({
  token,
  withoutRecentSales = false,
  monetaryAmount,
}: Props) => {
  const price = (
    <Price>
      <AmountWithConversion
        monetaryAmount={{
          referenceCurrency: SupportedCurrency.WEI,
          [SupportedCurrency.WEI.toLowerCase()]:
            monetaryAmount?.wei || token?.liveSingleSaleOffer?.priceWei || '0',
          ...monetaryAmount,
        }}
        column
      />
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
