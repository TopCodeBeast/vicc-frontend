import { gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import { FOOTBALL_LOBBY_UPCOMING } from '@sorare/core/src/constants/routes';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import { uniqueBy } from '@sorare/core/src/lib/arrays';

import { HomeBlock } from '@sorare/football/src/components/Home/Block';
import { ItemRows } from '@sorare/football/src/components/Home/ItemRows';
import { SeeAllButton } from '@sorare/football/src/components/Home/SeeAllButton';
import { Lineup } from '@sorare/football/src/components/lineup/Lineup';
import { sortLeaderboards, sortLeaderboardsByTournamentType } from 'lib/so5';

import { Upcoming_leaderboard } from './__generated__/index.graphql';

const sortByLineup = (l1: Upcoming_leaderboard, l2: Upcoming_leaderboard) => {
  const lineup1 = l1.mySo5Lineups[0];
  const lineup2 = l2.mySo5Lineups[0];
  if (lineup1 && !lineup2) {
    return -1;
  }
  if (!lineup1 && lineup2) {
    return 1;
  }
  if (lineup1?.draft && !lineup2?.draft) {
    return -1;
  }
  if (!lineup1?.draft && lineup2?.draft) {
    return 1;
  }
  if (l1.division < l2.division) {
    return -1;
  }
  if (l1.division > l2.division) {
    return 1;
  }
  return sortLeaderboardsByTournamentType(l1.tournamentType, l2.tournamentType);
};

type Props = {
  leaderboards?: Upcoming_leaderboard[];
  loading: boolean;
};

export const Upcoming = ({ leaderboards, loading }: Props) => {
  const sortByLineupsLeaderboards = useMemo(
    () =>
      leaderboards?.sort(
        (l1, l2) => sortByLineup(l1, l2) || sortLeaderboards(l1, l2)
      ),
    [leaderboards]
  );

  if (!leaderboards?.length && !loading) {
    return null;
  }

  const displayedLeaderboards = sortByLineupsLeaderboards?.slice(0, 3);
  const displayedItemsCount = displayedLeaderboards?.length;
  const showViewMoreButton = (sortByLineupsLeaderboards?.length || 0) > 3;
  const leaderboardsSortedByGameWeek = displayedLeaderboards?.sort(
    (l1, l2) => l1.gameWeek - l2.gameWeek
  );
  const leaderboardsDeduped = uniqueBy(
    l => l.gameWeek.toString(),
    leaderboardsSortedByGameWeek || []
  );
  const sortedFixtures = leaderboardsDeduped.map(l => l.so5Fixture);
  const firstGameWeekFixture = sortedFixtures[0];
  const secondGameWeekFixture = sortedFixtures[1];

  const cutOffDate = firstGameWeekFixture
    ? parseISO(firstGameWeekFixture.cutOffDate)
    : null;

  return (
    <HomeBlock
      title={
        sortedFixtures.length > 1 ? (
          <FormattedMessage
            id="Home.Upcoming.manyGameWeeksTitle"
            defaultMessage="Get ready for {gameWeek1} and {gameWeek2}"
            values={{
              gameWeek1: firstGameWeekFixture.displayName,
              gameWeek2: secondGameWeekFixture.displayName,
            }}
          />
        ) : (
          <FormattedMessage
            id="Home.Upcoming.Title"
            defaultMessage="Get ready for {gameWeek}"
            values={{
              gameWeek: firstGameWeekFixture?.displayName,
            }}
          />
        )
      }
      subtitle={
        <FormattedMessage
          id="Home.Upcoming.Subtitle"
          defaultMessage="{gameWeek} starts in {timeleft}"
          values={{
            gameWeek: firstGameWeekFixture?.displayName,
            timeleft: cutOffDate ? (
              <TimeLeft
                time={cutOffDate}
                Layout={({ children }) => <span>{children}</span>}
              />
            ) : undefined,
          }}
        />
      }
      loading={loading}
      action={
        showViewMoreButton && (
          <SeeAllButton
            context="Upcoming"
            to={generatePath(FOOTBALL_LOBBY_UPCOMING, {
              tab: '',
            })}
          />
        )
      }
    >
      <ItemRows itemsCount={displayedItemsCount} loading={loading}>
        {displayedLeaderboards?.map(leaderboard => (
          <Lineup
            key={leaderboard.slug}
            leaderboard={leaderboard}
            lineup={leaderboard.mySo5Lineups[0]}
          />
        ))}
      </ItemRows>
    </HomeBlock>
  );
};

Upcoming.fragments = {
  leaderboard: gql`
    fragment Upcoming_leaderboard on So5Leaderboard {
      slug
      rarityType
      gameWeek
      tournamentType
      division
      so5Fixture {
        slug
        id
        cutOffDate
        displayName
      }
      commonDraftCampaign {
        slug
        status
      }
      mySo5Lineups {
        id
        ...Lineup_so5Lineup
      }
      ...Lineup_so5Leaderboard
      ...sortLeaderboards_leaderboard
    }
    ${Lineup.fragments.so5Lineup}
    ${Lineup.fragments.so5Leaderboard}
    ${sortLeaderboards.fragments.leaderboard}
  `,
};
