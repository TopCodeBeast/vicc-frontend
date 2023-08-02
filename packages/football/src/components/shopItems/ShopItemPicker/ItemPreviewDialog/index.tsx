import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import { Text14 } from '@sorare/core/src/atoms/typography';
import CoinAmount from '@sorare/core/src/components/clubShop/CoinAmount';
import Dialog from '@sorare/core/src/components/dialog';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isType } from '@sorare/core/src/lib/gql';

import { DeliverableWithNoVariantContent } from './Content/DeliverableWithNoVariantContent';
import { ExtraSwapContent } from './Content/ExtraSwapContent';
import { ExtraTeamsContent } from './Content/ExtraTeamsContent';
import { JerseyContent } from './Content/JerseyContent';
import { LevelUpContent } from './Content/LevelUpContent';
import { LogoContent } from './Content/LogoContent';
import { SkinContent } from './Content/SkinContent';
import {
  ItemPreviewDialog_shopItem,
  ItemPreviewDialog_user,
} from './__generated__/index.graphql';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  padding: var(--triple-unit);
`;
const MyBalance = styled.div`
  justify-self: flex-end;
  display: flex;
  justify-content: space-between;
  padding: var(--double-unit);
  border-top: 1px solid var(--c-neutral-300);
`;

type DialogContentProps = {
  item: ItemPreviewDialog_shopItem;
  inventory: boolean;
  onClose: () => void;
  userCoinBalance: number;
  onBuy?: () => void;
  itemEquipped?: boolean;
  onSelect?: () => void;
};
const DialogContent = ({
  item,
  onClose,
  inventory,
  userCoinBalance,
  onBuy,
  itemEquipped,
  onSelect,
}: DialogContentProps) => {
  if (isType(item, 'JerseyShopItem')) {
    return (
      <JerseyContent
        item={item}
        onClose={onClose}
        userCoinBalance={userCoinBalance}
        inventory={inventory}
      />
    );
  }
  if (isType(item, 'DeliverableWithNoVariantShopItem')) {
    return (
      <DeliverableWithNoVariantContent
        item={item}
        onClose={onClose}
        userCoinBalance={userCoinBalance}
        inventory={inventory}
      />
    );
  }
  if (isType(item, 'LevelUpShopItem')) {
    return (
      <LevelUpContent
        item={item}
        onClose={onClose}
        inventory={inventory}
        userCoinBalance={userCoinBalance}
        onBuy={onBuy}
      />
    );
  }
  if (isType(item, 'ExtraSwapShopItem')) {
    return (
      <ExtraSwapContent
        item={item}
        onClose={onClose}
        inventory={inventory}
        userCoinBalance={userCoinBalance}
        onBuy={onBuy}
      />
    );
  }
  if (isType(item, 'SkinShopItem')) {
    if (item.position === ShopItemType.LOGO) {
      return <LogoContent item={item} onSelect={onSelect} />;
    }

    return (
      <SkinContent
        inventory={inventory}
        item={item}
        itemEquipped={itemEquipped}
        userCoinBalance={userCoinBalance}
        onBuy={onBuy}
      />
    );
  }

  if (item.position === ShopItemType.EXTRA_TEAMS_CAP) {
    return (
      <ExtraTeamsContent
        item={item}
        inventory={inventory}
        onBuy={onBuy}
        userCoinBalance={userCoinBalance}
        onClose={onClose}
      />
    );
  }
  return null;
};

type Props = {
  open: boolean;
  onSelect?: () => void;
  item: ItemPreviewDialog_shopItem;
  itemEquipped?: boolean;
  inventory?: boolean;
  onClose: () => void;
  onBuy?: () => void;
};
export const ItemPreviewDialog = ({
  open,
  item,
  inventory,
  onClose,
  onBuy,
  itemEquipped,
  onSelect,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const userCoinBalance = currentUser?.coinBalance || 0;

  return (
    <Dialog
      darkTheme
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      body={
        <Body>
          <DialogContent
            item={item}
            onClose={onClose}
            inventory={!!inventory}
            userCoinBalance={userCoinBalance}
            onBuy={onBuy}
            itemEquipped={itemEquipped}
            onSelect={onSelect}
          />
        </Body>
      }
      footer={
        <MyBalance>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="ClubShop.ItemPreviewDialog.CurrentBalance"
              defaultMessage="Current balance"
            />
          </Text14>
          <CoinAmount amount={userCoinBalance} />
        </MyBalance>
      }
    />
  );
};

ItemPreviewDialog.fragments = {
  shopItem: gql`
    fragment ItemPreviewDialog_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
      }
      ...JerseyContent_clubShopItem
      ...DeliverableWithNoVariantContent_clubShopItem
      ...LevelUpContent_clubShopItem
      ...ExtraSwapContent_clubShopItem
      ...SkinContent_clubShopItem
      ...LogoContent_clubShopItem
      ...ExtraTeamsContent_clubShopItem
    }
    ${JerseyContent.fragments.clubShopItem}
    ${DeliverableWithNoVariantContent.fragments.clubShopItem}
    ${LevelUpContent.fragments.clubShopItem}
    ${ExtraSwapContent.fragments.clubShopItem}
    ${LogoContent.fragments.clubShopItem}
    ${SkinContent.fragments.clubShopItem}
    ${ExtraTeamsContent.fragments.clubShopItem}
  ` as TypedDocumentNode<ItemPreviewDialog_shopItem>,
  user: gql`
    fragment ItemPreviewDialog_user on PublicUserInfoInterface {
      slug
      profile {
        id
        clubBanner {
          id
        }
        clubShield {
          id
        }
      }
    }
  ` as TypedDocumentNode<ItemPreviewDialog_user>,
};
