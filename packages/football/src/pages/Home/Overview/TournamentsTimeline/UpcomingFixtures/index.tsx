import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo } from 'react';

import {
  CommonDraftCampaignStatus,
  Vicc5LeaderboardType,
} from '@sorare/core/src/__generated__/globalTypes';
import { groupBy } from '@sorare/core/src/lib/arrays';

import { Discover } from '@football/pages/Home/Overview/Discover';

import { UpcomingFixture } from './UpcomingFixture';
import { UpcomingFixtures_vicc5 } from './__generated__/index.graphql';

type Props = {
  vicc5: Nullable<UpcomingFixtures_vicc5>;
  loading: boolean;
};

type UpcomingFixtures_leaderboard =
  UpcomingFixtures_vicc5['upcomingLeaderboards'][number];

const filterCanCompose = (l: UpcomingFixtures_leaderboard) => {
  return (
    l.canCompose.value &&
    l.commonDraftCampaign?.status !== CommonDraftCampaignStatus.OPEN
  );
};

const filterTraining = (l: UpcomingFixtures_leaderboard) => {
  return l.vicc5LeaderboardType !== Vicc5LeaderboardType.SPECIAL_TRAINING_CENTER;
};

const filterTooManyCards = (l: UpcomingFixtures_leaderboard) => {
  return (
    l.commonDraftCampaign ||
    l.canCompose.value ||
    l.canCompose.notEnoughEligibleCards
  );
};

export const UpcomingFixtures = ({ vicc5, loading }: Props) => {
  const leaderboards = vicc5?.upcomingLeaderboards;

  const eligibleLeaderboards = useMemo(
    () => leaderboards?.filter(l => filterTraining(l) && filterCanCompose(l)),
    [leaderboards]
  );

  const draftableLeaderboards = useMemo(
    () =>
      leaderboards?.filter(
        l => l.commonDraftCampaign?.status === CommonDraftCampaignStatus.OPEN
      ),
    [leaderboards]
  );

  const leaderboardsWithDraft = useMemo(
    () => leaderboards?.filter(l => !!l.commonDraftCampaign),
    [leaderboards]
  );

  if (!leaderboards?.length && !loading) {
    return null;
  }

  const eligibleLeaderboardsGroupedByGameWeek = groupBy(
    l => l.gameWeek,
    eligibleLeaderboards || []
  );

  const draftableLeaderboardsGroupedByGameWeek = groupBy(
    l => l.gameWeek,
    draftableLeaderboards || []
  );
  const eligibleLeaderboardsGroupedByGameWeekEntries = Object.entries(
    eligibleLeaderboardsGroupedByGameWeek
  );

  const leaderboardsToDisplay =
    eligibleLeaderboardsGroupedByGameWeekEntries.length > 0
      ? eligibleLeaderboardsGroupedByGameWeekEntries
      : Object.entries(draftableLeaderboardsGroupedByGameWeek);

  return (
    <>
      {leaderboardsToDisplay.map(([gameWeek, leaderboardsList], index) => {
        const leaderboardsToDiscover = leaderboards?.filter(
          l =>
            filterTraining(l) &&
            !filterCanCompose(l) &&
            filterTooManyCards(l) &&
            l.gameWeek.toString() === gameWeek
        );

        return (
          <UpcomingFixture
            key={gameWeek}
            vicc5Leaderboards={leaderboardsList}
            loading={loading}
            index={index}
            isLast={index === leaderboardsToDisplay.length - 1}
            discoverElement={
              <Discover
                loading={loading}
                leaderboardsToDiscover={leaderboardsToDiscover}
                leaderboardsWithDraft={leaderboardsWithDraft}
                isInTournamentTimeline
              />
            }
          />
        );
      })}
    </>
  );
};

UpcomingFixtures.fragments = {
  vicc5: gql`
    fragment UpcomingFixtures_vicc5 on Vicc5Root {
      upcomingLeaderboards {
        slug
        gameWeek
        vicc5LeaderboardType
        commonDraftCampaign {
          slug
          status
        }
        ...UpcomingFixture_vicc5Leaderboard
      }
    }
    ${UpcomingFixture.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<UpcomingFixtures_vicc5>,
};
