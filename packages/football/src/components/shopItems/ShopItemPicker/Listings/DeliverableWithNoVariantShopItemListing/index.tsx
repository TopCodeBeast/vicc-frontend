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
import { OrderConfirmed } from '@football/components/shopItems/ShopItemPicker/Item/Label';
import { ItemPreviewDialog } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog';

import { DeliverableWithNoVariantShopItemListing_deliverableWithNoVariantShopItem } from './__generated__/index.graphql';

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
  item: DeliverableWithNoVariantShopItemListing_deliverableWithNoVariantShopItem;
  inDialog?: boolean;
  inventory?: boolean;
};

export const DeliverableWithNoVariantShopItemListing = ({
  onSelect,
  item,
  inDialog,
  inventory,
}: Props) => {
  const [showDialog, setShowDialog] = useState(false);
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
              inventory ? (
                <OrderConfirmed color="var(--c-neutral-1000)" />
              ) : (
                <CoinPrice price={item.price} salePrice={item.salePrice} />
              )
            }
          />
        </FooterWrapper>
      </Item>
      <ItemPreviewDialog
        open={showDialog}
        item={item}
        itemEquipped={false}
        inventory={inventory}
        onSelect={onSelect}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

DeliverableWithNoVariantShopItemListing.fragments = {
  deliverableWithNoVariantShopItem: gql`
    fragment DeliverableWithNoVariantShopItemListing_deliverableWithNoVariantShopItem on DeliverableWithNoVariantShopItem {
      ... on ShopItemInterface {
        id
        position
        pictureUrl
        name
        price
        salePrice
      }
      ...Header_shopItem
      ...ItemPreviewDialog_shopItem
    }
    ${Header.fragments.shopItem}
    ${ItemPreviewDialog.fragments.shopItem}
  ` as TypedDocumentNode<DeliverableWithNoVariantShopItemListing_deliverableWithNoVariantShopItem>,
};
