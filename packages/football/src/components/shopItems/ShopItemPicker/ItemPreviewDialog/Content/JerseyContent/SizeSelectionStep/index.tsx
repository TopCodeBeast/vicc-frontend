import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { ShirtSize } from '@sorare/core/src/__generated__/globalTypes';
import { ResetIn } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/ResetIn';
import { isType } from '@sorare/core/src/gql';

import { BuyButton } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton';
import { SizeSelector } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Content/JerseyContent/SizeSelector';
import Details from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Details';
import ItemImagePreview from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ItemImagePreview';
import { Requirements } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Requirements';

import { SizeSelectionStep_clubShopItem } from './__generated__/index.graphql';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  item: SizeSelectionStep_clubShopItem;
  selectedSize: ShirtSize | null;
  setSelectedSize: React.Dispatch<React.SetStateAction<ShirtSize | null>>;
  userCoinBalance: number;
  nextStep: () => void;
};

export const SizeSelectionStep = ({
  item,
  selectedSize,
  setSelectedSize,
  userCoinBalance,
  nextStep,
}: Props) => {
  if (!isType(item, 'JerseyShopItem')) {
    return null;
  }
  const { variantStockCounts } = item;

  const hasVariants = variantStockCounts.length > 0;
  const availableSizes = variantStockCounts
    .filter(v => v.currentStockCount > 0)
    .map(v => v.size);

  const hasCooldown = item.myLimitResetAt !== null;
  const soldOut = hasVariants
    ? !availableSizes.length
    : item.currentStockCount === 0;

  const shirtSizes = [
    ShirtSize.XS,
    ShirtSize.S,
    ShirtSize.M,
    ShirtSize.L,
    ShirtSize.XL,
    ShirtSize.XXL,
  ].map(size => {
    const variantStockCount = variantStockCounts.find(v => v.size === size);

    return {
      size,
      soldOut:
        (hasVariants && !variantStockCount?.currentStockCount) || soldOut,
    };
  });

  return (
    <>
      <ItemImagePreview
        pictureUrl={item.pictureUrl}
        name={item.name}
        type={item.position}
      />
      <Details item={item} />
      <Wrapper>
        <SizeSelector
          selectedSize={selectedSize}
          shirtSizes={shirtSizes}
          onChange={size => setSelectedSize(size)}
        />
        {item.disabled && <Requirements item={item} />}
        {hasCooldown && <ResetIn myLimitResetAt={item.myLimitResetAt!} />}
      </Wrapper>
      <BuyButton
        item={item}
        cannotSelectYet={!selectedSize}
        soldOut={soldOut}
        userCoinBalance={userCoinBalance}
        onClick={nextStep}
      />
    </>
  );
};

SizeSelectionStep.fragments = {
  clubShopItem: gql`
    fragment SizeSelectionStep_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        disabled
        myLimitResetAt
        pictureUrl
      }
      ... on JerseyShopItem {
        id
        currentStockCount
        variantStockCounts {
          currentStockCount
          size
        }
      }
      ...BuyButton_clubShopItem
      ...Requirements_clubShopItem
      ...Details_shopItem
    }
    ${BuyButton.fragments.clubShopItem}
    ${Requirements.fragments.clubShopItem}
    ${Details.fragments.shopItem}
  ` as TypedDocumentNode<SizeSelectionStep_clubShopItem>,
};
