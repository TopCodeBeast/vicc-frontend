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
    football {
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
    }
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
          scoreCursor: data?.football.card?.allVicc5Scores?.pageInfo.endCursor,
          first: scoresLimit,
        },
        'Vicc5ScoreConnection'
      );
    }, [
      data?.football.card.allVicc5Scores.pageInfo.endCursor,
      slug,
      scoresLimit,
      loadMoreBids,
    ]),
    !!data?.football.card?.allVicc5Scores?.pageInfo.hasNextPage,
    loading
  );

  useTitleAndDescription(
    metadatas.card.title,
    metadatas.card.description,
    !!data?.football.card && {
      display_name: data.football.card.player.displayName,
      scarcity: scarcityNames[data.football.card.rarity],
      season: format(
        {
          startYear: data.football.card.season.startYear,
        },
        { singleCivilYear: data.football.card.singleCivilYear }
      ),
    }
  );

  return (
    <CardPageContent
      slug={data?.football.card ? data.football.card.slug : ''}
      card={data?.football.card}
      loading={loading}
      loadMoreBids={loadMoreBids}
      InfiniteScrollLoader={<InfiniteScrollLoader />}
      inDialog={inDialog}
    />
  );
};

export default CardPage;
