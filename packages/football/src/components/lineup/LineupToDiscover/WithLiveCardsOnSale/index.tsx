import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useHits, usePagination } from 'react-instantsearch-hooks-web';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { Props as LineupProps } from '@football/components/lineup/Lineup';
import WithLineupSuggestions from '@football/components/lineup/LineupToDiscover/WithLineupSuggestions';

import {
  WithLiveCardsOnSaleLeaderboardQuery,
  WithLiveCardsOnSale_so5Leaderboard,
} from './__generated__/index.graphql';
import useLiveCardsOnSale from './useLiveCardsOnSale';

// this should not be a fragment because we only want drafted players on lineup with suggestion
// it also should not be merged with card query to avoid refetching drafted players on shuffle
const WITH_LIVE_CARDS_ON_SALE_LEADERBOARD_QUERY = gql`
  query WithLiveCardsOnSaleLeaderboardQuery($slug: String!) {
    so5: vicc5Root {
      so5Leaderboard: vicc5Leaderboard(slug: $slug) {
        slug
        commonDraftCampaign {
          slug
          draftedPlayers {
            id
            position
            player {
              slug
              averageScore(type: LAST_FIFTEEN_VICC5_AVERAGE_SCORE)
            }
            ...WithLineupSuggestions_draftablePlayer
          }
        }
      }
    }
  }
  ${WithLineupSuggestions.fragments.draftablePlayer}
`;

type CardHit = {
  active_club?: {
    slug?: string;
  };
  team?: {
    slug?: string;
  };
};

type CommonDraftCampaign = NonNullable<
  WithLiveCardsOnSaleLeaderboardQuery['so5']['so5Leaderboard']['commonDraftCampaign']
>;

const POSITIONS = [
  // Position.Defender,
  // Position.Goalkeeper,
  // Position.Midfielder,
  // Position.Forward,
];

const findBestPlayer = (
  draftedPlayers: CommonDraftCampaign['draftedPlayers'] | undefined
) => {
  return draftedPlayers?.reduce((p1, p2) => {
    if ((p1?.player.averageScore || 0) > (p2?.player.averageScore || 0)) {
      return p1;
    }
    return p2;
  }, draftedPlayers[0]);
};

const getBestPlayers = (
  draftedPlayers: CommonDraftCampaign['draftedPlayers']
) => {
  const bestPlayers: CommonDraftCampaign['draftedPlayers'] = [];
  POSITIONS.forEach(position => {
    const allPlayersForPosition = draftedPlayers.filter(
      draftedPlayer => draftedPlayer.position === position
    );
    const bestPlayer = findBestPlayer(allPlayersForPosition);
    if (bestPlayer) {
      bestPlayers.push(bestPlayer);
    }
  });
  return bestPlayers;
};

type Props = {
  loadingView: JSX.Element;
  children: (props: Partial<LineupProps>) => JSX.Element;
  amateurLeaderboardSlug: string;
  leagueFilter: string;
  so5Leaderboard: WithLiveCardsOnSale_so5Leaderboard;
  onPaymentSuccess: () => void;
};

const WithLiveCardsOnSale = ({
  suggestionCardSlugs,
  children,
  fetchNextPage,
  isLastPage,
  amateurLeaderboardSlug,
  ...otherProps
}: Omit<Props, 'loadingView'> & {
  suggestionCardSlugs: string[];
  fetchNextPage: () => void;
  isLastPage: boolean;
}) => {
  const { data: leaderboardData, loading: leaderboardLoading } =
    useQuery<WithLiveCardsOnSaleLeaderboardQuery>(
      WITH_LIVE_CARDS_ON_SALE_LEADERBOARD_QUERY,
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
          slug: amateurLeaderboardSlug,
        },
      }
    );

  const { draftedPlayers } =
    leaderboardData?.so5.so5Leaderboard?.commonDraftCampaign || {};
  const bestDraftedPlayers = useMemo(
    () => getBestPlayers(draftedPlayers || []),
    [draftedPlayers]
  );

  const { liveCardsOnSale, loading: cardLoading } = useLiveCardsOnSale({
    bestDraftedPlayers,
    isLastPage,
    fetchNextPage,
    suggestionCardSlugs,
  });

  return (
    <WithLineupSuggestions
      liveCardsOnSale={liveCardsOnSale}
      fetchMoreCardsOnSale={fetchNextPage}
      isLastCardsOnSalePage={isLastPage}
      loading={cardLoading || leaderboardLoading}
      draftedPlayers={bestDraftedPlayers}
      {...otherProps}
    >
      {children}
    </WithLineupSuggestions>
  );
};

const MAX_AUTO_NEXT_PAGE = 20;

const WithLiveCardsOnSaleContainer = ({
  loadingView,
  leagueFilter,
  amateurLeaderboardSlug,
  ...otherProps
}: Props) => {
  const { hits } = useHits<CardHit>();
  const { refine: setPage, currentRefinement: page, nbPages } = usePagination();
  if (!hits) {
    return loadingView;
  }

  const isLastPage = page >= Math.min(nbPages - 1, MAX_AUTO_NEXT_PAGE);
  return (
    <WithLiveCardsOnSale
      {...otherProps}
      leagueFilter={leagueFilter}
      suggestionCardSlugs={hits
        // filter out transfered players to avoid confusion for new users
        .filter(hit => hit.active_club?.slug === hit.team?.slug)
        .map(hit => hit.objectID)}
      amateurLeaderboardSlug={amateurLeaderboardSlug}
      fetchNextPage={() => {
        if (!isLastPage) {
          setPage(page + 1);
        }
      }}
      isLastPage={isLastPage}
    />
  );
};

WithLiveCardsOnSaleContainer.fragments = {
  so5Leaderboard: gql`
    fragment WithLiveCardsOnSale_so5Leaderboard on Vicc5Leaderboard {
      slug
      ...WithLineupSuggestions_so5Leaderboard
    }
    ${WithLineupSuggestions.fragments.so5Leaderboard}
  `,
};

export default WithLiveCardsOnSaleContainer;
