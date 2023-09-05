import { TypedDocumentNode, gql } from '@apollo/client';

import { AuctionDetails } from '@marketplace/components/auction/Auction/AuctionDetails';
import useGetAuctionDetails from '@marketplace/hooks/offers/useGetAuctionDetails';

import { TokenAuctionDetails_token } from './__generated__/index.graphql';

type Props = {
  token: TokenAuctionDetails_token;
  isDesktopLayout: boolean;
  hideViccUser?: boolean;
  hideOwner?: boolean;
  galleryOwnerSlug?: string;
  disableSportSpecific?: boolean;
};

export const TokenAuctionDetails = ({
  token,
  isDesktopLayout,
  hideViccUser,
}: Props) => {
  const auction = useGetAuctionDetails(token.latestEnglishAuction);
  if (!token.latestEnglishAuction || !auction) return null;

  return (
    <AuctionDetails
      auction={token.latestEnglishAuction}
      hideViccUser={hideViccUser}
      isDesktopLayout={isDesktopLayout}
      useConversionRate
    />
  );
};

TokenAuctionDetails.fragments = {
  token: gql`
    fragment TokenAuctionDetails_token on Token {
      assetId
      slug
      latestEnglishAuction {
        id
        ...useGetAuctionDetails_auction
        ...AuctionDetails_auction
      }
    }
    ${useGetAuctionDetails.fragments.auction}
    ${AuctionDetails.fragments.auction}
  ` as TypedDocumentNode<TokenAuctionDetails_token>,
};
