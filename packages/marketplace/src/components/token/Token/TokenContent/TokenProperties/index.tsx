import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { ItemPropertiesContainer } from '@marketplace/components/ItemPreview/ui';
// import Bundle from '@marketplace/components/auction/Bundle';
// import { useMarketplaceContext } from '@marketplace/contexts/Marketplace';

import { TokenProperties_token } from './__generated__/index.graphql';

type Props = {
  token: TokenProperties_token;
  isBundledAuction: boolean;
  disableSportSpecific?: boolean;
  TokenPropertiesButtonComponent?: ReactNode;
};

const StyledItemPropertiesContainer = styled(ItemPropertiesContainer)<{
  spaceBetween?: boolean;
}>`
  ${({ spaceBetween }) => spaceBetween && `justify-content: space-between;`};
`;

export const TokenProperties = ({
  token,
  isBundledAuction,
  disableSportSpecific,
  TokenPropertiesButtonComponent,
}: Props) => {
  // const { TokenPropertiesComponent, TokenAuctionEligibility } =
  //   useMarketplaceContext();

  // if (isBundledAuction) {
  //   return (
  //     <StyledItemPropertiesContainer>
  //       <Bundle />
  //       {!disableSportSpecific && (
  //         <TokenAuctionEligibility auction={token.latestEnglishAuction} />
  //       )}
  //     </StyledItemPropertiesContainer>
  //   );
  // }

  // if (!disableSportSpecific) {
  //   return (
  //     <StyledItemPropertiesContainer spaceBetween>
  //       <TokenPropertiesComponent assetId={token.assetId} />
  //       <div>{TokenPropertiesButtonComponent}</div>
  //     </StyledItemPropertiesContainer>
  //   );
  // }

  // return null;
  return <>TokenProperties555</>
};

TokenProperties.fragments = {
  token: gql`
    fragment TokenProperties_token on Token {
      assetId
      slug
      latestEnglishAuction {
        id
        nfts {
          assetId
          slug
        }
      }
    }
  `,
};
