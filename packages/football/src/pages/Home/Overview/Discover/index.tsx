import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { FOOTBALL_LOBBY_UPCOMING } from '@sorare/core/src/constants/routes';

import { HomeBlock } from '@football/components/Home/Block';
import { ItemRows } from '@football/components/Home/ItemRows';
import { SeeAllButton } from '@football/components/Home/SeeAllButton';
import { Lineup } from '@football/components/lineup/Lineup';
import { sortLeaderboardsByTournamentType } from '@football/lib/so5';

import { Discover_leaderboard } from './__generated__/index.graphql';

const DISCOVER_LADDER = [
  {
    id: 'semipro',
    filters: {
      rarity: Rarity.limited,
      division: 2,
    },
  },
  {
    id: 'pro',
    filters: {
      rarity: Rarity.limited,
      division: 3,
    },
  },
  {
    id: 'rare',
    filters: {
      rarity: Rarity.rare,
    },
  },
  {
    id: 'super_rare',
    filters: {
      rarity: Rarity.super_rare,
    },
  },
  {
    id: 'unique',
    filters: {
      rarity: Rarity.unique,
    },
  },
];

const getDraftedAmateurOf = (
  leaderboard: Discover_leaderboard,
  amateurLeaderboards: Discover_leaderboard[] | undefined
) => {
  return amateurLeaderboards?.find(
    amateurLeaderboard =>
      leaderboard.tournamentType === amateurLeaderboard.tournamentType
  );
};

const sortByDrafted = (
  l1: Discover_leaderboard,
  l2: Discover_leaderboard,
  draftedLeaderboards: Discover_leaderboard[] | undefined
) => {
  const draftedAmateur1 = getDraftedAmateurOf(l1, draftedLeaderboards);
  const draftedAmateur2 = getDraftedAmateurOf(l2, draftedLeaderboards);

  if (draftedAmateur1 && !draftedAmateur2) {
    return -1;
  }
  if (draftedAmateur2 && !draftedAmateur1) {
    return 1;
  }
  return 0;
};

const getLeaderboardsToDiscover = (
  leaderboardsToDiscover: Discover_leaderboard[] | undefined,
  draftedLeaderboards: Discover_leaderboard[] | undefined
) => {
  return DISCOVER_LADDER.map(item => {
    const correspondingLeaderboards = leaderboardsToDiscover
      ?.filter(
        l =>
          l.mainRarityType === item.filters.rarity &&
          (!item.filters.division || l.division === item.filters.division)
      )
      .sort(
        (l1, l2) =>
          sortByDrafted(l1, l2, draftedLeaderboards) ||
          sortLeaderboardsByTournamentType(l1.tournamentType, l2.tournamentType)
      );

    return correspondingLeaderboards?.[0];
  })
    .filter(Boolean)
    .slice(0, 3);
};

type Props = {
  leaderboardsToDiscover?: Discover_leaderboard[];
  leaderboardsWithDraft?: Discover_leaderboard[];
  loading: boolean;
  isInTournamentTimeline?: boolean;
};

export const Discover = ({
  leaderboardsToDiscover,
  loading,
  leaderboardsWithDraft,
  isInTournamentTimeline,
}: Props) => {
  const draftedLeaderboards = leaderboardsWithDraft?.filter(
    l => l.commonDraftCampaign?.status !== 'OPEN'
  );
  const displayedLeaderboards = useMemo(
    () =>
      getLeaderboardsToDiscover(leaderboardsToDiscover, draftedLeaderboards),
    [leaderboardsToDiscover, draftedLeaderboards]
  );

  if (!displayedLeaderboards?.length && !loading) {
    return null;
  }

  return (
    <HomeBlock
      loading={loading}
      title={
        <FormattedMessage
          id="Home.Overview.Discover.Title"
          defaultMessage="Progress to the next level"
        />
      }
      subtitle={
        <FormattedMessage
          id="Home.Overview.Discover.Subtitle"
          defaultMessage="Unlock new exciting competitions to win amazing prizes"
        />
      }
      action={
        !isInTournamentTimeline && (
          <SeeAllButton
            context="Discover"
            to={generatePath(FOOTBALL_LOBBY_UPCOMING, {
              tab: '',
            })}
          />
        )
      }
    >
      <ItemRows itemsCount={displayedLeaderboards?.length} loading={loading}>
        {displayedLeaderboards?.map(leaderboard => {
          return (
            <Lineup
              key={leaderboard.slug}
              leaderboard={leaderboard}
              hideGameWeekInfo={isInTournamentTimeline}
            />
          );
        })}
      </ItemRows>
    </HomeBlock>
  );
};

Discover.fragments = {
  leaderboard: gql`
    fragment Discover_leaderboard on So5Leaderboard {
      slug
      mainRarityType
      division
      so5LeaderboardType
      tournamentType
      ...Lineup_so5Leaderboard
    }
    ${Lineup.fragments.so5Leaderboard}
  `,
};
