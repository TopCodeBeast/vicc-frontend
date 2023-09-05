import { TypedDocumentNode, gql } from '@apollo/client';

import ItemSold from '@marketplace/components/ItemPreview/ItemSold';
import useGetAuctionDetails from '@marketplace/hooks/offers/useGetAuctionDetails';
import useGetTokenSingleSaleDetails from '@marketplace/hooks/offers/useGetTokenSingleSaleDetails';

import { TokenAuctionDetails } from './TokenAuctionDetails';
import { TokenOfferDetails } from './TokenOfferDetails';
import { TokenDetails_token } from './__generated__/index.graphql';

type Props = {
  token: TokenDetails_token;
  stackedTokensCount?: number;
  isDesktopLayout: boolean;
  hideViccUser?: boolean;
  hideOwner?: boolean;
  galleryOwnerSlug?: string;
  disableSportSpecific?: boolean;
  displayMarketplaceOnboardingTooltip?: boolean;
};

export const TokenDetails = ({
  token,
  stackedTokensCount,
  isDesktopLayout,
  hideViccUser,
  hideOwner,
  galleryOwnerSlug,
  disableSportSpecific,
  displayMarketplaceOnboardingTooltip,
}: Props) => {
  const auction = useGetAuctionDetails(token.latestEnglishAuction);
  const offer = useGetTokenSingleSaleDetails(token);

  if (offer) {
    return (
      <TokenOfferDetails
        token={token}
        stackedTokensCount={stackedTokensCount}
        isDesktopLayout={isDesktopLayout}
        displayMarketplaceOnboardingTooltip={
          displayMarketplaceOnboardingTooltip
        }
      />
    );
  }

  if (auction) {
    return (
      <TokenAuctionDetails
        token={token}
        hideViccUser={hideViccUser}
        isDesktopLayout={isDesktopLayout}
      />
    );
  }

  return (
    <ItemSold
      token={token}
      hideOwner={hideOwner}
      galleryOwnerSlug={galleryOwnerSlug}
      disableSportSpecific={disableSportSpecific}
    />
  );
};

TokenDetails.fragments = {
  token: gql`
    fragment TokenDetails_token on Token {
      assetId
      slug
      latestEnglishAuction {
        id
        ...useGetAuctionDetails_auction
      }
      ...useGetTokenSingleSaleDetails_token
      ...TokenOfferDetails_token
      ...TokenAuctionDetails_token
      ...ItemSold_token
    }
    ${useGetAuctionDetails.fragments.auction}
    ${useGetTokenSingleSaleDetails.fragments.token}
    ${TokenOfferDetails.fragments.token}
    ${TokenAuctionDetails.fragments.token}
    ${ItemSold.fragments.token}
  ` as TypedDocumentNode<TokenDetails_token>,
};
