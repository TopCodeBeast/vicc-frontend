import { gql } from '@apollo/client';
import { differenceInWeeks, parseISO } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  ExtraSwapShopItem,
  LevelUpShopItem,
  XPRestoreShopItem,
} from '@sorare/core/src/__generated__/globalTypes';
import { Caption } from '@sorare/core/src/atoms/typography';
import { isA, isType } from '@sorare/core/src/lib/gql';

import {
  FewLeft,
  InventoryCounter,
  LimitReached,
  New,
  ResetIn,
  SoldOut,
} from '@football/components/shopItems/ShopItemPicker/Item/Label';

import { Header_shopItem } from './__generated__/index.graphql';

const Root = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
const Labels = styled.div`
  display: flex;
  gap: var(--half-unit);
  flex-direction: column;
  align-items: flex-start;
`;
const Counter = styled(Caption)`
  display: flex;
  gap: var(--half-unit);
`;

type ItemCounterProps = {
  item: {
    myPurchasesCount: number;
    limitPerUser: number;
  };
};
const ItemCounter = ({ item }: ItemCounterProps) => (
  <Counter color="var(--c-neutral-1000)">
    <FormattedMessage
      id="ShopItemPicker.Item.Counter"
      defaultMessage="{myPurchasesCount} / {limitPerUser}"
      values={{
        myPurchasesCount: item.myPurchasesCount,
        limitPerUser: item.limitPerUser,
      }}
    />
  </Counter>
);

type Props = { item: Header_shopItem; inventory?: boolean };
const Header = ({ item, inventory }: Props) => {
  const isNew = differenceInWeeks(new Date(), parseISO(item.createdAt)) === 0;
  const limitReached = item.myPurchasesCount === item.limitPerUser;
  const noCooldown = item.myLimitResetAt === null;

  if (isType(item, 'JerseyShopItem')) {
    if (inventory) {
      return null;
    }
    return (
      <Root>
        <Labels>{isNew && <New />}</Labels>
        {noCooldown ? (
          <>{item.currentStockCount === 0 ? <SoldOut /> : <FewLeft />}</>
        ) : (
          <ResetIn time={parseISO(item.myLimitResetAt!)} />
        )}
      </Root>
    );
  }

  if (
    isA<LevelUpShopItem>('LevelUpShopItem', item) ||
    isA<ExtraSwapShopItem>('ExtraSwapShopItem', item) ||
    isA<XPRestoreShopItem>('XPRestoreShopItem', item)
  ) {
    return (
      <Root>
        {inventory ? (
          <InventoryCounter amount={item.myAvailableTotalPurchasesCount} />
        ) : (
          <>
            <Labels>
              {isNew && <New />}
              {limitReached && noCooldown && <LimitReached />}
            </Labels>
            {noCooldown ? (
              <ItemCounter item={item} />
            ) : (
              <ResetIn time={parseISO(item.myLimitResetAt!)} />
            )}
          </>
        )}
      </Root>
    );
  }

  return !inventory ? (
    <Root>
      <Labels>{isNew && <New />}</Labels>
    </Root>
  ) : null;
};

Header.fragments = {
  shopItem: gql`
    fragment Header_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        createdAt
        limitPerUser
        myLimitResetAt
        myPurchasesCount
        myAvailableTotalPurchasesCount
      }
      ... on JerseyShopItem {
        id
        currentStockCount
      }
    }
  `,
};

export default Header;
