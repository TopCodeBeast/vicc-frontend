import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';

export const isConsumable = (item: { position: ShopItemType }) =>
  ![ShopItemType.BANNER, ShopItemType.SHIELD, ShopItemType.LOGO].includes(
    item.position
  );

export const canEquip = (item: {
  position: ShopItemType;
  myPurchasesCount: number;
}) => item.myPurchasesCount > 0 && !isConsumable(item);

export const limitReached = (item: {
  myPurchasesCount: number;
  limitPerUser: number;
}) => item.myPurchasesCount === item.limitPerUser;
