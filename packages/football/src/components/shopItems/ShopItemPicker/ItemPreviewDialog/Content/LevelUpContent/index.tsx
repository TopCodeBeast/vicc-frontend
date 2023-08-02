import { TypedDocumentNode, gql } from '@apollo/client';
import qs from 'qs';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { InventoryCounterInline } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/InventoryCounterInline';
import { ResetIn } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/ResetIn';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import { FOOTBALL_USER_GALLERY_CARDS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isType } from '@sorare/core/src/gql';

import { BuyButton } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton';
import { useOnBuyButtonClick } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton/useOnBuyButtonClick';
import ConsumableCta from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ConsumableCta';
import Details from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Details';
import ItemImagePreview from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ItemImagePreview';
import { Requirements } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Requirements';

import { LevelUpContent_clubShopItem } from './__generated__/index.graphql';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
`;
const CenteredButton = styled(Button)`
  align-self: center;
`;

type Props = {
  item: LevelUpContent_clubShopItem;
  inventory: boolean;
  onBuy?: () => void;
  userCoinBalance: number;
  onClose: () => void;
};

export const LevelUpContent = ({
  item,
  inventory,
  onBuy,
  userCoinBalance,
  onClose,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2'>(
    inventory ? 'step2' : 'step1'
  );
  const { onBuyButtonClick, loading } = useOnBuyButtonClick(
    () => setCurrentStep('step2'),
    onBuy
  );

  if (!isType(item, 'LevelUpShopItem')) {
    return null;
  }

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
          <FlexContainer>
            {item.disabled && <Requirements item={item} />}
            {item.myLimitResetAt && (
              <ResetIn myLimitResetAt={item.myLimitResetAt} />
            )}
            {!item.disabled && (
              <InventoryCounterInline
                name={item.name}
                amount={item.myAvailableTotalPurchasesCount}
              />
            )}
          </FlexContainer>
          <BuyButton
            item={item}
            onClick={() => onBuyButtonClick(item.id)}
            loading={loading}
            userCoinBalance={userCoinBalance}
          />
        </>
      ) : (
        <ConsumableCta item={item} onClose={onClose} inventory={inventory}>
          <CenteredButton
            component={Link}
            to={`${generatePath(FOOTBALL_USER_GALLERY_CARDS, {
              slug: currentUser?.slug,
            })}?${qs.stringify({
              [SEARCH_PARAMS.RARITY]: item.rarity,
              [SEARCH_PARAMS.GRADE]: `${item.startLevel}:${item.endLevel}`,
            })}`}
            color="blue"
            medium
          >
            <FormattedMessage
              id="ClubShop.ItemPreviewDialog.Cta.CardBoost"
              defaultMessage="Go to my cards"
            />
          </CenteredButton>
        </ConsumableCta>
      )}
    </>
  );
};

LevelUpContent.fragments = {
  clubShopItem: gql`
    fragment LevelUpContent_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        pictureUrl
        name
        position
        myLimitResetAt
        myAvailableTotalPurchasesCount
      }
      ... on XPBoosterShopItemInterface {
        rarity
        startLevel
        endLevel
      }
      ...Details_shopItem
      ...ConsumableCta_shopItem
      ...Requirements_clubShopItem
    }
    ${Details.fragments.shopItem}
    ${Requirements.fragments.clubShopItem}
    ${ConsumableCta.fragments.shopItem}
  ` as TypedDocumentNode<LevelUpContent_clubShopItem>,
};
