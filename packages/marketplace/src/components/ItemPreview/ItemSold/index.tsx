import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { OwnerTransfer } from '@sorare/core/src/__generated__/globalTypes';

import ItemOwnerSince from '@marketplace/components/ItemPreview/ItemOwnerSince';
import { ItemForSaleSecondRow } from '@marketplace/components/ItemPreview/ui';
import TokenOwnerTransfer from '@marketplace/components/token/TokenOwnerTransfer';

import { ItemOwner } from '../ItemOwner';
import { ItemSold_token } from './__generated__/index.graphql';

export interface Props {
  token: ItemSold_token;
  hideOwner?: boolean;
  galleryOwnerSlug?: string;
  disableSportSpecific?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  & > *:first-child {
    margin-bottom: 5;
  }
  & > *:nth-child(2) {
    margin-bottom: var(--unit);
  }
`;

const TransferInProgress = styled.p`
  height: 40;
  width: 100%;
  font: var(--t-12);
  color: var(--c-neutral-600);
`;

const saleTransferType = [
  OwnerTransfer.SINGLE_SALE_OFFER,
  OwnerTransfer.SINGLE_BUY_OFFER,
  OwnerTransfer.DIRECT_OFFER,
];

const auctionTransferType = [
  OwnerTransfer.ENGLISH_AUCTION,
  OwnerTransfer.BUNDLED_ENGLISH_AUCTION,
];

export const ItemSold = ({
  token,
  hideOwner,
  galleryOwnerSlug,
  disableSportSpecific,
}: Props) => {
  const { owner } = token;

  let ownerVariant;
  if (saleTransferType.includes(owner?.transferType as OwnerTransfer))
    ownerVariant = 'sale' as const;
  else if (auctionTransferType.includes(owner?.transferType as OwnerTransfer))
    ownerVariant = 'auction' as const;

  return (
    <Container>
      {!disableSportSpecific && <TokenOwnerTransfer tokenOwner={owner} />}
      <ItemForSaleSecondRow>
        <ItemOwnerSince token={token} />
      </ItemForSaleSecondRow>
      {!hideOwner && (
        <ItemForSaleSecondRow>
          <ItemOwner
            variant={ownerVariant}
            user={token.owner?.user}
            sport={token.sport}
          />
        </ItemForSaleSecondRow>
      )}
      {owner?.user && hideOwner && galleryOwnerSlug !== owner.user.slug && (
        <TransferInProgress>
          <FormattedMessage
            id="ItemSold.transferInProgress"
            defaultMessage="Transfer in progress"
          />
        </TransferInProgress>
      )}
    </Container>
  );
};

ItemSold.fragments = {
  token: gql`
    fragment ItemSold_token on Token {
      assetId
      slug
      sport
      owner {
        id
        user {
          slug
          ...ItemOwner_user
        }
        ...TokenOwnerTransfer_owner
      }
      ...ItemOwnerSince_token
    }
    ${ItemOwnerSince.fragments.token}
    ${ItemOwner.fragments.user}
    ${TokenOwnerTransfer.fragments.tokenOwner}
  ` as TypedDocumentNode<ItemSold_token>,
};

export default ItemSold;
