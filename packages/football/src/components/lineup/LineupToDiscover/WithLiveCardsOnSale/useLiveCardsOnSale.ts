import { TypedDocumentNode, gql } from '@apollo/client';
import { isFuture, parseISO } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import WithLineupSuggestions from '@football/components/lineup/LineupToDiscover/WithLineupSuggestions';

import { WithLiveCardsOnSaleLeaderboardQuery } from './__generated__/index.graphql';
import {
  WithLiveCardsOnSaleCardQuery,
  WithLiveCardsOnSaleCardQueryVariables,
} from './__generated__/useLiveCardsOnSale.graphql';

const useDeduplicatePlayerCards = () => {
  const displayedPlayerSlugs = useRef<string[]>([]);

  return useCallback(
    (cards: WithLiveCardsOnSaleCardQuery['cards'] | undefined) => {
      const deduplicatedCards = cards?.reduce<
        WithLiveCardsOnSaleCardQuery['cards']
      >((acc, cur) => {
        if (
          acc.some(card => card?.player?.slug === cur?.player?.slug) ||
          displayedPlayerSlugs.current.includes(cur?.player?.slug)
        ) {
          return acc;
        }
        return [...acc, cur];
      }, []);
      const newPlayerSlugs =
        deduplicatedCards?.map(card => card?.player?.slug) || [];
      displayedPlayerSlugs.current = [
        ...displayedPlayerSlugs.current,
        ...newPlayerSlugs,
      ];
      return deduplicatedCards;
    },
    []
  );
};

const WITH_LIVE_CARDS_ON_SALE_CARD_QUERY = gql`
  query WithLiveCardsOnSaleCardQuery($cardSlugs: [String!]!) {
    cards(slugs: $cardSlugs) {
      slug
      assetId
      player {
        slug
      }
      token {
        slug
        assetId
        liveSingleSaleOffer {
          endDate
        }
      }
      ...WithLineupSuggestions_card
    }
  }
  ${WithLineupSuggestions.fragments.card}
` as TypedDocumentNode<
  WithLiveCardsOnSaleCardQuery,
  WithLiveCardsOnSaleCardQueryVariables
>;

type CommonDraftCampaign = NonNullable<
  WithLiveCardsOnSaleLeaderboardQuery['vicc5']['vicc5Leaderboard']['commonDraftCampaign']
>;
const useLiveCardsOnSale = ({
  bestDraftedPlayers,
  suggestionCardSlugs,
  isLastPage,
  fetchNextPage,
}: {
  suggestionCardSlugs: string[];
  bestDraftedPlayers: CommonDraftCampaign['draftedPlayers'];
  isLastPage: boolean;
  fetchNextPage: () => void;
}) => {
  const { data: cardData, loading } = useQuery(
    WITH_LIVE_CARDS_ON_SALE_CARD_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-and-network',
      variables: {
        cardSlugs: suggestionCardSlugs,
      },
    }
  );
  const deduplicate = useDeduplicatePlayerCards();

  const liveCardsOnSale = useMemo(() => {
    return deduplicate(
      cardData?.cards?.filter(card => {
        if (!card.token?.liveSingleSaleOffer) {
          return false;
        }
        const { endDate } = card.token.liveSingleSaleOffer;
        const alreadyInLineup = bestDraftedPlayers.some(
          draftedPlayer => draftedPlayer.player.slug === card.player.slug
        );
        return isFuture(parseISO(endDate)) && !alreadyInLineup;
      })
    );
  }, [bestDraftedPlayers, cardData?.cards, deduplicate]);

  useEffect(() => {
    if (liveCardsOnSale?.length === 0 && !isLastPage) {
      fetchNextPage();
    }
  }, [liveCardsOnSale, isLastPage, fetchNextPage]);

  return { loading, liveCardsOnSale };
};

export default useLiveCardsOnSale;
