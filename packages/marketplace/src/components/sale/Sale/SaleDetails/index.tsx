import { TypedDocumentNode, gql } from '@apollo/client';
import { isFuture, parseISO } from 'date-fns';

import { EndedSaleDetails } from './EndedSaleDetails';
import { LiveSaleDetails } from './LiveSaleDetails';
import {
  SaleDetails_offer,
  SaleDetails_token,
} from './__generated__/index.graphql';

type Props = {
  sale: SaleDetails_offer;
  token: SaleDetails_token;
  isDesktopLayout?: boolean;
  stackedTokensCount?: number;
  displayMarketplaceOnboardingTooltip?: boolean;
  allowColumnLayout?: boolean;
  showFees?: boolean;
};

export const SaleDetails = ({
  sale,
  token,
  isDesktopLayout,
  stackedTokensCount,
  displayMarketplaceOnboardingTooltip,
  allowColumnLayout,
  showFees,
}: Props) => {
  const isLive = sale?.endDate ? isFuture(parseISO(sale?.endDate)) : true;

  if (isLive) {
    return (
      <LiveSaleDetails
        sale={sale}
        token={token}
        isDesktopLayout={isDesktopLayout}
        stackedTokensCount={stackedTokensCount}
        displayMarketplaceOnboardingTooltip={
          displayMarketplaceOnboardingTooltip
        }
        allowColumnLayout={allowColumnLayout}
        showFees={showFees}
      />
    );
  }

  return (
    <EndedSaleDetails
      sale={sale}
      token={token}
      allowColumnLayout={allowColumnLayout}
    />
  );
};

SaleDetails.fragments = {
  token: gql`
    fragment SaleDetails_token on Token {
      assetId
      slug
      ...LiveSaleDetails_token
      ...EndedSaleDetails_token
    }
    ${LiveSaleDetails.fragments.token}
    ${EndedSaleDetails.fragments.token}
  ` as TypedDocumentNode<SaleDetails_token>,
  offer: gql`
    fragment SaleDetails_offer on TokenOffer {
      id
      endDate
      ...LiveSaleDetails_offer
      ...EndedSaleDetails_offer
    }
    ${LiveSaleDetails.fragments.offer}
    ${EndedSaleDetails.fragments.offer}
  ` as TypedDocumentNode<SaleDetails_offer>,
};
