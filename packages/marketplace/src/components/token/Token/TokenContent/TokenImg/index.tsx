import { gql } from '@apollo/client';

import StackedToken from '@sorare/core/src/components/token/StackedToken';

// import { BundledAuctionPreview } from '@marketplace/components/auction/BundledAuctionPreview';
import FlexToken from '@marketplace/components/token/FlexToken';

import { TokenImg_token } from './__generated__/index.graphql';

type Props = {
  token: TokenImg_token;
  stackedTokensCount?: number;
  isBundledAuction?: boolean;
  isDesktopLayout: boolean;
};

export const TokenImg = ({
  token,
  stackedTokensCount,
  isBundledAuction,
  isDesktopLayout,
}: Props) => {
  const imageWidth = isDesktopLayout ? 320 : 160;

  if (stackedTokensCount && stackedTokensCount > 1) {
    return (
      <StackedToken
        token={token}
        count={stackedTokensCount}
        width={imageWidth}
      />
    );
  }

  if (token.latestEnglishAuction && isBundledAuction) {
    return (
      // <BundledAuctionPreview
      //   bundledAuction={token.latestEnglishAuction}
      //   displayOneCard={!isDesktopLayout}
      //   noMargin
      // />
      <>BundledAuctionPreview555</>
    );
  }

  return <FlexToken token={token} width={imageWidth} withLink />;
};

TokenImg.fragments = {
  token: gql`
    fragment TokenImg_token on Token {
      assetId
      slug
      latestEnglishAuction {
        id
        nfts {
          assetId
          slug
        }
        #...BundledAuctionPreview_auction
      }
      ...FlexToken_token
      ...StackedToken_token
    }
    ${FlexToken.fragments.token}
    ${StackedToken.fragments.token}
    #{BundledAuctionPreview.fragments.auction}
  `,
};
