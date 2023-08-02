import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Sport,
  SubscribableType,
} from '@sorare/core/src/__generated__/globalTypes';
import LoadMoreButton from '@sorare/core/src/atoms/buttons/LoadMoreButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { extractConnectionData } from '@sorare/core/src/gql/extractData';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { MyPage } from '../MyPage';
import Subscriptions from '../common/Subscriptions';
import { MySorarePage } from '../common/pages';
import useSortByDate from '../common/useSortByDate';
import useSportSelect from '../common/useSportSelect';
import PlayerNotifications from './PlayerNotifications';
import {
  FollowsForNotificationsQuery,
  FollowsForNotificationsQueryVariables,
} from './__generated__/index.graphql';

const FOLLOWS_FOR_NOTIFICATIONS_QUERY = gql`
  query FollowsForNotificationsQuery(
    $cursor: String
    $subscriptionsType: [SubscribableType!]
    $sortType: SortingOption
  ) {
    currentUser {
      slug
      mySubscriptions(
        types: $subscriptionsType
        after: $cursor
        sortType: $sortType
      ) {
        nodes {
          slug
          updatedAt
          ...Subscriptions_subscription
          ...PlayerNotifications_subscription
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Subscriptions.fragments.subscription}
  ${PlayerNotifications.fragments.subscription}
` as TypedDocumentNode<
  FollowsForNotificationsQuery,
  FollowsForNotificationsQueryVariables
>;

const playersSubscriptionsType = {
  [Sport.BASEBALL]: SubscribableType.BASEBALL_PLAYER,
  [Sport.FOOTBALL]: SubscribableType.PLAYER,
  [Sport.NBA]: SubscribableType.NBA_PLAYER,
};

const Root = styled.div`
  & > * + * {
    margin-top: 15px;
  }
`;

export const PlayersNotifications = () => {
  const { sortAsVariable, SortSelect } = useSortByDate();
  const { sportInputValue, SportSelect } = useSportSelect();

  const subscriptionsTypeVaribales = useMemo(
    () => sportInputValue.map(sport => playersSubscriptionsType[sport]),
    [sportInputValue]
  );

  const { data, loading, loadMore } = usePaginatedQuery(
    FOLLOWS_FOR_NOTIFICATIONS_QUERY,
    {
      variables: {
        subscriptionsType: subscriptionsTypeVaribales,
        sortType: sortAsVariable,
      },
      connection: 'EmailSubscriptionConnection',
    }
  );

  const {
    items: follows,
    hasMore,
    cursor,
  } = extractConnectionData(data?.currentUser?.mySubscriptions, src => src);

  if (loading || !follows) return <LoadingIndicator />;

  return (
    <MyPage
      page={MySorarePage.PLAYERS_NOTIFICATIONS}
      toolbar={
        <>
          <SportSelect />
          <SortSelect />
        </>
      }
    >
      <Root>
        {follows.length === 0 ? (
          <Text16>
            <FormattedMessage
              id="PlayersNotifications.empty"
              defaultMessage="You don't follow anyone yet!"
            />
          </Text16>
        ) : (
          <Subscriptions
            subscriptions={follows}
            ItemComponent={PlayerNotifications}
          />
        )}

        <LoadMoreButton
          hasMore={hasMore}
          loading={loading}
          loadMore={() => {
            loadMore(false, {
              cursor,
              sortType: sortAsVariable,
            });
          }}
        />
      </Root>
    </MyPage>
  );
};

export default PlayersNotifications;
