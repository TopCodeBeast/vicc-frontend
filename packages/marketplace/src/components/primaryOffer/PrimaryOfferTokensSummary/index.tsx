import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { Title5, Title6 } from '@sorare/core/src/atoms/typography';

import { TokensSummary } from '@sorare/marketplace/src/components/buyActions/TokensSummary';

import { PrimaryOfferTokensSummary_token } from './__generated__/index.graphql';

type Props = {
  tokens: PrimaryOfferTokensSummary_token[];
  price: ReactNode;
};

export const PrimaryOfferTokensSummary = (props: Props) => {
  return (
    <TokensSummary
      {...props}
      title={
        <Title5>
          <FormattedMessage
            id="buyField.tokenSummary.title"
            defaultMessage="Order Summary"
          />
        </Title5>
      }
      packTitle={
        <Title6>
          <FormattedMessage
            id="PrimaryOfferTokensSummary.packtitle"
            defaultMessage="Starter pack"
          />
        </Title6>
      }
    />
  );
};

PrimaryOfferTokensSummary.fragments = {
  token: gql`
    fragment PrimaryOfferTokensSummary_token on Token {
      assetId
      slug
      ...TokensSummary_token
    }
    ${TokensSummary.fragments.token}
  `,
};

export default PrimaryOfferTokensSummary;
