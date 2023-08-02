import { gql } from '@apollo/client';
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
import Item from './Item';
import SortBy, { SortValues } from './SortBy';
import { ShopItemPickerQuery } from './__generated__/index.graphql';

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
        ...Item_shopItem
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  currentUser {
    slug
    ...Item_user
  }
  ${Item.fragments.shopItem}
  ${Item.fragments.user}
`;

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
  const { data, loading, loadMore } = usePaginatedQuery<ShopItemPickerQuery>(
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
        cursor: data?.shopItems?.pageInfo.endCursor,
        types,
      });
    }, [data?.shopItems?.pageInfo.endCursor, loadMore, types]),
    Boolean(data?.shopItems?.pageInfo?.hasNextPage),
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
    item: ShopItemPickerQuery['shopItems']['nodes'][number]
  ) => {
    if (isType(item, 'JerseyShopItem') && inventory) {
      return item.myLimitResetAt !== null;
    }
    return true;
  };
  const items = data?.shopItems.nodes.filter(
    excludeNoCooldownJerseyFromInventory
  );

  return (
    <Root>
      <FlexContainer>
        <Text14 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="ClubShop.Items.Number"
            defaultMessage="{number} items"
            values={{ number: items?.length || 0 }}
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
              return (
                <Item
                  onSelect={() => onSelect?.(item)}
                  inventory={inventory}
                  key={item.id}
                  item={item}
                  user={data.currentUser}
                  inDialog={inDialog}
                />
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
