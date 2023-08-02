import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { ResetIn } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/ResetIn';
import { isType } from '@sorare/core/src/gql';

import { BuyButton } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton';
import Congrats from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Congrats';
import PostalAdressForm from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Content/PostalAdressForm';
import Details from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Details';
import ItemImagePreview from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ItemImagePreview';
import { Requirements } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Requirements';

import { DeliverableWithNoVariantContent_clubShopItem } from './__generated__/index.graphql';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  item: DeliverableWithNoVariantContent_clubShopItem;
  userCoinBalance: number;
  onClose: () => void;
  inventory: boolean;
};

export const DeliverableWithNoVariantContent = ({
  item,
  userCoinBalance,
  onClose,
  inventory,
}: Props) => {
  const [currentStep, setCurrentStep] = useState<
    'preview' | 'postalAddress' | 'congrats'
  >(inventory ? 'congrats' : 'preview');

  if (!isType(item, 'DeliverableWithNoVariantShopItem')) {
    return null;
  }

  const hasCooldown = item.myLimitResetAt !== null;

  if (currentStep === 'preview') {
    return (
      <>
        <ItemImagePreview
          pictureUrl={item.pictureUrl}
          name={item.name}
          type={item.position}
        />
        <Details item={item} />
        <Wrapper>
          {item.disabled && <Requirements item={item} />}
          {hasCooldown && <ResetIn myLimitResetAt={item.myLimitResetAt!} />}
        </Wrapper>
        <BuyButton
          item={item}
          soldOut={item.deliverableCurrentStockCount === 0}
          userCoinBalance={userCoinBalance}
          onClick={() => setCurrentStep('postalAddress')}
        />
      </>
    );
  }
  if (currentStep === 'postalAddress') {
    return (
      <PostalAdressForm
        item={item}
        nextStep={() => setCurrentStep('congrats')}
      />
    );
  }
  return <Congrats item={item} inventory={inventory} onClose={onClose} />;
};

DeliverableWithNoVariantContent.fragments = {
  clubShopItem: gql`
    fragment DeliverableWithNoVariantContent_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        pictureUrl
        name
        position
        disabled
        myLimitResetAt
      }
      ... on DeliverableWithNoVariantShopItem {
        id
        deliverableCurrentStockCount: currentStockCount
      }
      ...Details_shopItem
      ...Requirements_clubShopItem
      ...PostalAdressForm_shopItem
      ...BuyButton_clubShopItem
      ...Congrats_shopItem
    }
    ${Details.fragments.shopItem}
    ${Requirements.fragments.clubShopItem}
    ${BuyButton.fragments.clubShopItem}
    ${PostalAdressForm.fragments.shopItem}
    ${Congrats.fragments.shopItem}
  ` as TypedDocumentNode<DeliverableWithNoVariantContent_clubShopItem>,
};
