import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import styled, { css } from 'styled-components';

import UninteractiveToken from '@core/components/token/UninteractiveToken';

import { UninteractiveBundledAuctionPreview_auction } from './__generated__/index.graphql';
import { CardSize, cardSizes } from './types';

const WIDTH: {
  [size in (typeof cardSizes)[number]]: number;
} = {
  xs: 320,
  sm: 287,
  md: 320,
  lg: 350,
  xl: 410,
};

interface Props {
  size: CardSize;
  bundledAuction: UninteractiveBundledAuctionPreview_auction;
}

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 10px calc(25% - 5px) 5px calc(25% - 5px);
  grid-template-rows: 1fr 5px 1fr;
  grid-template-areas:
    'main gap1 second gap3 third'
    'main gap1 gap2 gap2 gap2'
    'main gap1 fourth gap4 fifth';

  ${cardSizes.map(
    cur =>
      css`
        &.${cur} {
          width: ${WIDTH[cur]}px;
        }
      `
  )}
  & > * {
    width: 100%;
  }
  & > :nth-child(1) {
    grid-area: main;
  }
  & > :nth-child(2) {
    align-self: start;
    grid-area: second;
  }
  & > :nth-child(3) {
    grid-area: third;
    align-self: start;
  }
  & > :nth-child(4) {
    grid-area: fourth;
    align-self: end;
  }
  & > :nth-child(5) {
    grid-area: fifth;
    align-self: end;
  }
`;

export const UninteractiveBundledAuctionPreview = ({
  size,
  bundledAuction,
}: Props) => {
  const { nfts } = bundledAuction;

  const mainToken = nfts[0]; // select the first one for now
  const secondaryAssetIds = nfts.filter(
    nft => nft.assetId !== mainToken.assetId
  );

  return (
    <Root className={classnames(size)} data-findme>
      <UninteractiveToken token={mainToken} />
      {secondaryAssetIds.map(token => (
        <UninteractiveToken key={token.assetId} token={token} />
      ))}
    </Root>
  );
};

UninteractiveBundledAuctionPreview.fragments = {
  auction: gql`
    fragment UninteractiveBundledAuctionPreview_auction on Auction {
      id
      nfts {
        slug
        assetId
        ...UninteractiveToken_token
      }
    }
    ${UninteractiveToken.fragments.token}
  ` as TypedDocumentNode<UninteractiveBundledAuctionPreview_auction>,
};

export default UninteractiveBundledAuctionPreview;
