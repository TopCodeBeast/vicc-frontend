import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import ExternalLink from '@sorare/core/src/atoms/navigation/ExternalLink';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import { tokenLink } from '@sorare/core/src/lib/etherscan';

import { TokenId_token } from './__generated__/index.graphql';

export interface Props {
  token: TokenId_token;
}

const TokenId = ({ token }: Props) => {
  const { ethereumId, contractAddress } = token;
  return (
    <div>
      <Title6 color="var(--c-neutral-600)">
        <FormattedMessage
          id="BlockchainInfo.tokenId"
          defaultMessage="Token ID"
        />
      </Title6>
      <Text14>
        <ExternalLink href={tokenLink(contractAddress, ethereumId)}>
          {ethereumId.slice(0, 3)}...{ethereumId.slice(-3)}
        </ExternalLink>
      </Text14>
    </div>
  );
};

TokenId.fragments = {
  token: gql`
    fragment TokenId_token on Token {
      assetId
      slug
      ethereumId
      contractAddress
    }
  ` as TypedDocumentNode<TokenId_token>,
};

export default TokenId;
