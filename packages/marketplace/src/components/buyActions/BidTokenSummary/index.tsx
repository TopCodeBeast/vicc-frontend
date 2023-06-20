import { gql } from '@apollo/client';
import styled from 'styled-components';

import { TokenSummary } from '../TokenSummary';
import { BidTokenSummary_token } from './__generated__/index.graphql';

const Frame = styled.div`
  border: solid 1px var(--c-neutral-400);
  border-radius: var(--double-unit);
  padding: var(--double-unit);
`;

type Props = {
  token: BidTokenSummary_token;
  withoutRecentSales?: boolean;
};

export const BidTokenSummary = (props: Props) => {
  return (
    <Frame>
      <TokenSummary {...props} />
    </Frame>
  );
};

BidTokenSummary.fragments = {
  token: gql`
    fragment BidTokenSummary_token on Token {
      assetId
      slug
      ...TokenSummary_token
    }
    ${TokenSummary.fragments.token}
  `,
};

export default BidTokenSummary;
