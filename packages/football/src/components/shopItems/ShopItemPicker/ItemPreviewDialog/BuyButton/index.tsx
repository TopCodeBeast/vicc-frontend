import { TypedDocumentNode, gql } from '@apollo/client';

import { ClubShopItemBuyButton } from '@sorare/core/src/components/clubShop/ClubShopItem/ClubShopItemDialog/ClubShopItemBuyButton';

import { BuyButton_clubShopItem } from './__generated__/index.graphql';

type Props = {
  item: any;
  userCoinBalance: number;
  cannotSelectYet?: boolean;
  onClick: () => void;
  soldOut?: boolean;
  loading?: boolean;
};

export const BuyButton = ({
  item,
  userCoinBalance,
  cannotSelectYet,
  onClick,
  soldOut,
  loading,
}: Props) => {
  const realPrice = item.salePrice ?? item.price;
  const hasCooldown = item.myLimitResetAt !== null;
  const limitReached = item.myPurchasesCount === item.limitPerUser;
  const requirementsNotMet = item.disabled;

  const lockedItem =
    realPrice > userCoinBalance ||
    limitReached ||
    hasCooldown ||
    requirementsNotMet;
  const cantBuy = lockedItem || soldOut || cannotSelectYet;

  return (
    <ClubShopItemBuyButton
      disabled={cantBuy}
      loading={Boolean(loading)}
      locked={lockedItem}
      soldOut={soldOut && !hasCooldown}
      onClick={onClick}
    />
  );
};

BuyButton.fragments = {
  clubShopItem: gql`
    fragment BuyButton_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        myLimitResetAt
        limitPerUser
        myPurchasesCount
        price
        salePrice
      }
    }
  ` as TypedDocumentNode<BuyButton_clubShopItem>,
};
