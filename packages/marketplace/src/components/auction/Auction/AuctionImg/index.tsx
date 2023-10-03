import { TypedDocumentNode, gql } from '@apollo/client';

import { BundledAuctionPreview } from '@marketplace/components/auction/BundledAuctionPreview';
import FlexToken from '@marketplace/components/token/FlexToken';

import { AuctionImg_auction } from './__generated__/index.graphql';

type Props = {
  auction: AuctionImg_auction;
};

export const AuctionImg = ({ auction }: Props) => {
  const isDesktopLayout = false;

  if (auction && auction.nfts.length > 1) {
    return (
      <BundledAuctionPreview
        bundledAuction={auction}
        displayOneCard={!isDesktopLayout}
        noMargin
      />
    );
  }

  return <FlexToken token={auction.nfts[0]} width={160} withLink />;
};

AuctionImg.fragments = {
  auction: gql`
    fragment AuctionImg_auction on Auction {
      id
      nfts {
        assetId
        slug
        ...FlexToken_token
      }
      ...BundledAuctionPreview_auction
    }
    ${BundledAuctionPreview.fragments.auction}
    ${FlexToken.fragments.token}
  ` as TypedDocumentNode<AuctionImg_auction>,
};
