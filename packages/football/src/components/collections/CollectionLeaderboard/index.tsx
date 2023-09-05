import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';

import LeaderboardRow from './LeaderboardRow';
import {
  CollectionLeaderboardQuery,
  CollectionLeaderboardQueryVariables,
} from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--triple-unit) 0;
`;
const LeaderboardsWrapper = styled.div`
  background-color: var(--c-neutral-200);
  border-radius: var(--double-unit);
`;

const COLLECTION_LEADERBOARD_QUERY = gql`
  query CollectionLeaderboardQuery(
    $slug: String!
    $userSlug: String!
    $includeUserCardCollection: Boolean!
    $cursor: String
  ) {
    #football {
      cardCollection(slug: $slug) {
        slug
        slotsCount
        bestByScore(after: $cursor, first: 10) {
          nodes {
            id
            ...LeaderboardRow_userCardCollection
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
        userCardCollection(forUserSlug: $userSlug)
          @include(if: $includeUserCardCollection) {
          id
          ...LeaderboardRow_userCardCollection
        }
      }
    #}
  }
  ${LeaderboardRow.fragments.userCardCollection}
` as TypedDocumentNode<
  CollectionLeaderboardQuery,
  CollectionLeaderboardQueryVariables
>;

type Props = {
  slug: string;
  userSlug?: string;
};
const CollectionLeaderboard = ({ slug, userSlug }: Props) => {
  const { data, loading, loadMore } = usePaginatedQuery(
    COLLECTION_LEADERBOARD_QUERY,
    {
      variables: {
        slug,
        // FIXME undefined case is improperly handled
        userSlug: userSlug ?? '',
        includeUserCardCollection: !!userSlug,
      },
      connection: 'UserCardCollectionConnection',
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
    }
  );
  const pageInfo = data?.football.cardCollection.bestByScore.pageInfo;
  const { InfiniteScrollLoader } = useInfiniteScroll(
    () => {
      loadMore(false, {
        slug,
        userSlug,
        cursor: pageInfo?.endCursor,
      });
    },
    !!pageInfo?.hasNextPage,
    loading
  );

  if (loading || !data) {
    return (
      <Root>
        <LoadingIndicator small />
      </Root>
    );
  }

  const myUserCardCollection = data.football.cardCollection.userCardCollection;
  const allUsersCardCollections =
    data.football.cardCollection.bestByScore.nodes;
  const slotsCount = data.football.cardCollection.slotsCount || 0;

  const addMyRankToLeaderboard =
    myUserCardCollection &&
    allUsersCardCollections.every(
      ({ user }) => user.slug !== myUserCardCollection.user.slug
    );

  return (
    <Root>
      <LeaderboardsWrapper>
        {allUsersCardCollections.map(userCardCollection => (
          <LeaderboardRow
            key={userCardCollection.id}
            userCardCollection={userCardCollection}
            slotsCount={slotsCount}
            collectionSlug={slug}
            highlighted={
              userCardCollection.user.slug === myUserCardCollection?.user.slug
            }
          />
        ))}
        <InfiniteScrollLoader />
        {addMyRankToLeaderboard && (
          <LeaderboardRow
            key={myUserCardCollection.id}
            userCardCollection={myUserCardCollection}
            slotsCount={slotsCount}
            highlighted
            collectionSlug={slug}
          />
        )}
      </LeaderboardsWrapper>
    </Root>
  );
};

export default CollectionLeaderboard;
