import { TypedDocumentNode, gql } from '@apollo/client';
import { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { InventoryCounterInline } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/InventoryCounterInline';
import { ResetIn } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/ResetIn';
import { FOOTBALL_CLUB_SHOP_INVENTORY } from '@sorare/core/src/constants/routes';

import { ConsumableCta_shopItem } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  gap: var(--unit);
  flex-direction: column;
  align-items: center;
`;

type ConsumableCtaProps = PropsWithChildren<{
  item: ConsumableCta_shopItem;
  inventory?: boolean;
  onClose: () => void;
}>;
const ConsumableCta = ({
  item,
  inventory,
  onClose,
  children,
}: ConsumableCtaProps) => {
  const cooldown = item.myLimitResetAt !== null;
  return (
    <Root>
      <InventoryCounterInline
        amount={item.myAvailableTotalPurchasesCount}
        name={item.name}
      />
      {cooldown && !inventory && (
        <ResetIn myLimitResetAt={item.myLimitResetAt!} />
      )}
      {children}
      {!inventory && (
        <Button
          component={Link}
          to={FOOTBALL_CLUB_SHOP_INVENTORY}
          color="white"
          medium
          onClick={onClose}
        >
          <FormattedMessage
            id="ClubShop.ItemPreviewDialog.Cta.Inventory"
            defaultMessage="Go to inventory"
          />
        </Button>
      )}
    </Root>
  );
};

ConsumableCta.fragments = {
  shopItem: gql`
    fragment ConsumableCta_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        name
        myAvailableTotalPurchasesCount
        myLimitResetAt
      }
    }
  ` as TypedDocumentNode<ConsumableCta_shopItem>,
};

export default ConsumableCta;
