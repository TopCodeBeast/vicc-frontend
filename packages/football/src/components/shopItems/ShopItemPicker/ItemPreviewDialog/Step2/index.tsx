import { gql } from '@apollo/client';
import qs from 'qs';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  ExtraSwapShopItem,
  LevelUpShopItem,
  ShopItemType,
  XPRestoreShopItem,
} from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import {
  FOOTBALL_LOBBY_UPCOMING_SWAP,
  FOOTBALL_USER_GALLERY_CARDS,
  goToLobby,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import useUpdateUserProfile from '@sorare/core/src/hooks/useUpdateUserProfile';
import { glossary } from '@sorare/core/src/lib/glossary';
import { isA } from '@sorare/core/src/lib/gql';

import ConsumableCta from './ConsumableCta';
import { Step2_shopItem } from './__generated__/index.graphql';

const CenteredButton = styled(Button)`
  align-self: center;
`;
const CenteredLoadingButton = styled(LoadingButton)`
  align-self: center;
`;

type Props = {
  item: Step2_shopItem;
  inventory?: boolean;
  onSelect?: () => void;
  onClose: () => void;
};
const Step2 = ({ item, inventory, onSelect, onClose }: Props) => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();
  const location = useBgLocation(true);
  const equipShopItem = useUpdateUserProfile();
  const [loading, setLoading] = useState(false);

  if (isA<ExtraSwapShopItem>('ExtraSwapShopItem', item)) {
    const isSwappable = !!item.so5Leaderboard?.commonDraftCampaign;

    return (
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
    );
  }

  if (item.position === ShopItemType.EXTRA_TEAMS_CAP) {
    return (
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
    );
  }

  if (
    isA<LevelUpShopItem>('LevelUpShopItem', item) ||
    isA<XPRestoreShopItem>('XPRestoreShopItem', item)
  ) {
    return (
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
    );
  }

  if (item.position === ShopItemType.LOGO) {
    return (
      <CenteredButton color="blue" medium onClick={onSelect}>
        <FormattedMessage {...glossary.select} />
      </CenteredButton>
    );
  }

  const onClick = async () => {
    setLoading(true);
    const userProfile: { clubShieldId?: string; clubBannerId?: string } = {};
    if (item.position === ShopItemType.SHIELD) {
      userProfile.clubShieldId = item.id;
    } else if (item.position === ShopItemType.BANNER) {
      userProfile.clubBannerId = item.id;
    }
    await equipShopItem(userProfile);
    setLoading(false);
  };
  return (
    <CenteredLoadingButton
      loading={loading}
      color="blue"
      medium
      onClick={() => {
        onClick();
      }}
    >
      <FormattedMessage
        id="ClubShop.ItemPreviewDialog.Cta.Equip"
        defaultMessage="Equip"
      />
    </CenteredLoadingButton>
  );
};

Step2.fragments = {
  shopItem: gql`
    fragment Step2_shopItem on ClubShopItem {
      ... on ShopItemInterface {
        id
        position
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
      ... on XPBoosterShopItemInterface {
        rarity
        startLevel
        endLevel
      }
      ...ConsumableCta_shopItem
    }
    ${ConsumableCta.fragments.shopItem}
  `,
};

export default Step2;
