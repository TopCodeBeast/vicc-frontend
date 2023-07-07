import { gql } from '@apollo/client';
import { isFuture, parseISO } from 'date-fns';

// import { SaleDetails } from '@marketplace/components/sale/Sale/SaleDetails';

import { TokenOfferDetails_token } from './__generated__/index.graphql';

type Props = {
  token: TokenOfferDetails_token;
  isDesktopLayout: boolean;
  stackedTokensCount?: number;
  displayMarketplaceOnboardingTooltip?: boolean;
  allowColumnLayout?: boolean;
};

export const TokenOfferDetails = ({
  token,
  isDesktopLayout,
  stackedTokensCount,
  displayMarketplaceOnboardingTooltip,
  allowColumnLayout,
}: Props) => {
  // const singleSaleOffer =
  //   token.liveSingleSaleOffer || token.myMintedSingleSaleOffer;

  // const isLive = singleSaleOffer?.endDate
  //   ? isFuture(parseISO(singleSaleOffer?.endDate))
  //   : true;

  // if (!singleSaleOffer || !isLive) return null;

  // return (
  //   <SaleDetails
  //     sale={singleSaleOffer}
  //     token={token}
  //     isDesktopLayout={isDesktopLayout}
  //     stackedTokensCount={stackedTokensCount}
  //     displayMarketplaceOnboardingTooltip={displayMarketplaceOnboardingTooltip}
  //     allowColumnLayout={allowColumnLayout}
  //   />
  // );
  return <>TokenOfferDetails5555</>
};

TokenOfferDetails.fragments = {
  token: gql`
    fragment TokenOfferDetails_token on Token {
      assetId
      slug
      liveSingleSaleOffer {
        id
        #...SaleDetails_offer
      }
      myMintedSingleSaleOffer {
        id
        #...SaleDetails_offer
      }
      #...SaleDetails_token
    }
    #{SaleDetails.fragments.offer}
    #{SaleDetails.fragments.token}
  `,
};
