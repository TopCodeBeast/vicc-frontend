import { gql } from '@apollo/client';
import { useMemo } from 'react';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { blockchainRarities } from '@sorare/core/src/lib/cards';

import {
  RecentCurrentUserCardsQuery,
  RecentCurrentUserCardsQueryVariables,
} from './__generated__/useRecentCurrentUserCardsQuery.graphql';

const RECENT_CURRENT_USER_CARDS_QUERY = gql`
  query RecentCurrentUserCardsQuery(
    $ownedSinceAfter: ISO8601DateTime!
    $first: Int!
    $rarities: [Rarity!]
  ) {
    currentUser {
      slug
      paginatedCards(
        first: $first
        ownedSinceAfter: $ownedSinceAfter
        rarities: $rarities
      ) {
        nodes {
          slug
          assetId
        }
      }
    }
  }
`;

function useRecentCurrentUserCardsQuery({
  skip = false,
  includeCommonCards = true,
} = {}) {
  const twoHoursAgo = useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() - 2);
    return date.toISOString();
  }, []);

  const { data, refetch } = useQuery<
    RecentCurrentUserCardsQuery,
    RecentCurrentUserCardsQueryVariables
  >(RECENT_CURRENT_USER_CARDS_QUERY, {
    variables: {
      ownedSinceAfter: twoHoursAgo,
      first: 8,
      rarities: includeCommonCards
        ? null
        : (blockchainRarities as unknown as Rarity[]),
    },
    skip,
  });

  return {
    recentCurrentUserCards: data?.currentUser?.paginatedCards?.nodes,
    refetch,
  };
}

export default useRecentCurrentUserCardsQuery;
