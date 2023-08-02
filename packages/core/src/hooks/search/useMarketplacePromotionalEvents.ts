import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  MarketPlacePromotionalEvents,
  MarketPlacePromotionalEventsVariables,
} from './__generated__/useMarketplacePromotionalEvents.graphql';

const QUERY = gql`
  query MarketPlacePromotionalEvents {
    config {
      id
      marketplacePromotionalEvents {
        sport
        events {
          name
          objectIds
          rewardDetailsHref
        }
      }
    }
  }
` as TypedDocumentNode<
  MarketPlacePromotionalEvents,
  MarketPlacePromotionalEventsVariables
>;

export default () => {
  const { data, loading } = useQuery(QUERY, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  return {
    marketplacePromotionalEvents:
      data?.config?.marketplacePromotionalEvents || [],
    loading,
  };
};
