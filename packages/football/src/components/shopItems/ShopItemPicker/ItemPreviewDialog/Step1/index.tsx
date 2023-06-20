import { gql } from '@apollo/client';
import { faLock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import {
  CommonDraftCampaignStatus,
  ExtraSwapShopItem,
  LevelUpShopItem,
} from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { FOOTBALL_DRAFT } from '@sorare/core/src/constants/routes';
import { isA } from '@sorare/core/src/lib/gql';

import {
  InventoryCounterInline,
  ResetIn,
} from '@sorare/football/src/components/shopItems/ShopItemPicker/Item/Label';

import { Step1_shopItem } from './__generated__/index.graphql';
import useBuyShopItem from './useBuyShopItem';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type BuyButtonProps = {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
};
const BuyButton = ({ onClick, loading, disabled }: BuyButtonProps) => (
  <LoadingButton
    onClick={onClick}
    disabled={disabled}
    loading={loading}
    color="blue"
    medium
  >
    <FlexContainer>
      {disabled && <FontAwesomeIcon icon={faLock} />}
      <FormattedMessage
        id="ClubShop.ItemPreviewDialog.Step1.BuyButton"
        defaultMessage="Buy this item"
      />
    </FlexContainer>
  </LoadingButton>
);

type Props = {
  item: Step1_shopItem;
  userCoinBalance: number;
  nextStep: () => void;
  onBuy?: () => void;
};
const Step1 = ({ item, userCoinBalance, nextStep, onBuy }: Props) => {
  const [loading, setLoading] = useState(false);
  const buyShopItem = useBuyShopItem();
  const cooldown = item.myLimitResetAt !== null;
  const realPrice = item.salePrice ?? item.price;
  const limitReached = item.myPurchasesCount === item.limitPerUser;
  const buyButtonDisabled =
    realPrice > userCoinBalance || limitReached || cooldown;

  const onBuyButtonClick = () => {
    setLoading(true);
    buyShopItem(item.id).then(errors => {
      if (!errors?.length) {
        if (onBuy) {
          onBuy();
        } else {
          nextStep();
        }
      }
      setLoading(false);
    });
  };

  if (isA<LevelUpShopItem>('LevelUpShopItem', item)) {
    return (
      <Root>
        {cooldown && <ResetIn time={parseISO(item.myLimitResetAt!)} />}
        <InventoryCounterInline item={item} />
        <BuyButton
          onClick={onBuyButtonClick}
          loading={loading}
          disabled={buyButtonDisabled}
        />
      </Root>
    );
  }

  if (isA<ExtraSwapShopItem>('ExtraSwapShopItem', item)) {
    const leaderboard = item.so5Leaderboard;
    const status = leaderboard?.commonDraftCampaign?.status;
    const isDraftable = status === CommonDraftCampaignStatus.OPEN;
    const isRedraftable = status === CommonDraftCampaignStatus.REDRAFTABLE;
    const buttonDisabled =
      buyButtonDisabled || !leaderboard?.commonDraftCampaign;

    return (
      <Root>
        {cooldown && <ResetIn time={parseISO(item.myLimitResetAt!)} />}
        <InventoryCounterInline item={item} />
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
            onClick={onBuyButtonClick}
            loading={loading}
            disabled={buttonDisabled}
          />
        )}
      </Root>
    );
  }

  return (
    <Root>
      <BuyButton
        onClick={onBuyButtonClick}
        loading={loading}
        disabled={buyButtonDisabled}
      />
    </Root>
  );
};

Step1.fragments = {
  shopItem: gql`
    fragment Step1_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        price
        salePrice
        myPurchasesCount
        limitPerUser
        myLimitResetAt
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
    }
  `,
};

export default Step1;
