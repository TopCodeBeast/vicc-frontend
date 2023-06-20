import { gql } from '@apollo/client';

import { GetCurrentUserSubscriptionProps } from '@sorare/core/src/contexts/follow';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

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
`;

export default function useSubscribersCount(
  subscribable: GetCurrentUserSubscriptionProps
) {
  const { data } = useQuery<
    SubscriptionStatsQuery,
    SubscriptionStatsQueryVariables
  >(SUBSCRIPTION_STATS_QUERY, {
    variables: {
      subscribable: {
        type: subscribable.__typename,
        slug: subscribable.slug,
      },
    },
  });

  return data?.subscriptionStats.subscribersCount || 0;
}
