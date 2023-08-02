import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Info } from '@sorare/core/src/atoms/icons/Info';
import { LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import ExternalLink from '@sorare/core/src/atoms/navigation/ExternalLink';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import TokenId from '../TokenId';
import { BlockchainInfo_token } from './__generated__/index.graphql';

type Props = {
  token: BlockchainInfo_token;
};

const TooltipWrapper = styled.span`
  display: none;
  @media ${laptopAndAbove} {
    display: inline-block;
    color: var(--c-neutral-600);
    vertical-align: bottom;
  }
`;

const Ellipsis = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const messages = defineMessages({
  ipfsData: {
    id: 'BlockchainInfo.ipfsDataInfo',
    defaultMessage:
      'IPFS is a decentralized storage system that enables the secure and persistent storage of digital content. For Sorare NFTs, the IPFS data includes information about the unique digital asset, such as its image, as well as metadata describing its immutable properties. This ensures the NFT remains independently accessible and verifiable at all times.',
  },
  ipfsPicture: {
    id: 'BlockchainInfo.ipfsPictureInfo',
    defaultMessage:
      'IPFS is a decentralized storage system that enables the secure and persistent storage of digital content. Sorare uses IPFS to store the picture of the NFTs. This ensures the NFT remains independently accessible and verifiable at all times.',
  },
});

const BlockchainInfo = ({ token }: Props) => {
  const { ipfsUrl, ipfsPictureUrl } = token;
  const { formatMessage } = useIntl();

  return (
    <>
      <TokenId token={token} />
      {ipfsUrl && (
        <>
          <Title6 color="var(--c-neutral-600)">
            <FormattedMessage
              id="BlockchainInfo.ipfsData"
              defaultMessage="IPFS Data {info}"
              values={{
                info: (
                  <TooltipWrapper>
                    <LinkOther
                      as={Tooltip}
                      title={formatMessage(messages.ipfsData)}
                    >
                      <small>
                        <Info />
                      </small>
                    </LinkOther>
                  </TooltipWrapper>
                ),
              }}
            />
          </Title6>
          <Text14>
            <ExternalLink href={ipfsUrl}>
              <Ellipsis>{ipfsUrl}</Ellipsis>
            </ExternalLink>
          </Text14>
        </>
      )}
      {ipfsPictureUrl && (
        <>
          <Title6 color="var(--c-neutral-600)">
            <FormattedMessage
              id="BlockchainInfo.ipfsPicture"
              defaultMessage="IPFS Picture {info}"
              values={{
                info: (
                  <TooltipWrapper>
                    <LinkOther
                      as={Tooltip}
                      title={formatMessage(messages.ipfsPicture)}
                    >
                      <small>
                        <Info />
                      </small>
                    </LinkOther>
                  </TooltipWrapper>
                ),
              }}
            />
          </Title6>
          <Text14>
            <ExternalLink href={ipfsPictureUrl}>
              <Ellipsis>{ipfsPictureUrl}</Ellipsis>
            </ExternalLink>
          </Text14>
        </>
      )}
    </>
  );
};

BlockchainInfo.fragments = {
  token: gql`
    fragment BlockchainInfo_token on Token {
      assetId
      slug
      ipfsUrl
      ipfsPictureUrl
      ...TokenId_token
    }
    ${TokenId.fragments.token}
  ` as TypedDocumentNode<BlockchainInfo_token>,
};

export default BlockchainInfo;
