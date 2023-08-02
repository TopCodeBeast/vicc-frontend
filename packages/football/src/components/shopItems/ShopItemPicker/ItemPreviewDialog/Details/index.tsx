import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { Text14, Title3 } from '@sorare/core/src/atoms/typography';
import { CoinPrice } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/CoinPrice';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  Equipped,
  OrderConfirmed,
  Owned,
} from '@football/components/shopItems/ShopItemPicker/Item/Label';
import { canEquip } from '@football/components/shopItems/ShopItemPicker/utils';

import { Details_shopItem } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CenteredText = styled(Text14)`
  text-align: center;
`;

type Props = {
  item: Details_shopItem;
  itemEquipped?: boolean;
  orderConfirmed?: boolean;
};
const Details = ({ item, itemEquipped, orderConfirmed }: Props) => {
  const ItemStatus = itemEquipped ? Equipped : Owned;

  const displayPrice = !canEquip(item) && !orderConfirmed;

  return (
    <Root>
      {orderConfirmed && <OrderConfirmed />}
      {canEquip(item) && <ItemStatus />}
      {displayPrice && (
        <CoinPrice price={item.price} salePrice={item.salePrice} />
      )}
      <Title3>{item.name}</Title3>
      <CenteredText color="var(--c-neutral-500)">
        {item.description}
      </CenteredText>
    </Root>
  );
};

Details.fragments = {
  shopItem: gql`
    fragment Details_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        name
        description
        position
        price
        salePrice
        myPurchasesCount
      }
    }
  ` as TypedDocumentNode<Details_shopItem>,
};

export default Details;
