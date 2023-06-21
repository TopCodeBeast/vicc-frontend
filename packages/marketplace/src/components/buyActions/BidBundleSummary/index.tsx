import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title6 } from '@sorare/core/src/atoms/typography';

import Pack from '@marketplace/components/transfers/Pack';

import { TokensSummary } from '../TokensSummary';
import { BidBundleSummary_token } from './__generated__/index.graphql';

const Frame = styled.div`
  border: solid 1px var(--c-neutral-400);
  border-radius: var(--double-unit);
  padding: var(--double-unit);
`;

type Props = {
  tokens: BidBundleSummary_token[];
};

export const BidBundleSummary = (props: Props) => {
  return (
    <Frame>
      <TokensSummary
        packTitle={
          <>
            <Pack />
            <Title6>
              <FormattedMessage
                id="BidBundleSummary.packTitle"
                defaultMessage="Bundle"
              />
            </Title6>
          </>
        }
        {...props}
      />
    </Frame>
  );
};

BidBundleSummary.fragments = {
  token: gql`
    fragment BidBundleSummary_token on Token {
      assetId
      slug
      ...TokensSummary_token
    }
    ${TokensSummary.fragments.token}
  `,
};

export default BidBundleSummary;
