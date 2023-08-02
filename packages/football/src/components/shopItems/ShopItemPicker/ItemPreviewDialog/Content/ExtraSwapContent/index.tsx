import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CommonDraftCampaignStatus } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { InventoryCounterInline } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/InventoryCounterInline';
import { ResetIn } from '@sorare/core/src/components/clubShop/ClubShopItem/Labels/ResetIn';
import {
  FOOTBALL_DRAFT,
  FOOTBALL_LOBBY_UPCOMING_SWAP,
} from '@sorare/core/src/constants/routes';
import { isType } from '@sorare/core/src/gql';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

import { BuyButton } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton';
import { useOnBuyButtonClick } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/BuyButton/useOnBuyButtonClick';
import ConsumableCta from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ConsumableCta';
import Details from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Details';
import ItemImagePreview from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/ItemImagePreview';
import { Requirements } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog/Requirements';

import { ExtraSwapContent_clubShopItem } from './__generated__/index.graphql';

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
  item: ExtraSwapContent_clubShopItem;
  inventory: boolean;
  onBuy?: () => void;
  userCoinBalance: number;
  onClose: () => void;
};

export const ExtraSwapContent = ({
  item,
  inventory,
  onBuy,
  userCoinBalance,
  onClose,
}: Props) => {
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2'>(
    inventory ? 'step2' : 'step1'
  );
  const { onBuyButtonClick, loading } = useOnBuyButtonClick(
    () => setCurrentStep('step2'),
    onBuy
  );
  const navigate = useNavigate();
  const location = useBgLocation(true);

  if (!isType(item, 'ExtraSwapShopItem')) {
    return null;
  }

  const leaderboard = item.so5Leaderboard;
  const status = leaderboard?.commonDraftCampaign?.status;
  const isDraftable = status === CommonDraftCampaignStatus.OPEN;
  const isRedraftable = status === CommonDraftCampaignStatus.REDRAFTABLE;
  const isSwappable = !!leaderboard?.commonDraftCampaign;

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
                amount={item.myAvailableTotalPurchasesCount}
                name={item.name}
              />
            )}
          </FlexContainer>

          {isDraftable || isRedraftable ? (
            <Button
              component={Link}
              to={generatePath(FOOTBALL_DRAFT, {
                slug: leaderboard?.slug,
              })}
              color="blue"
              medium
            >
              {isDraftable && (
                <FormattedMessage
                  id="ClubShop.ItemPreviewDialog.Step1.Draft"
                  defaultMessage="Draft"
                />
              )}
              {isRedraftable && (
                <FormattedMessage
                  id="ClubShop.ItemPreviewDialog.Step1.Redraft"
                  defaultMessage="Redraft"
                />
              )}
            </Button>
          ) : (
            <BuyButton
              item={item}
              onClick={() => onBuyButtonClick(item.id)}
              loading={loading}
              cannotSelectYet={!leaderboard?.commonDraftCampaign}
              userCoinBalance={userCoinBalance}
            />
          )}
        </>
      ) : (
        <ConsumableCta item={item} inventory={inventory} onClose={onClose}>
          {isSwappable && (
            <CenteredButton
              disabled={item.myAvailableTotalPurchasesCount <= 0}
              onClick={() => {
                onClose();
                /*
                Wait for the dialog to close (300ms animation duration) to remove the 'overflow: hidden' property on the body
                then navigate to the swap dialog route which contains a body lock (useBodyLock.ts)
                */
                setTimeout(
                  () =>
                    navigate(
                      generatePath(FOOTBALL_LOBBY_UPCOMING_SWAP, {
                        leaderboardSlug: item.so5Leaderboard?.slug,
                      }),
                      { state: { backgroundState: location } }
                    ),
                  300
                );
              }}
              color="blue"
              medium
            >
              <FormattedMessage
                id="ClubShop.ItemPreviewDialog.Cta.ExtraSwap"
                defaultMessage="Use your extra swap"
              />
            </CenteredButton>
          )}
        </ConsumableCta>
      )}
    </>
  );
};

ExtraSwapContent.fragments = {
  clubShopItem: gql`
    fragment ExtraSwapContent_clubShopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        disabled
        myLimitResetAt
        pictureUrl
        name
        position
        myAvailableTotalPurchasesCount
      }
      ... on ExtraSwapShopItem {
        id
        so5Leaderboard {
          slug
          commonDraftCampaign {
            slug
            status
          }
        }
      }
      ...Details_shopItem
      ...Requirements_clubShopItem
      ...ConsumableCta_shopItem
    }
    ${Requirements.fragments.clubShopItem}
    ${ConsumableCta.fragments.shopItem}
    ${Details.fragments.shopItem}
  ` as TypedDocumentNode<ExtraSwapContent_clubShopItem>,
};
