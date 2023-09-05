import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  ShopItemType,
  ShopItemsSorting,
  SortingOption,
} from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text14 } from '@sorare/core/src/atoms/typography';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { sameArrays } from '@sorare/core/src/lib/arrays';
import { isType } from '@sorare/core/src/lib/gql';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { ShopItemLogo } from '@football/components/userGroup/form/AvatarInput/types';

import FilterBy from './FilterBy';
import { DefaultListing } from './Listings/DefaultListing';
import { DeliverableWithNoVariantShopItemListing } from './Listings/DeliverableWithNoVariantShopItemListing';
import { ExtraSwapShopItemListing } from './Listings/ExtraSwapShopItemListing';
import { JerseyShopItemListing } from './Listings/JerseyShopItemListing';
import { LevelUpShopItemListing } from './Listings/LevelUpShopItemListing';
import SortBy, { SortValues } from './SortBy';
import {
  ShopItemPickerQuery,
  ShopItemPickerQueryVariables,
} from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  margin-bottom: var(--triple-unit);
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SortAndFilterContainer = styled.div`
  display: flex;
  gap: var(--unit);
`;
const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--double-unit);
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  @media ${laptopAndAbove} {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  &.inDialog {
    grid-template-columns: repeat(2, 1fr);
  }
`;

type SortAndFilter = {
  sort: SortValues;
  filter: ShopItemType[];
};

const getSortingValues = (sort: SortValues) => {
  switch (sort) {
    case SortValues.NEWEST:
      return {
        type: ShopItemsSorting.DATE,
        direction: SortingOption.DESC,
      };
    case SortValues.PRICE_HIGH_LOW:
      return {
        type: ShopItemsSorting.PRICE,
        direction: SortingOption.DESC,
      };
    case SortValues.PRICE_LOW_HIGH:
      return {
        type: ShopItemsSorting.PRICE,
        direction: SortingOption.ASC,
      };
    default:
      return {
        type: ShopItemsSorting.DATE,
        direction: SortingOption.DESC,
      };
  }
};

export const SHOP_ITEM_PICKER_QUERY = gql`
  query ShopItemPickerQuery(
    $cursor: String
    $sort: ShopItemsSortInput!
    $types: [ShopItemType!]
    $unlocked: Boolean
  ) {
    #football {
      shopItems(
        first: 12
        after: $cursor
        types: $types
        unlockedOnly: $unlocked
        sortType: $sort
      ) {
        nodes {
          ... on ShopItemInterface {
            id
            myAvailableTotalPurchasesCount
            pictureUrl
          }
          ...DefaultListing_shopItem
          ...LevelUpShopItemListing_LevelUpShopItem
          ...ExtraSwapShopItemListing_ExtraSwapShopItem
          ...JerseyShopItemListing_JerseyShopItem
          ...DeliverableWithNoVariantShopItemListing_deliverableWithNoVariantShopItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
    #}
    currentUser {
      slug
      ...DefaultListing_user
    }
  }
  ${DefaultListing.fragments.shopItem}
  ${DefaultListing.fragments.user}
  ${LevelUpShopItemListing.fragments.LevelUpShopItem}
  ${ExtraSwapShopItemListing.fragments.ExtraSwapShopItem}
  ${JerseyShopItemListing.fragments.JerseyShopItem}
  ${DeliverableWithNoVariantShopItemListing.fragments
    .deliverableWithNoVariantShopItem}
` as TypedDocumentNode<ShopItemPickerQuery, ShopItemPickerQueryVariables>;

type Props = {
  onSelect?: (shopItem: ShopItemLogo) => void;
  types: ShopItemType[];
  inventory?: boolean;
  inDialog?: boolean;
  hideSort?: boolean;
};
const ShopItemPicker = ({
  onSelect,
  types,
  inventory,
  inDialog,
  hideSort,
}: Props) => {
  const [prevTypes, setPrevTypes] = useState(types);
  const [sortAndFilter, setSortAndFilter] = useState<SortAndFilter>({
    sort: SortValues.NEWEST,
    filter: types,
  });
  const { data, loading, loadMore } = usePaginatedQuery(
    SHOP_ITEM_PICKER_QUERY,
    {
      variables: {
        sort: getSortingValues(sortAndFilter.sort),
        types: sortAndFilter.filter.length ? sortAndFilter.filter : types,
        unlocked: inventory,
      },
      connection: 'ClubShopItemConnection',
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
    }
  );

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        cursor: data?.football?.shopItems?.pageInfo.endCursor,
        types,
      });
    }, [data?.football?.shopItems?.pageInfo.endCursor, loadMore, types]),
    Boolean(data?.football?.shopItems?.pageInfo?.hasNextPage),
    loading
  );

  if (!sameArrays(prevTypes, types)) {
    setSortAndFilter(v => ({
      ...v,
      filter: types,
    }));
    setPrevTypes(types);
  }

  const excludeNoCooldownJerseyFromInventory = (
    item: ShopItemPickerQuery['football']['shopItems']['nodes'][number]
  ) => {
    if (isType(item, 'JerseyShopItem') && inventory) {
      return item.myLimitResetAt !== null;
    }
    return true;
  };
  const items = data?.football?.shopItems.nodes.filter(
    excludeNoCooldownJerseyFromInventory
  );

  return (
    <Root>
      <FlexContainer>
        <Text14 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="ClubShop.Items.Number"
            defaultMessage="{number} items"
            values={{ number: data?.football?.shopItems.totalCount || 0 }}
          />
        </Text14>
        {!hideSort && (
          <SortAndFilterContainer>
            <SortBy
              onChange={value =>
                setSortAndFilter(prevValue => ({
                  ...prevValue,
                  sort: value,
                }))
              }
            />
            <FilterBy
              types={types}
              values={sortAndFilter.filter}
              onChange={values =>
                setSortAndFilter(prevValue => ({
                  ...prevValue,
                  filter: values,
                }))
              }
            />
          </SortAndFilterContainer>
        )}
      </FlexContainer>
      {!data ? (
        <LoadingIndicator white small />
      ) : (
        <>
          <ItemsGrid className={classnames({ inDialog })}>
            {items?.map(item => {
              if (inventory && item.myAvailableTotalPurchasesCount === 0) {
                return null;
              }
              const listingProps = {
                onSelect: () => onSelect?.(item),
                inventory,
                user: data.currentUser,
                inDialog,
              };

              if (isType(item, 'LevelUpShopItem')) {
                return (
                  <LevelUpShopItemListing
                    key={item.id}
                    item={item}
                    {...listingProps}
                  />
                );
              }

              if (isType(item, 'ExtraSwapShopItem')) {
                return (
                  <ExtraSwapShopItemListing
                    key={item.id}
                    item={item}
                    {...listingProps}
                  />
                );
              }

              if (isType(item, 'JerseyShopItem')) {
                return (
                  <JerseyShopItemListing
                    key={item.id}
                    item={item}
                    {...listingProps}
                  />
                );
              }

              if (isType(item, 'DeliverableWithNoVariantShopItem')) {
                return (
                  <DeliverableWithNoVariantShopItemListing
                    key={item.id}
                    item={item}
                    {...listingProps}
                  />
                );
              }

              return (
                <DefaultListing key={item.id} item={item} {...listingProps} />
              );
            })}
          </ItemsGrid>
          <InfiniteScrollLoader />
        </>
      )}
    </Root>
  );
};

export default ShopItemPicker;
