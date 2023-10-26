import { TypedDocumentNode, gql } from '@apollo/client';

import {
  MarketplacePromotionalEvent,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import useMarketplacePromotionalEvents from '@sorare/core/src/hooks/search/useMarketplacePromotionalEvents';

import { useTokenTakesPartPromotionalEvent_token } from './__generated__/useTokenTakesPartPromotionalEvent.graphql';

const getTokenEvent = (
  token: { assetId?: string; slug: string; sport?: Sport },
  promotionalEvents: {
    events: MarketplacePromotionalEvent[];
  }[]
) => {
  const { slug } = token;

  const objectId = slug;
  const sportEvents = promotionalEvents.find(event => event)?.events;

  return sportEvents?.find(
    event => event.rewardDetailsHref && event.objectIds.includes(objectId)
  );
};

const useTokenTakesPartPromotionalEvent = () => {
  const { marketplacePromotionalEvents } = useMarketplacePromotionalEvents();

  return (
    tokens: { assetId?: string; slug: string; sport?: Sport }[]
  ): MarketplacePromotionalEvent | undefined => {
    const tokenEvents = tokens.map(token =>
      getTokenEvent(token, marketplacePromotionalEvents)
    );

    return tokenEvents.find(event => event);
  };
};

useTokenTakesPartPromotionalEvent.fragments = {
  token: gql`
    fragment useTokenTakesPartPromotionalEvent_token on Token {
      assetId
      slug
      sport
    }
  ` as TypedDocumentNode<useTokenTakesPartPromotionalEvent_token>,
};

export default useTokenTakesPartPromotionalEvent;
