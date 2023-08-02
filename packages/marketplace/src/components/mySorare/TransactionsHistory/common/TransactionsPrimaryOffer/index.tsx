import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import { TokenName } from '@marketplace/components/token/TokenName';

import { SectionTitle } from '../ui';
import { TransactionsPrimaryOffer_tokenPrimaryOffer } from './__generated__/index.graphql';

const messages = defineMessages({
  detail: {
    id: 'TransactionsHistoryPrimaryOffer.detail',
    defaultMessage: 'Cards in pack',
  },
});

type Props = {
  tokenPrimaryOffer: TransactionsPrimaryOffer_tokenPrimaryOffer;
};

export const TransactionsPrimaryOffer = ({ tokenPrimaryOffer }: Props) => {
  return (
    <>
      <SectionTitle>
        <FormattedMessage {...messages.detail} />
      </SectionTitle>
      {tokenPrimaryOffer.nfts.map(nft => (
        <TokenName key={nft.assetId} token={nft} withLink />
      ))}
    </>
  );
};

TransactionsPrimaryOffer.fragments = {
  tokenPrimaryOffer: gql`
    fragment TransactionsPrimaryOffer_tokenPrimaryOffer on TokenPrimaryOffer {
      id
      nfts {
        assetId
        slug
        ...TokenName_token
      }
    }
    ${TokenName.fragments.token}
  ` as TypedDocumentNode<TransactionsPrimaryOffer_tokenPrimaryOffer>,
};
