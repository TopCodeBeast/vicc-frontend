import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { useState } from 'react';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import ResponsiveImg from '@sorare/core/src/atoms/ui/ResponsiveImg';
import { ClubShopItemFooter } from '@sorare/core/src/components/clubShop/ClubShopItem/ClubShopItemFooter';
import { CoinPrice } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/CoinPrice';

import { Item } from '@football/components/shopItems/ShopItemPicker/Item';
import Header from '@football/components/shopItems/ShopItemPicker/Item/Header';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  Equipped,
  Owned,
} from '@football/components/shopItems/ShopItemPicker/Item/Label';
import { ItemPreviewDialog } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog';

import {
  DefaultListing_shopItem,
  DefaultListing_user,
} from './__generated__/index.graphql';

const HeaderWrapper = styled.div`
  grid-area: header;
`;
const FooterWrapper = styled.div`
  grid-area: footer;
`;
const ImageContainer = styled.div`
  grid-area: image;
  border-radius: var(--half-unit);
  overflow: hidden;
`;
const ItemImage = styled(ResponsiveImg)`
  width: 80px;
  &.banner {
    width: auto;
    max-width: 300%;
  }
`;

type Props = {
  onSelect?: () => void;
  user: DefaultListing_user | null;
  item: DefaultListing_shopItem;
  inDialog?: boolean;
  inventory?: boolean;
};
export const DefaultListing = ({
  onSelect,
  user,
  item,
  inDialog,
  inventory,
}: Props) => {
  const [showDialog, setShowDialog] = useState(false);

  const { clubShield, clubBanner } = user?.profile || {};
  const itemEquipped = [clubShield?.id, clubBanner?.id].includes(item.id);

  const itemUnlocked = item.myPurchasesCount > 0;
  const ItemStatus = itemEquipped ? Equipped : Owned;

  return (
    <>
      <Item inDialog={inDialog} onClick={() => setShowDialog(true)}>
        <HeaderWrapper>
          <Header item={item} inventory={inventory} />
        </HeaderWrapper>
        <ImageContainer>
          <ItemImage
            className={classnames({
              banner: item.position === ShopItemType.BANNER,
            })}
            cropWidth={320}
            src={item.pictureUrl}
            alt={item.name}
          />
        </ImageContainer>
        <FooterWrapper>
          <ClubShopItemFooter
            name={item.name}
            status={
              <>
                {inventory ? (
                  <ItemStatus />
                ) : (
                  <>
                    {itemUnlocked ? (
                      <ItemStatus />
                    ) : (
                      <CoinPrice
                        price={item.price}
                        salePrice={item.salePrice}
                      />
                    )}
                  </>
                )}
              </>
            }
          />
        </FooterWrapper>
      </Item>
      <ItemPreviewDialog
        open={showDialog}
        item={item}
        itemEquipped={itemEquipped}
        inventory={inventory}
        onSelect={onSelect}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

DefaultListing.fragments = {
  shopItem: gql`
    fragment DefaultListing_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        createdAt
        name
        position
        pictureUrl
        price
        salePrice
        limitPerUser
        myLimitResetAt
        myPurchasesCount
        myAvailableTotalPurchasesCount
      }
      ...Header_shopItem
      ...ItemPreviewDialog_shopItem
    }
    ${Header.fragments.shopItem}
    ${ItemPreviewDialog.fragments.shopItem}
  ` as TypedDocumentNode<DefaultListing_shopItem>,
  user: gql`
    fragment DefaultListing_user on PublicUserInfoInterface {
      slug
      ...ItemPreviewDialog_user
    }
    ${ItemPreviewDialog.fragments.user},
  ` as TypedDocumentNode<DefaultListing_user>,
};
