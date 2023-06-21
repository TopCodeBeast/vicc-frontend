import { gql } from '@apollo/client';
import {
  faClock,
  faExclamationTriangle,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isFuture } from 'date-fns';
import { ReactNode, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import CardBack from '@sorare/core/src/components/card/Back/Football';
import { Fan } from '@sorare/core/src/components/rewards/Banner/Fan';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { FOOTBALL_LOBBY_UPCOMING } from '@sorare/core/src/constants/routes';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { glossary } from '@sorare/core/src/lib/glossary';

import { GameWeekTitle } from '@football/components/Home/GameWeekTitle';
import HomeBlockWithTimeline from '@football/components/Home/HomeBlockWithTimeline';
import { ItemRows } from '@football/components/Home/ItemRows';
import { SeeAllButton } from '@football/components/Home/SeeAllButton';
import { Lineup } from '@football/components/lineup/Lineup';
import { DumbBanner } from '@football/components/rewards/DumbBanner';
import NoCardEntry from '@football/components/so5/NoCardEntry';
import { sortLeaderboards, sortLeaderboardsByTournamentType } from '@football/lib/so5';

import { UpcomingFixture_so5Leaderboard } from './__generated__/index.graphql';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const DescriptionRow = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;
const IconWrapper = styled.div`
  position: relative;
`;
const FanWrapper = styled.div`
  opacity: 0.6;
`;
const WarningIconWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  index: number;
  so5Leaderboards: UpcomingFixture_so5Leaderboard[];
  loading: boolean;
  isLast: boolean;
  discoverElement?: ReactNode;
};

type So5Lineup = UpcomingFixture_so5Leaderboard['mySo5Lineups'][number];

const sortByExistingLineup = (
  l1: Nullable<So5Lineup>,
  l2: Nullable<So5Lineup>
) => {
  if (l1 && !l2) {
    return -1;
  }
  if (!l1 && l2) {
    return 1;
  }
  return 0;
};

const sortByConfirmedLineup = (
  l1: Nullable<So5Lineup>,
  l2: Nullable<So5Lineup>
) => {
  if (l1?.draft && !l2?.draft) {
    return -1;
  }
  if (!l1?.draft && l2?.draft) {
    return 1;
  }
  return 0;
};

const sortByDivision = (
  l1: UpcomingFixture_so5Leaderboard,
  l2: UpcomingFixture_so5Leaderboard
) => {
  return l1.division - l2.division;
};

export const UpcomingFixture = ({
  index,
  so5Leaderboards,
  loading,
  isLast,
  discoverElement,
}: Props) => {
  const {
    flags: { enableNoCardEntry = false },
  } = useFeatureFlags();
  const sortedLeaderboards = useMemo(() => {
    return so5Leaderboards?.sort((l1, l2) => {
      const lineup1 = l1.mySo5Lineups[0];
      const lineup2 = l2.mySo5Lineups[0];
      return (
        sortByExistingLineup(lineup1, lineup2) ||
        sortByConfirmedLineup(lineup1, lineup2) ||
        sortByDivision(l1, l2) ||
        sortLeaderboardsByTournamentType(
          l1.tournamentType,
          l2.tournamentType
        ) ||
        sortLeaderboards(l1, l2)
      );
    });
  }, [so5Leaderboards]);

  const displayedLeaderboards = sortedLeaderboards?.slice(0, 3);
  const displayedItemsCount = displayedLeaderboards?.length;

  const so5Fixture = so5Leaderboards?.[0]?.so5Fixture;

  const gameWeek = displayedLeaderboards?.[0]?.gameWeek;

  const hasConfirmedLineup = so5Leaderboards.some(leaderboard =>
    leaderboard.mySo5Lineups.some(lineup => !lineup?.draft)
  );

  return (
    <HomeBlockWithTimeline
      gameWeek={gameWeek}
      type="upcoming"
      isLast={isLast}
      title={<GameWeekTitle so5Fixture={so5Fixture} type="upcoming" />}
      loading={loading}
      action={
        <SeeAllButton
          context="Upcoming"
          to={generatePath(FOOTBALL_LOBBY_UPCOMING, {
            tab: '',
          })}
        />
      }
    >
      <ContentWrapper>
        <ItemRows itemsCount={displayedItemsCount} loading={loading}>
          {displayedLeaderboards?.map(leaderboard => (
            <Lineup
              key={leaderboard.slug}
              leaderboard={leaderboard}
              lineup={leaderboard.mySo5Lineups[0]}
              hideGameWeekInfo
            />
          ))}
        </ItemRows>
        {!loading && (
          <DumbBanner
            title={
              hasConfirmedLineup ? (
                <FormattedMessage {...glossary.rewards} />
              ) : (
                <FormattedMessage
                  id="UpcomingFixture.noConfirmedLineupRewardTitle"
                  defaultMessage="Submit your teams to win rewards"
                />
              )
            }
            description={
              hasConfirmedLineup && (
                <DescriptionRow>
                  <FontAwesomeIcon icon={faClock} size="sm" />
                  {so5Fixture.endDate &&
                  isFuture(new Date(so5Fixture.endDate)) ? (
                    <TimeLeft time={new Date(so5Fixture.endDate)} />
                  ) : undefined}
                </DescriptionRow>
              )
            }
            icon={
              <IconWrapper>
                <FanWrapper>
                  <Fan
                    elements={new Array(6).fill(0).map((_, i) => (
                      <CardBack
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        path={`${FRONTEND_ASSET_HOST}/cards/back/common.svg`}
                      />
                    ))}
                  />
                </FanWrapper>
                {!hasConfirmedLineup && (
                  <WarningIconWrapper>
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      size="lg"
                      color="white"
                    />
                  </WarningIconWrapper>
                )}
              </IconWrapper>
            }
            disabled
            hideClaimButton
          />
        )}
        {index === 0 && enableNoCardEntry && <NoCardEntry />}
        {discoverElement}
      </ContentWrapper>
    </HomeBlockWithTimeline>
  );
};

UpcomingFixture.fragments = {
  so5Leaderboard: gql`
    fragment UpcomingFixture_so5Leaderboard on So5Leaderboard {
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
        endDate
        ...GameWeekTitle_so5Fixture
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
    ${GameWeekTitle.fragments.so5Fixture}
  `,
};
