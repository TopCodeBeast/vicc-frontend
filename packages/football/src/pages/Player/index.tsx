import { gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
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
  query PlayerQuery($slug: String!, $position: Position, $after: String) {
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
`;

const PlayerPage = () => {
  const { slug } = useParams();
  const [selectedPosition, setPosition] = useState<Position | undefined>();
  const { data, loading, loadMore } = usePaginatedQuery<
    PlayerQuery,
    PlayerQueryVariables
  >(PLAYER_QUERY, {
    variables: {
      slug: slug!,
      position: selectedPosition,
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
      });
    }, [
      selectedPosition,
      slug,
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
