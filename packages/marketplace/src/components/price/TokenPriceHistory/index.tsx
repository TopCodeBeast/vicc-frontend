import { gql } from '@apollo/client';
import { useCallback } from 'react';

import {
  Collection,
  Currency,
  Rarity,
} from '@sorare/core/src/__generated__/globalTypes';
import useEvents from '@sorare/core/src/lib/events/useEvents';

import PriceHistoryFromProps from '../PriceHistoryFromProps';

export type FakeToken = {
  slug: string;
  collection: Collection;
  metadata: {
    rarity: Rarity;
    playerSlug: string;
  };
};

type Props = {
  token: FakeToken;
  context: string;
  currency?: Currency;
};
const TokenPriceHistory = ({ token, context, currency }: Props) => {
  const track = useEvents();
  const { metadata, collection } = token;
  const variables = {
    rarity: metadata.rarity,
    collection,
    playerSlug: metadata.playerSlug,
  };
  const onClick = useCallback(
    (clickedToken: { slug: string }) => {
      if (clickedToken) {
        track('Click Price History', {
          clickedCardSlug: clickedToken.slug,
          cardSlug: token.slug,
          interactionContext: context,
        });
      }
    },
    [token.slug, context, track]
  );
  return (
    <PriceHistoryFromProps
      variables={variables}
      onClick={onClick}
      currency={currency}
    />
  );
};

TokenPriceHistory.fragments = {
  token: gql`
    fragment TokenPriceHistory_token on Token {
      assetId
      slug
      collection
      metadata {
        ... on TokenBaseballMetadata {
          id
        }
        ... on TokenFootballMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          playerDisplayName
          playerSlug
        }
      }
    }
  `,
};

export default TokenPriceHistory;
