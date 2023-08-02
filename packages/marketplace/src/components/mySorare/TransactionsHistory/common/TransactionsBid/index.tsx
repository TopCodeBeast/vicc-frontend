import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import { TokenName } from '@marketplace/components/token/TokenName';

import { SectionTitle } from '../ui';
import { TransactionsBid_tokenBid } from './__generated__/index.graphql';

const messages = defineMessages({
  detail: {
    id: 'TransactionsHistoryBid.detail',
    defaultMessage: 'Bid on',
  },
});

type Props = {
  tokenBid: TransactionsBid_tokenBid;
};

export const TransactionsBid = ({ tokenBid }: Props) => {
  return (
    <>
      <SectionTitle>
        <FormattedMessage {...messages.detail} />
      </SectionTitle>
      {tokenBid.auction.nfts.map(nft => (
        <TokenName key={nft.assetId} token={nft} withLink />
      ))}
    </>
  );
};

TransactionsBid.fragments = {
  tokenBid: gql`
    fragment TransactionsBid_tokenBid on TokenBid {
      id
      auction {
        id
        nfts {
          assetId
          slug
          ...TokenName_token
        }
      }
    }
    ${TokenName.fragments.token}
  ` as TypedDocumentNode<TransactionsBid_tokenBid>,
};
