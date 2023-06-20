import { gql } from '@apollo/client';
import styled from 'styled-components';

import { Text14, Title3 } from '@sorare/core/src/atoms/typography';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  Equipped,
  OldPrice,
  OrderConfirmed,
  Owned,
} from '@sorare/football/src/components/shopItems/ShopItemPicker/Item/Label';
import { canEquip } from '@sorare/football/src/components/shopItems/ShopItemPicker/utils';
import CoinAmount from '@sorare/football/src/components/user/CoinAmount';

import { Details_shopItem } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CenteredText = styled(Text14)`
  text-align: center;
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  item: Details_shopItem;
  itemEquipped?: boolean;
  orderConfirmed?: boolean;
};
const Details = ({ item, itemEquipped, orderConfirmed }: Props) => {
  const hasSalePrice = typeof item.salePrice === 'number';
  const realPrice = hasSalePrice ? item.salePrice! : item.price;
  const ItemStatus = itemEquipped ? Equipped : Owned;

  const displayPrice = !canEquip(item) && !orderConfirmed;

  return (
    <Root>
      {orderConfirmed && <OrderConfirmed />}
      {canEquip(item) && <ItemStatus />}
      {displayPrice && (
        <FlexContainer>
          <CoinAmount amount={realPrice} />
          {hasSalePrice && <OldPrice value={item.price} />}
        </FlexContainer>
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
  `,
};

export default Details;
