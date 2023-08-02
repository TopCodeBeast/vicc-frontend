import { TypedDocumentNode, gql } from '@apollo/client';
import { differenceInWeeks, parseISO } from 'date-fns';
import styled from 'styled-components';

import { FewLeft } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/FewLeft';
import { InventoryCounter } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/InventoryCounter';
import { ItemCounter } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/ItemCounter';
import { LimitReached } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/LimitReached';
import { New } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/New';
import { ResetIn } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/ResetIn';
import { SoldOut } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/SoldOut';
import { isType } from '@sorare/core/src/lib/gql';

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
          <ResetIn myLimitResetAt={item.myLimitResetAt!} />
        )}
      </Root>
    );
  }

  if (isType(item, 'DeliverableWithNoVariantShopItem')) {
    if (inventory) {
      return null;
    }
    return (
      <Root>
        <Labels>{isNew && <New />}</Labels>
        {noCooldown ? (
          <>
            {item.deliverableCurrentStockCount === 0 ? (
              <SoldOut />
            ) : (
              <FewLeft />
            )}
          </>
        ) : (
          <ResetIn myLimitResetAt={item.myLimitResetAt!} />
        )}
      </Root>
    );
  }

  if (isType(item, 'LevelUpShopItem') || isType(item, 'ExtraSwapShopItem')) {
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
              <ItemCounter
                count={item.myPurchasesCount}
                limit={item.limitPerUser}
              />
            ) : (
              <ResetIn myLimitResetAt={item.myLimitResetAt!} />
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
      ... on DeliverableWithNoVariantShopItem {
        id
        deliverableCurrentStockCount: currentStockCount
      }
    }
  ` as TypedDocumentNode<Header_shopItem>,
};

export default Header;
