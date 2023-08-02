import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';

import { ShirtSize } from '@sorare/core/src/__generated__/globalTypes';
import { isType } from '@sorare/core/src/gql';

import Congrats from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Congrats';
import { SizeSelectionStep } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Content/JerseyContent/SizeSelectionStep';
import PostalAdressForm from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Content/PostalAdressForm';

import { JerseyContent_clubShopItem } from './__generated__/index.graphql';

type Props = {
  item: JerseyContent_clubShopItem;
  userCoinBalance: number;
  onClose: () => void;
  inventory: boolean;
};

export const JerseyContent = ({
  item,
  userCoinBalance,
  onClose,
  inventory,
}: Props) => {
  const availableSizes =
    (isType(item, 'JerseyShopItem') &&
      item.variantStockCounts
        .filter(v => v.currentStockCount > 0)
        .map(v => v.size)) ||
    [];
  const initialSize = availableSizes.length === 1 ? availableSizes[0] : null;
  const [selectedSize, setSelectedSize] = useState<ShirtSize | null>(
    initialSize
  );

  const [currentStep, setCurrentStep] = useState<
    'selectSize' | 'postalAddress' | 'congrats'
  >(inventory ? 'congrats' : 'selectSize');
  if (!isType(item, 'JerseyShopItem')) {
    return null;
  }

  if (currentStep === 'selectSize') {
    return (
      <SizeSelectionStep
        item={item}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        nextStep={() => setCurrentStep('postalAddress')}
        userCoinBalance={userCoinBalance}
      />
    );
  }
  if (currentStep === 'postalAddress') {
    return (
      <PostalAdressForm
        item={item}
        selectedSize={selectedSize!}
        nextStep={() => setCurrentStep('congrats')}
      />
    );
  }
  return <Congrats item={item} inventory={inventory} onClose={onClose} />;
};

JerseyContent.fragments = {
  clubShopItem: gql`
    fragment JerseyContent_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
      }
      ... on JerseyShopItem {
        id
        variantStockCounts {
          currentStockCount
          size
        }
      }
      ...SizeSelectionStep_clubShopItem
      ...PostalAdressForm_shopItem
    }
    ${SizeSelectionStep.fragments.clubShopItem}
    ${PostalAdressForm.fragments.shopItem}
  ` as TypedDocumentNode<JerseyContent_clubShopItem>,
};
