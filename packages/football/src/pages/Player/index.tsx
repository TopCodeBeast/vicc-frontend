import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { GAME_WIDTH_WITH_GAP } from '@sorare/core/src/components/player/FixtureChart';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { metadatas } from '@sorare/core/src/lib/seo/common';

import PageContextProvider, { pageContextFragments } from '@football/contexts/page';

import PlayerPageContent from './PlayerPageContent';
import {
  PlayerQuery,
  PlayerQueryVariables,
} from './__generated__/index.graphql';

const PLAYER_QUERY = gql`
  query PlayerQuery(
    $slug: String!
    $position: Position
    $after: String
    $first: Int
  ) {
    football {
      player(slug: $slug) {
        slug
        position: positionTyped
        displayName
        ...PageContext_subscribable
        ...PlayerPageContent_player
      }
    }
  }
  ${PlayerPageContent.fragments.player}
  ${pageContextFragments.subscribable}
` as TypedDocumentNode<PlayerQuery, PlayerQueryVariables>;

const PlayerPage = () => {
  const { slug } = useParams();
  const scoresLimit = Math.min(
    Math.ceil(window.innerWidth / GAME_WIDTH_WITH_GAP),
    26
  );
  const [selectedPosition, setPosition] = useState<Position | undefined>();
  const { data, loading, loadMore } = usePaginatedQuery(PLAYER_QUERY, {
    variables: {
      slug: slug!,
      position: selectedPosition,
      first: scoresLimit,
    },
    skip: !slug,
    connection: 'So5ScoreConnection',
  });

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        slug: slug!,
        position: selectedPosition,
        after: data?.football.player.allSo5Scores.pageInfo.endCursor,
        first: scoresLimit,
      });
    }, [
      selectedPosition,
      slug,
      scoresLimit,
      loadMore,
      data?.football.player.allSo5Scores.pageInfo.endCursor,
    ]),
    data?.football.player.allSo5Scores.pageInfo.hasNextPage || false,
    loading
  );

  useTitleAndDescription(
    metadatas.player.title,
    metadatas.player.description,
    data?.football.player
      ? { display_name: data.football.player.displayName }
      : false
  );

  if (loading && !data) return <LoadingIndicator />;
  if (!data) return null;

  const { player } = data.football;

  if (!selectedPosition) setPosition(player.position);

  return (
    <PageContextProvider value={{ object: player }}>
      <PlayerPageContent
        player={player}
        selectedPosition={selectedPosition}
        setPosition={setPosition}
        InfiniteScrollLoader={<InfiniteScrollLoader />}
      />
    </PageContextProvider>
  );
};

export default PlayerPage;
