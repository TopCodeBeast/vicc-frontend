import { TypedDocumentNode, gql, useLazyQuery } from '@apollo/client';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { Sport } from '__generated__/globalTypes';

import FollowContextProvider from '.';
import {
  FollowProvider_currentUser,
  FollowQuery,
  FollowQueryVariables,
} from './__generated__/Provider.graphql';

type FollowQuery_currentUser_mySubscriptions_nodes = NonNullable<
  FollowQuery['currentUser']
>['mySubscriptions']['nodes'][number];

interface Props {
  children: ReactNode;
}

export const favoriteCardType: Record<Sport, string> = {
  [Sport.FOOTBALL]: 'Card',
  [Sport.BASEBALL]: 'BaseballCard',
  [Sport.NBA]: 'NBACard',
};

export const favoritePlayerType: Record<Sport, string> = {
  [Sport.FOOTBALL]: 'Player',
  [Sport.BASEBALL]: 'BaseballPlayer',
  [Sport.NBA]: 'NBAPlayer',
};

const sportOfCardType = {
  Card: Sport.FOOTBALL,
  BaseballCard: Sport.BASEBALL,
  NBACard: Sport.NBA,
};

const sportOfPlayerType = {
  Player: Sport.FOOTBALL,
  BaseballPlayer: Sport.BASEBALL,
  NBAPlayer: Sport.NBA,
};

const emptyCatalogBySport = {
  [Sport.FOOTBALL]: [],
  [Sport.NBA]: [],
  [Sport.BASEBALL]: [],
} as Record<Sport, FollowQuery_currentUser_mySubscriptions_nodes[]>;

export const currentUser = gql`
  fragment FollowProvider_currentUser on CurrentUser {
    id
    slug
    mySubscriptions(after: $cursor) {
      nodes {
        slug
        subscribableType
        subscribableSlug
        preferences {
          slug
          notifyForRarities
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as TypedDocumentNode<FollowProvider_currentUser>;

export const FOLLOW_QUERY = gql`
  query FollowQuery($cursor: String) {
    currentUser {
      slug
      ...FollowProvider_currentUser
    }
  }
  ${currentUser}
` as TypedDocumentNode<FollowQuery, FollowQueryVariables>;

// This provider was introduced, to get all subscriptions for a user. It is used for :
// - Favorites Filter on the marketplace
// - Display the state of the "heart" follow button on card item
// - Display the state of follow button on item page

export const FollowProvider = ({ children }: Props) => {
  const [mySubscriptions, setMySubscriptions] = useState<
    FollowQuery_currentUser_mySubscriptions_nodes[]
  >([]);
  const [mySubscriptionsLoaded, setMySubscriptionsLoaded] =
    useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [cursor, setCursor] = useState<string | null | undefined>(undefined);

  const [loadMore, { data, loading }] = useLazyQuery(FOLLOW_QUERY);

  // load first page, once
  useEffect(() => {
    loadMore();
  }, [loadMore]);

  // load next pages
  useEffect(() => {
    if (loading || !data) {
      return;
    }

    const hasMore = data.currentUser?.mySubscriptions.pageInfo.hasNextPage;
    if (hasMore) {
      const endCursor = data.currentUser?.mySubscriptions.pageInfo.endCursor;
      if (endCursor !== cursor && loadMore) {
        setPage(page + 1);
        setCursor(endCursor);
        loadMore({
          variables: {
            cursor: endCursor,
          },
        });
      }
    } else {
      setMySubscriptionsLoaded(true);
    }
  }, [data, loading, page, cursor, setPage, setCursor, loadMore]);

  // append to `mySubscriptions`
  useEffect(() => {
    if (data?.currentUser?.mySubscriptions.nodes) {
      setMySubscriptions(m => [
        ...m,
        ...(data?.currentUser?.mySubscriptions.nodes || []),
      ]);
    }
  }, [data]);

  const getCurrentUserSubscription = useCallback(
    ({ __typename, slug }: { __typename: string; slug: string }) => {
      return (
        mySubscriptions?.find(sub => {
          return (
            sub.subscribableSlug === slug && __typename === sub.subscribableType
          );
        }) || null
      );
    },
    [mySubscriptions]
  );

  const removeFromMySubscriptions = useCallback(
    (slug: string) => {
      setMySubscriptions(
        mySubscriptions.filter(mySubscription => {
          return mySubscription.slug !== slug;
        })
      );
    },
    [mySubscriptions]
  );

  const addToMySubscriptions = (
    subscription: FollowQuery_currentUser_mySubscriptions_nodes
  ) => {
    setMySubscriptions(previousSubscriptions => [
      ...previousSubscriptions,
      subscription,
    ]);
  };

  const updateMySubscriptions = (
    subscription: FollowQuery_currentUser_mySubscriptions_nodes
  ) => {
    setMySubscriptions(
      mySubscriptions.map(s =>
        s.slug === subscription.slug ? subscription : s
      )
    );
  };

  const { favoritePlayersBySport, favoriteCardsBySport } = useMemo(() => {
    if (!mySubscriptionsLoaded)
      return {
        favoritePlayersBySport: emptyCatalogBySport,
        favoriteCardsBySport: emptyCatalogBySport,
      };
    return (mySubscriptions || []).reduce(
      (map, item) => {
        const sportOfPlayer: Sport | undefined = (sportOfPlayerType as any)[
          item.subscribableType
        ];

        if (sportOfPlayer) {
          return {
            ...map,
            favoritePlayersBySport: {
              ...map.favoritePlayersBySport,
              [sportOfPlayer]: [
                ...map.favoritePlayersBySport[sportOfPlayer],
                item,
              ],
            },
          };
        }

        const sportOfCard: Sport | undefined = (sportOfCardType as any)[
          item.subscribableType
        ];
        if (sportOfCard) {
          return {
            ...map,
            favoriteCardsBySport: {
              ...map.favoriteCardsBySport,
              [sportOfCard]: [...map.favoriteCardsBySport[sportOfCard], item],
            },
          };
        }
        return map;
      },
      {
        favoritePlayersBySport: emptyCatalogBySport,
        favoriteCardsBySport: emptyCatalogBySport,
      }
    );
  }, [mySubscriptions, mySubscriptionsLoaded]);

  const favoritePlayers = useMemo(() => {
    return Object.values(favoritePlayersBySport).flat();
  }, [favoritePlayersBySport]);

  const favoriteCards = useMemo(() => {
    return Object.values(favoriteCardsBySport).flat();
  }, [favoriteCardsBySport]);

  return (
    <FollowContextProvider
      value={{
        mySubscriptions,
        mySubscriptionsLoaded,
        addToMySubscriptions,
        removeFromMySubscriptions,
        updateMySubscriptions,
        favoriteCards,
        favoriteCardsBySport,
        favoritePlayers,
        favoritePlayersBySport,
        getCurrentUserSubscription,
      }}
    >
      {children}
    </FollowContextProvider>
  );
};

export default FollowProvider;
