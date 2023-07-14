import { gql } from '@apollo/client';

import {
  MarketplacePromotionalEvent,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import { useConfigContext } from '@sorare/core/src/contexts/config';

const getTokenEvent = (
  token: { assetId: string; slug: string; sport: Sport },
  promotionalEvents: {
    sport: Sport;
    events: MarketplacePromotionalEvent[];
  }[]
) => {
  const { sport, slug, assetId } = token;

  const objectId =
    sport === Sport.FOOTBALL ? slug : `baseball-assetId:${assetId}`;
  const sportEvents = promotionalEvents?.find(
    event => event.sport === sport
  )?.events;

  return sportEvents?.find(
    event => event.rewardDetailsHref && event.objectIds.includes(objectId)
  );
};

const useTokenTakesPartPromotionalEvent = () => {
  const { marketplacePromotionalEvents } = useConfigContext();

  return (
    tokens: { assetId: string; slug: string; sport: Sport }[]
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
  `,
};

export default useTokenTakesPartPromotionalEvent;
