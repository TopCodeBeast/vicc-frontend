import { TypedDocumentNode, gql } from '@apollo/client';

import { GetCurrentUserSubscriptionProps } from '@core/contexts/follow';
import useQuery from '@core/hooks/graphql/useQuery';

import {
  SubscriptionStatsQuery,
  SubscriptionStatsQueryVariables,
} from './__generated__/useSubscribersCount.graphql';

export const SUBSCRIPTION_STATS_QUERY = gql`
  query SubscriptionStatsQuery($subscribable: SubscribableInput!) {
    subscriptionStats(subscribable: $subscribable) {
      subscribersCount
    }
  }
` as TypedDocumentNode<SubscriptionStatsQuery, SubscriptionStatsQueryVariables>;

export default function useSubscribersCount(
  subscribable: GetCurrentUserSubscriptionProps
) {
  const { data } = useQuery(SUBSCRIPTION_STATS_QUERY, {
    variables: {
      subscribable: {
        type: subscribable.__typename as any,
        slug: subscribable.slug,
      },
    },
  });

  return data?.subscriptionStats.subscribersCount || 0;
}
