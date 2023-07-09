import { gql } from '@apollo/client';
import classNames from 'classnames';
import { isFuture, parseISO } from 'date-fns';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';

import {
  ItemImgContainer,
  ItemInfosContainer,
} from '@marketplace/components/ItemPreview/ui';
import TokenDescription from '@marketplace/components/token/TokenDescription';

import { TokenDetails } from './TokenDetails';
import { TokenImg } from './TokenImg';
import { TokenProperties } from './TokenProperties';
import { TokenContent_token } from './__generated__/index.graphql';

export type Props = {
  token: TokenContent_token;
  forceMobileLayout?: boolean;
  forceDesktopLayout?: boolean;
  disableSportSpecific?: boolean;
  hideOwner?: boolean;
  hideSorareUser?: boolean;
  galleryOwnerSlug?: string;
  stackedTokensCount?: number;
  TokenPropertiesButtonComponent?: ReactNode;
  displayMarketplaceOnboardingTooltip?: boolean;
};

const Root = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: var(--intermediate-unit);
  &.isDesktopLayout {
    display: flex;
    flex-direction: column;
  }
`;

export const TokenContent = ({
  token,
  stackedTokensCount,
  forceMobileLayout,
  forceDesktopLayout,
  disableSportSpecific,
  displayMarketplaceOnboardingTooltip,
  hideOwner,
  hideSorareUser,
  galleryOwnerSlug,
  TokenPropertiesButtonComponent,
}: Props) => {
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const isDesktopLayout =
    forceDesktopLayout || (isTabletOrDesktop && !forceMobileLayout);

  const isBundledAuction = !!(
    token.latestEnglishAuction &&
    // isFuture(parseISO(token.latestEnglishAuction.endDate)) && //TODO******
    token.latestEnglishAuction?.nfts?.length > 1
  );

  return (
    <Root className={classNames({ isDesktopLayout })}>
      <ItemImgContainer className={classNames({ isDesktopLayout })}>
        <TokenImg
          token={token}
          stackedTokensCount={stackedTokensCount}
          isBundledAuction={isBundledAuction}
          isDesktopLayout={isDesktopLayout}
        />
      </ItemImgContainer>
      <ItemInfosContainer className={classNames({ isDesktopLayout })}>
        <TokenProperties
          token={token}
          isBundledAuction={isBundledAuction}
          disableSportSpecific={disableSportSpecific}
          TokenPropertiesButtonComponent={TokenPropertiesButtonComponent}
        />
        {!isDesktopLayout && !isBundledAuction && (
          <TokenDescription
            token={token}
            Details={Text14}
            detailsColor="var(--c-neutral-600)"
            withDetails
            disableSportSpecific={disableSportSpecific}
          />
        )}
        <TokenDetails
          token={token}
          stackedTokensCount={stackedTokensCount}
          isDesktopLayout={isDesktopLayout}
          hideSorareUser={hideSorareUser}
          hideOwner={hideOwner}
          galleryOwnerSlug={galleryOwnerSlug}
          disableSportSpecific={disableSportSpecific}
          displayMarketplaceOnboardingTooltip={
            displayMarketplaceOnboardingTooltip
          }
        />
      </ItemInfosContainer>
    </Root>
  );
};

TokenContent.fragments = {
  token: gql`
    fragment TokenContent_token on Token {
      assetId
      slug
      latestEnglishAuction {
        id
        nfts {
          assetId
          slug
        }
      }
      ...TokenImg_token
      ...TokenProperties_token
      ...TokenDescription_token
      ...TokenDetails_token
    }
    ${TokenImg.fragments.token}
    ${TokenProperties.fragments.token}
    ${TokenDescription.fragments.token}
    ${TokenDetails.fragments.token}
  `,
};
