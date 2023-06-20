import { gql } from '@apollo/client';
import styled from 'styled-components';

import {
  ExtraSwapShopItem,
  LevelUpShopItem,
  XPRestoreShopItem,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { isA, isType } from '@sorare/core/src/lib/gql';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  Equipped,
  OldPrice,
  OrderConfirmed,
  Owned,
} from '@sorare/football/src/components/shopItems/ShopItemPicker/Item/Label';
import CoinAmount from '@sorare/football/src/components/user/CoinAmount';

import { Footer_shopItem } from './__generated__/index.graphql';

const Root = styled.div`
  text-align: left;
`;
const FlexContainer = styled.div`
  display: flex;
  gap: var(--unit);
`;

type Props = {
  item: Footer_shopItem;
  itemEquipped: boolean;
  inventory?: boolean;
};
const Footer = ({ item, itemEquipped, inventory }: Props) => {
  const ItemStatus = itemEquipped ? Equipped : Owned;
  const hasSalePrice = typeof item.salePrice === 'number';

  if (
    isA<LevelUpShopItem>('LevelUpShopItem', item) ||
    isA<ExtraSwapShopItem>('ExtraSwapShopItem', item) ||
    isA<XPRestoreShopItem>('XPRestoreShopItem', item)
  ) {
    return (
      <Root>
        {!inventory && (
          <FlexContainer>
            <CoinAmount amount={hasSalePrice ? item.salePrice! : item.price} />
            {hasSalePrice && <OldPrice value={item.price} />}
          </FlexContainer>
        )}
        <Text14 color="var(--c-neutral-600)">{item.name}</Text14>
      </Root>
    );
  }

  if (isType(item, 'JerseyShopItem')) {
    return (
      <Root>
        {inventory ? (
          <OrderConfirmed color="var(--c-neutral-1000)" />
        ) : (
          <FlexContainer>
            <CoinAmount amount={hasSalePrice ? item.salePrice! : item.price} />
            {hasSalePrice && <OldPrice value={item.price} />}
          </FlexContainer>
        )}
        <Text14 color="var(--c-neutral-600)">{item.name}</Text14>
      </Root>
    );
  }

  const itemUnlocked = item.myPurchasesCount > 0;
  return (
    <Root>
      {inventory ? (
        <ItemStatus />
      ) : (
        <>
          {itemUnlocked ? (
            <ItemStatus />
          ) : (
            <FlexContainer>
              <CoinAmount
                amount={hasSalePrice ? item.salePrice! : item.price}
              />
              {hasSalePrice && <OldPrice value={item.price} />}
            </FlexContainer>
          )}
        </>
      )}
      <Text14 color="var(--c-neutral-600)">{item.name}</Text14>
    </Root>
  );
};

Footer.fragments = {
  shopItem: gql`
    fragment Footer_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        name
        price
        salePrice
        myPurchasesCount
      }
    }
  `,
};

export default Footer;
