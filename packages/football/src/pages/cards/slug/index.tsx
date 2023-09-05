import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { GAME_WIDTH_WITH_GAP } from '@sorare/core/src/components/player/FixtureChart';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { scarcityNames } from '@sorare/core/src/lib/cards';
import { format } from '@sorare/core/src/lib/seasons';
import { metadatas } from '@sorare/core/src/lib/seo/common';

import CardPageContent from '@football/components/card/CardPage';

import {
  FootballCardQuery,
  FootballCardQueryVariables,
} from './__generated__/index.graphql';

export const CARD_QUERY = gql`
  query FootballCardQuery(
    $slug: String!
    $bidCursor: String
    $scoreCursor: String
    $first: Int
  ) {
    #football {
      card(slug: $slug) {
        slug
        assetId
        name
        rarity
        singleCivilYear
        season {
          startYear
        }
        player {
          slug
          displayName
        }
        ...CardPage_card
      }
    #}
  }
  ${CardPageContent.fragments.card}
` as TypedDocumentNode<FootballCardQuery, FootballCardQueryVariables>;

type Props = {
  inDialog?: boolean;
};
export const CardPage = ({ inDialog }: Props) => {
  const { slug } = useParams();
  const scoresLimit = Math.min(
    Math.ceil(window.innerWidth / GAME_WIDTH_WITH_GAP),
    26
  );
  const {
    data,
    loading,
    loadMore: loadMoreBids,
  } = usePaginatedQuery(CARD_QUERY, {
    variables: {
      slug: slug!,
      first: scoresLimit,
    },
    skip: !slug,
    connection: 'TokenBidConnection',
  });

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMoreBids(
        false,
        {
          slug: slug!,
          scoreCursor: data?.card?.allVicc5Scores?.pageInfo.endCursor,
          first: scoresLimit,
        },
        'Vicc5ScoreConnection'
      );
    }, [
      data?.card.allVicc5Scores.pageInfo.endCursor,
      slug,
      scoresLimit,
      loadMoreBids,
    ]),
    !!data?.card?.allVicc5Scores?.pageInfo.hasNextPage,
    loading
  );

  useTitleAndDescription(
    metadatas.card.title,
    metadatas.card.description,
    !!data?.card && {
      display_name: data.card.player.displayName,
      scarcity: scarcityNames[data.card.rarity],
      season: format(
        {
          startYear: data.card.season.startYear,
        },
        { singleCivilYear: data.card.singleCivilYear }
      ),
    }
  );

  return (
    <CardPageContent
      slug={data?.card ? data.card.slug : ''}
      card={data?.card}
      loading={loading}
      loadMoreBids={loadMoreBids}
      InfiniteScrollLoader={<InfiniteScrollLoader />}
      inDialog={inDialog}
    />
  );
};

export default CardPage;
