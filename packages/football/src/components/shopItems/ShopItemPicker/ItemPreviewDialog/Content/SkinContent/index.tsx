import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import useUpdateUserProfile from '@sorare/core/src/hooks/useUpdateUserProfile';

import { BuyButton } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton';
import { useOnBuyButtonClick } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton/useOnBuyButtonClick';
import Details from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Details';
import ItemImagePreview from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ItemImagePreview';
import { Requirements } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Requirements';

import { SkinContent_clubShopItem } from './__generated__/index.graphql';

const CenteredLoadingButton = styled(LoadingButton)`
  align-self: center;
`;

type Props = {
  item: SkinContent_clubShopItem;
  itemEquipped?: boolean;
  inventory: boolean;
  onBuy?: () => void;
  userCoinBalance: number;
};

export const SkinContent = ({
  item,
  itemEquipped,
  inventory,
  onBuy,
  userCoinBalance,
}: Props) => {
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2'>(
    inventory || item.myPurchasesCount > 0 ? 'step2' : 'step1'
  );
  const { onBuyButtonClick, loading } = useOnBuyButtonClick(
    () => setCurrentStep('step2'),
    onBuy
  );
  const [loadingEquip, setLoadingEquip] = useState(false);
  const equipShopItem = useUpdateUserProfile();

  const equipSkin = async () => {
    setLoadingEquip(true);
    const userProfile: { clubShieldId?: string; clubBannerId?: string } = {};
    if (item.position === ShopItemType.SHIELD) {
      userProfile.clubShieldId = item.id;
    } else if (item.position === ShopItemType.BANNER) {
      userProfile.clubBannerId = item.id;
    }
    await equipShopItem(userProfile);
    setLoadingEquip(false);
  };
  return (
    <>
      <ItemImagePreview
        pictureUrl={item.pictureUrl}
        name={item.name}
        type={item.position}
      />
      <Details item={item} itemEquipped={itemEquipped} />
      {currentStep === 'step1' ? (
        <>
          {item.disabled && <Requirements item={item} />}
          <BuyButton
            item={item}
            onClick={() => onBuyButtonClick(item.id)}
            loading={loading}
            userCoinBalance={userCoinBalance}
          />
        </>
      ) : (
        <CenteredLoadingButton
          loading={loadingEquip}
          color="blue"
          medium
          onClick={() => {
            equipSkin();
          }}
        >
          <FormattedMessage
            id="ClubShop.ItemPreviewDialog.Cta.Equip"
            defaultMessage="Equip"
          />
        </CenteredLoadingButton>
      )}
    </>
  );
};

SkinContent.fragments = {
  clubShopItem: gql`
    fragment SkinContent_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        pictureUrl
        name
        position
        myPurchasesCount
        myLimitResetAt
        disabled
      }
      ...Details_shopItem
      ...Requirements_clubShopItem
      ...BuyButton_clubShopItem
    }
    ${Details.fragments.shopItem}
    ${Requirements.fragments.clubShopItem}
    ${BuyButton.fragments.clubShopItem}
  ` as TypedDocumentNode<SkinContent_clubShopItem>,
};
