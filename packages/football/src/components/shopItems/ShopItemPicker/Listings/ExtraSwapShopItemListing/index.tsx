import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { useState } from 'react';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import ResponsiveImg from '@sorare/core/src/atoms/ui/ResponsiveImg';
import { ClubShopItemFooter } from '@sorare/core/src/components/clubShop/ClubShopItem/ClubShopItemFooter';
import { CoinPrice } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/CoinPrice';

import { Item } from '@football/components/shopItems/ShopItemPicker//Item';
import Header from '@football/components/shopItems/ShopItemPicker/Item/Header';
import { ItemPreviewDialog } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog';

import { ExtraSwapShopItemListing_ExtraSwapShopItem } from './__generated__/index.graphql';

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
  item: ExtraSwapShopItemListing_ExtraSwapShopItem;
  inDialog?: boolean;
  inventory?: boolean;
};

export const ExtraSwapShopItemListing = ({
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
              inventory ? null : (
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

ExtraSwapShopItemListing.fragments = {
  ExtraSwapShopItem: gql`
    fragment ExtraSwapShopItemListing_ExtraSwapShopItem on ExtraSwapShopItem {
      ... on ShopItemInterface {
        id
        name
        position
        pictureUrl
        price
        salePrice
      }
      ...Header_shopItem
      ...ItemPreviewDialog_shopItem
    }
    ${Header.fragments.shopItem}
    ${ItemPreviewDialog.fragments.shopItem}
  ` as TypedDocumentNode<ExtraSwapShopItemListing_ExtraSwapShopItem>,
};
