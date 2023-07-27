import { gql } from '@apollo/client';
import classnames from 'classnames';
import { useState } from 'react';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import ResponsiveImg from '@sorare/core/src/atoms/ui/ResponsiveImg';

import ItemPreviewDialog from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog';

import Footer from './Footer';
import Header from './Header';
import { Item_shopItem, Item_user } from './__generated__/index.graphql';

const Root = styled.button`
  display: grid;
  grid-template-rows: 40px 1fr min-content;
  grid-template-areas: 'header' 'image' 'footer';
  gap: var(--double-unit);
  background-color: var(--c-neutral-200);
  border-radius: var(--unit);
  padding: var(--intermediate-unit);
  width: 100%;
  height: 240px;
  &.inDialog {
    background-color: var(--c-neutral-300);
  }
`;
const HeaderWrapper = styled.div`
  grid-area: header;
`;
const FooterWrapper = styled.div`
  grid-area: footer;
`;
const ImageContainer = styled.div`
  grid-area: image;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--half-unit);
  overflow: hidden;
  margin: auto;
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
  user: Item_user | null;
  item: Item_shopItem;
  inDialog?: boolean;
  inventory?: boolean;
};
const Item = ({ onSelect, user, item, inDialog, inventory }: Props) => {
  const [showDialog, setShowDialog] = useState(false);

  const { clubShield, clubBanner } = user?.profile || {};
  const itemEquipped = [clubShield?.id, clubBanner?.id].includes(item.id);

  return (
    <>
      <Root
        className={classnames({ inDialog })}
        onClick={() => setShowDialog(true)}
      >
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
          <Footer
            item={item}
            itemEquipped={itemEquipped}
            inventory={inventory}
          />
        </FooterWrapper>
      </Root>
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

Item.fragments = {
  shopItem: gql`
    fragment Item_shopItem on ClubShopItem {
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
      ...Footer_shopItem
      ...ItemPreviewDialog_shopItem
    }
    ${Header.fragments.shopItem}
    ${Footer.fragments.shopItem}
    ${ItemPreviewDialog.fragments.shopItem}
  `,
  user: gql`
    fragment Item_user on PublicUserInfoInterface {
      slug
      ...ItemPreviewDialog_user
    }
    ${ItemPreviewDialog.fragments.user},
  `,
};

export default Item;
