import { Suspense } from 'react';
import { useIntl } from 'react-intl';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import { Container } from '@sorare/core/src/atoms/container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import NavigationTabs from '@sorare/core/src/atoms/navigation/NavigationTabs';
import {
  FOOTBALL_CLUB_SHOP,
  FOOTBALL_CLUB_SHOP_BOOSTS,
  FOOTBALL_CLUB_SHOP_INVENTORY,
  FOOTBALL_CLUB_SHOP_MERCH,
  FOOTBALL_CLUB_SHOP_SKINS,
} from '@sorare/core/src/constants/routes';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { RootRoutes } from '@sorare/core/src/routing/RootRoutes';

import ShopItemPicker from '@football/components/shopItems/ShopItemPicker';

const Root = styled(Container)`
  row-gap: var(--double-unit);
`;

const Tabs = () => {
  const {
    flags: { useShopItemPossibleTypes = [] },
  } = useFeatureFlags();
  const { formatMessage } = useIntl();
  const location = useBgLocation(true);

  const excludedTypes = [ShopItemType.LOGO];
  const possibleTypes = useShopItemPossibleTypes
    .map((type: ShopItemType) => type.toUpperCase())
    .filter((type: ShopItemType) => !excludedTypes.includes(type));

  const skinTypes = [ShopItemType.BANNER, ShopItemType.SHIELD];
  const boosterTypes = possibleTypes.filter(
    (type: ShopItemType) =>
      type === ShopItemType.EXTRA_SWAP ||
      type === ShopItemType.EXTRA_TEAMS_CAP ||
      type === ShopItemType.LEVEL_UP
  );
  const merchTypes = possibleTypes.filter(
    (type: ShopItemType) =>
      type === ShopItemType.JERSEY ||
      type === ShopItemType.DELIVERABLE_WITH_NO_VARIANT
  );

  const tabItems = [
    {
      path: FOOTBALL_CLUB_SHOP,
      label: formatMessage({
        id: 'ClubShop.Tabs.All',
        defaultMessage: 'All',
      }),
      tabContent: <ShopItemPicker types={possibleTypes} />,
    },
    {
      path: FOOTBALL_CLUB_SHOP_SKINS,
      label: formatMessage({
        id: 'ClubShop.Tabs.Skins',
        defaultMessage: 'Skins',
      }),
      tabContent: <ShopItemPicker types={skinTypes} />,
    },
    {
      path: FOOTBALL_CLUB_SHOP_BOOSTS,
      label: formatMessage({
        id: 'ClubShop.Tabs.Boosts',
        defaultMessage: 'Boosts',
      }),
      tabContent: <ShopItemPicker types={boosterTypes} />,
    },
    {
      path: FOOTBALL_CLUB_SHOP_MERCH,
      label: formatMessage({
        id: 'ClubShop.Tabs.Merch',
        defaultMessage: 'Merch',
      }),
      tabContent: <ShopItemPicker types={merchTypes} />,
    },
    {
      path: FOOTBALL_CLUB_SHOP_INVENTORY,
      label: formatMessage({
        id: 'ClubShop.Tabs.Inventory',
        defaultMessage: 'Inventory',
      }),
      tabContent: <ShopItemPicker types={possibleTypes} inventory />,
    },
  ].map(({ path, ...rest }) => ({ to: path, path, ...rest }));

  return (
    <Root>
      <NavigationTabs items={tabItems} />
      <RootRoutes location={location}>
        {tabItems.map(({ path, tabContent }) => {
          return (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<LoadingIndicator fullHeight white />}>
                  {tabContent}
                </Suspense>
              }
            />
          );
        })}
      </RootRoutes>
    </Root>
  );
};

export default Tabs;
