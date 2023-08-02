import { TypedDocumentNode, gql } from '@apollo/client';
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

type Props = {
  token: TokenContent_token;
  hideOwner?: boolean;
  disableSportSpecific?: boolean;
  displayMarketplaceOnboardingTooltip?: boolean;
  forceMobileLayout?: boolean;
  forceDesktopLayout?: boolean;
  galleryOwnerSlug?: string;
  hideSorareUser?: boolean;
  stackedTokensCount?: number;
  TokenPropertiesButtonComponent?: ReactNode;
  hideDetails: boolean;
  action?: ReactNode;
};

const Root = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: var(--intermediate-unit);
  &.isDesktopLayout {
    display: flex;
    flex-direction: column;
  }
`;

const ActionWrapper = styled.div`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
  display: none;
  ${Root}:hover & {
    display: block;
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
  hideDetails,
  action,
}: Props) => {
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const isDesktopLayout =
    hideDetails ||
    forceDesktopLayout ||
    (isTabletOrDesktop && !forceMobileLayout);

  const isBundledAuction = !!(
    token.latestEnglishAuction &&
    isFuture(parseISO(token.latestEnglishAuction.endDate)) &&
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
        {action && <ActionWrapper>{action}</ActionWrapper>}
      </ItemImgContainer>
      {!hideDetails && (
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
      )}
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
  ` as TypedDocumentNode<TokenContent_token>,
};
