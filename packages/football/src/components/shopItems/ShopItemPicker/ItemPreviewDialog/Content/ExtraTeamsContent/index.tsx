import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { goToLobby } from '@sorare/core/src/constants/routes';

import { BuyButton } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton';
import { useOnBuyButtonClick } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton/useOnBuyButtonClick';
import ConsumableCta from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ConsumableCta';
import Details from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Details';
import ItemImagePreview from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ItemImagePreview';
import { Requirements } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Requirements';

import { ExtraTeamsContent_clubShopItem } from './__generated__/index.graphql';

const CenteredButton = styled(Button)`
  align-self: center;
`;

type Props = {
  item: ExtraTeamsContent_clubShopItem;
  inventory: boolean;
  onBuy?: () => void;
  userCoinBalance: number;
  onClose: () => void;
};

export const ExtraTeamsContent = ({
  item,
  inventory,
  onBuy,
  userCoinBalance,
  onClose,
}: Props) => {
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2'>(
    inventory || item.myPurchasesCount > 0 ? 'step2' : 'step1'
  );
  const { onBuyButtonClick, loading } = useOnBuyButtonClick(
    () => setCurrentStep('step2'),
    onBuy
  );

  return (
    <>
      <ItemImagePreview
        pictureUrl={item.pictureUrl}
        name={item.name}
        type={item.position}
      />
      <Details item={item} />
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
        <ConsumableCta item={item} inventory={inventory} onClose={onClose}>
          <CenteredButton
            component={Link}
            to={goToLobby('upcoming')}
            color="blue"
            medium
          >
            <FormattedMessage
              id="ClubShop.ItemPreviewDialog.Cta.TrainingTeams"
              defaultMessage="Go to training teams"
            />
          </CenteredButton>
        </ConsumableCta>
      )}
    </>
  );
};

ExtraTeamsContent.fragments = {
  clubShopItem: gql`
    fragment ExtraTeamsContent_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        myPurchasesCount
        pictureUrl
        name
        position
        disabled
      }
      ...Details_shopItem
      ...Requirements_clubShopItem
      ...BuyButton_clubShopItem
      ...ConsumableCta_shopItem
    }
    ${Details.fragments.shopItem}
    ${Requirements.fragments.clubShopItem}
    ${BuyButton.fragments.clubShopItem}
    ${ConsumableCta.fragments.shopItem}
  ` as TypedDocumentNode<ExtraTeamsContent_clubShopItem>,
};
