import { gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { Link, generatePath, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Portal } from '@sorare/core/src/atoms/layout/Portal';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { FilterButton } from '@sorare/core/src/components/search/FilterButton';
import { FilterIconButton } from '@sorare/core/src/components/search/FilterIconButton';
import {
  LeftFilters,
  SearchLayoutContainer,
  SearchLayoutMain,
} from '@sorare/core/src/components/search/SearchLayout/ui';
import { FOOTBALL_USER_CARD_COLLECTION_CARDS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';
import useToggle from '@sorare/core/src/hooks/useToggle';
import useBottomBarNavItems from '@sorare/core/src/routing/MultiSportBottomNavBar/useBottomBarNavItems';
import { theme } from '@sorare/core/src/style/theme';

import { CollectionPreview } from '@football/components/collections/CollectionPreview';
import { DesktopCollectionsFilters } from '@football/components/collections/DesktopCollectionsFilters';
import DetailsDialogBanner from '@football/components/collections/DetailsDialogBanner';
import { MobileCollectionsFilters } from '@football/components/collections/MobileCollectionsFilters';
import { NoResults } from '@football/components/collections/NoResults';
import { SearchFilter } from '@football/components/collections/SearchFilter';
import {
  CollectionsFiltersState,
  StringifiedCollectionsFiltersState,
} from '@football/components/collections/types';
import {
  parseFiltersState,
  stringifyFiltersState,
} from '@football/components/collections/utils';

import {
  UserCollectionsQuery,
  UserCollectionsQueryVariables,
} from './__generated__/index.graphql';

const Root = styled.div`
  color: var(--c-neutral-1000);
`;
const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
`;
const CollectionsListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--double-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;
const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
  margin-bottom: var(--triple-unit);
`;

const BottomFixedWrapper = styled.div`
  position: fixed;
  bottom: var(--triple-unit);
  left: var(--double-unit);
  right: var(--double-unit);
  display: flex;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  transition: transform 0.2s ease-in-out;
  &:hover,
  &:focus {
    color: inherit;
    transform: scale(1.02);
  }
`;

const COLLECTIONS_QUERY = gql`
  query UserCollectionsQuery(
    $user: String!
    $after: String
    $rarities: [Rarity!]
    $seasonStartYears: [Int!]
    $query: String
    $startedOnly: Boolean
  ) {
    user(slug: $user) {
      slug
      cardCounts {
        total
        common
      }
      footballCardCollections(
        startedOnly: $startedOnly
        after: $after
        first: 10
        rarities: $rarities
        seasonStartYears: $seasonStartYears
        query: $query
      ) {
        nodes {
          slug
          userCardCollection(forUserSlug: $user) {
            id
          }
          ...CollectionPreview_cardCollection
        }
        ...DesktopCollectionsFilters_cardCollectionConnection
        ...MobileCollectionsFilters_cardCollectionConnection
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${CollectionPreview.fragments.cardCollection}
  ${DesktopCollectionsFilters.fragments.cardCollectionConnection}
  ${MobileCollectionsFilters.fragments.cardCollectionConnection}
`;

type Props = {
  readOnly?: boolean;
};

export const Collections = ({ readOnly }: Props) => {
  const params = useParams();
  const { currentUser } = useCurrentUserContext();
  const userSlug = params.slug || currentUser?.slug;
  const { up: isLaptop } = useScreenSize('laptop');
  const [showFilters, toggleShowFilters] = useToggle(false);
  const [showDesktopFilters, toggleShowDesktopFilters] = useToggle(true);
  const [urlFiltersState, setUrlFiltersState] =
    useQueryState<StringifiedCollectionsFiltersState>({
      rarities: undefined,
      seasonStartYears: undefined,
      query: undefined,
      startedOnly: 'true',
    });

  const [filtersState, setFiltersState] = useState<CollectionsFiltersState>(
    parseFiltersState(urlFiltersState)
  );

  const handleFiltersChange = (newFiltersState: CollectionsFiltersState) => {
    setFiltersState(newFiltersState);
    setUrlFiltersState(stringifyFiltersState(newFiltersState));
  };

  const { loading, data, previousData, loadMore } = usePaginatedQuery<
    UserCollectionsQuery,
    UserCollectionsQueryVariables
  >(COLLECTIONS_QUERY, {
    variables: { user: userSlug || '', ...filtersState },
    connection: 'CardCollectionConnection',
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
  });

  const collectionConnection = data?.user?.footballCardCollections;
  const previousCollectionConnection =
    previousData?.user?.footballCardCollections;
  const pageInfo = collectionConnection?.pageInfo;
  const hasMore = pageInfo?.hasNextPage || false;
  const after = pageInfo?.endCursor;
  const bottomNavBarItems = useBottomBarNavItems();

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, { user: userSlug || '', after });
    }, [loadMore, after, userSlug]),
    hasMore,
    loading
  );

  const collectionsNodes = collectionConnection?.nodes || [];
  const connectionToDisplay =
    collectionConnection || previousCollectionConnection;

  const noResults = collectionsNodes.length === 0;
  const cardCounts = data?.user.cardCounts || { total: 0, common: 0 };
  const userHasCards = cardCounts?.total - cardCounts?.common;

  if (!loading && !userHasCards && !readOnly && filtersState.startedOnly) {
    handleFiltersChange({ ...filtersState, startedOnly: false });
  }

  const bottomFilterButton = bottomNavBarItems ? (
    <Portal id="above-bottom-bar-portal">
      <FilterButton onClick={toggleShowFilters} />
    </Portal>
  ) : (
    <BottomFixedWrapper>
      <FilterButton onClick={toggleShowFilters} />
    </BottomFixedWrapper>
  );
  return (
    <Root>
      <SearchRow>
        {isLaptop ? (
          <FilterIconButton onClick={toggleShowDesktopFilters} />
        ) : (
          bottomFilterButton
        )}
        <SearchFilter
          filtersState={filtersState}
          onSearchChange={handleFiltersChange}
        />
      </SearchRow>

      {!connectionToDisplay ? (
        <LoadingIndicator />
      ) : (
        <SearchLayoutContainer>
          {isLaptop ? (
            <LeftFilters visible={showDesktopFilters}>
              <DesktopCollectionsFilters
                collectionConnection={connectionToDisplay}
                onFiltersChange={handleFiltersChange}
                filtersState={filtersState}
              />
            </LeftFilters>
          ) : (
            <MobileCollectionsFilters
              open={showFilters}
              onClose={toggleShowFilters}
              collectionConnection={connectionToDisplay}
              onFiltersChange={handleFiltersChange}
              filtersState={filtersState}
            />
          )}
          <SearchLayoutMain>
            <MainContentWrapper>
              <DetailsDialogBanner />
              {noResults && loading ? (
                <LoadingIndicator grow />
              ) : (
                <>
                  {noResults && <NoResults query={filtersState.query} />}

                  <CollectionsListWrapper>
                    {collectionsNodes.map(collection => {
                      return (
                        <StyledLink
                          key={collection.slug}
                          to={generatePath(
                            FOOTBALL_USER_CARD_COLLECTION_CARDS,
                            {
                              slug: userSlug,
                              collectionSlug: collection.slug,
                            }
                          )}
                        >
                          <CollectionPreview collection={collection} />
                        </StyledLink>
                      );
                    })}
                    <InfiniteScrollLoader />
                  </CollectionsListWrapper>
                </>
              )}
            </MainContentWrapper>
          </SearchLayoutMain>
        </SearchLayoutContainer>
      )}
    </Root>
  );
};

export default Collections;
