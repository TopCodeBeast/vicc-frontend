import { gql, useLazyQuery } from '@apollo/client';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { Sport } from '__generated__/globalTypes';

import FollowContextProvider from '.';
import {
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
const cardTypes = Object.values(favoriteCardType);

export const favoritePlayerType: Record<Sport, string> = {
  [Sport.FOOTBALL]: 'Player',
  [Sport.BASEBALL]: 'BaseballPlayer',
  [Sport.NBA]: 'NBAPlayer',
};
const playerTypes = Object.values(favoritePlayerType);

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
`;

export const FOLLOW_QUERY = gql`
  query FollowQuery($cursor: String) {
    currentUser {
      slug
      ...FollowProvider_currentUser
    }
  }
  ${currentUser}
`;

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

  const [loadMore, { data, loading }] = useLazyQuery<
    FollowQuery,
    FollowQueryVariables
  >(FOLLOW_QUERY);

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

  const addToMySubscriptions = useCallback(
    (subscription: FollowQuery_currentUser_mySubscriptions_nodes) => {
      setMySubscriptions([...mySubscriptions, subscription]);
    },
    [mySubscriptions]
  );

  const updateMySubscriptions = (
    subscription: FollowQuery_currentUser_mySubscriptions_nodes
  ) => {
    setMySubscriptions(
      mySubscriptions.map(s =>
        s.slug === subscription.slug ? subscription : s
      )
    );
  };

  const favoriteCards = useMemo(() => {
    if (!mySubscriptionsLoaded) return [];
    return mySubscriptions?.filter(item => {
      return cardTypes.includes(item.subscribableType);
    });
  }, [mySubscriptions, mySubscriptionsLoaded]);

  const favoritePlayers = useMemo(() => {
    if (!mySubscriptionsLoaded) return [];
    return mySubscriptions?.filter(item => {
      return playerTypes.includes(item.subscribableType);
    });
  }, [mySubscriptions, mySubscriptionsLoaded]);

  return (
    <FollowContextProvider
      value={{
        mySubscriptions,
        mySubscriptionsLoaded,
        addToMySubscriptions,
        removeFromMySubscriptions,
        updateMySubscriptions,
        favoriteCards,
        favoritePlayers,
        getCurrentUserSubscription,
      }}
    >
      {children}
    </FollowContextProvider>
  );
};

export default FollowProvider;
