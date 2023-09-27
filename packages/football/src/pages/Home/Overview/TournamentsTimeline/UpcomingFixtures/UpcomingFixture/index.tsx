import { TypedDocumentNode, gql } from '@apollo/client';
import {
  faClock,
  faExclamationTriangle,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isFuture } from 'date-fns';
import { ReactNode, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import CardBack from '@sorare/core/src/components/card/Back/Football';
import LearnCompetitionsOnboardingTask from '@sorare/core/src/components/onboarding/managerTask/LearnCompetitionsOnboardingTask';
import ManagerTaskTooltip from '@sorare/core/src/components/onboarding/managerTask/ManagerTaskTooltip';
import { Fan } from '@sorare/core/src/components/rewards/Banner/Fan';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { FOOTBALL_LOBBY_UPCOMING } from '@sorare/core/src/constants/routes';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  LearnCompetitionsOnboardingStep,
  useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { glossary } from '@sorare/core/src/lib/glossary';

import { GameWeekTitle } from '@football/components/home/GameWeekTitle';
import HomeBlockWithTimeline from '@football/components/home/HomeBlockWithTimeline';
import { ItemRows } from '@football/components/home/ItemRows';
import { SeeAllButton } from '@football/components/home/SeeAllButton';
import { Lineup } from '@football/components/lineup/Lineup';
import { DumbBanner } from '@football/components/rewards/DumbBanner';
import NoCardEntry from '@football/components/so5/NoCardEntry';
import { sortLeaderboards, sortLeaderboardsByTournamentType } from '@football/lib/so5';

import { UpcomingFixture_vicc5Leaderboard } from './__generated__/index.graphql';

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
  vicc5Leaderboards: UpcomingFixture_vicc5Leaderboard[];
  loading: boolean;
  isLast: boolean;
  discoverElement?: ReactNode;
};

type Vicc5Lineup = UpcomingFixture_vicc5Leaderboard['myVicc5Lineups'][number];

const sortByExistingLineup = (
  l1: Nullable<Vicc5Lineup>,
  l2: Nullable<Vicc5Lineup>
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
  l1: Nullable<Vicc5Lineup>,
  l2: Nullable<Vicc5Lineup>
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
  l1: UpcomingFixture_vicc5Leaderboard,
  l2: UpcomingFixture_vicc5Leaderboard
) => {
  return l1.division - l2.division;
};

export const UpcomingFixture = ({
  index,
  vicc5Leaderboards,
  loading,
  isLast,
  discoverElement,
}: Props) => {
  const {
    flags: { enableNoCardEntry = false },
  } = useFeatureFlags();
  const navigate = useNavigate();
  const { task, setStep } = useManagerTaskContext();
  const sortedLeaderboards = useMemo(() => {
    return vicc5Leaderboards?.sort((l1, l2) => {
      const lineup1 = l1.myVicc5Lineups[0];
      const lineup2 = l2.myVicc5Lineups[0];
      return (
        sortByExistingLineup(lineup1, lineup2) ||
        sortByConfirmedLineup(lineup1, lineup2) ||
        sortByDivision(l1, l2) ||
        sortLeaderboardsByTournamentType(
          l1.vicc5Tournament.slug,
          l2.vicc5Tournament.slug
        ) ||
        sortLeaderboards(l1, l2)
      );
    });
  }, [vicc5Leaderboards]);

  const displayedLeaderboards = sortedLeaderboards?.slice(0, 3);
  const displayedItemsCount = displayedLeaderboards?.length;

  const vicc5Fixture = vicc5Leaderboards?.[0]?.vicc5Fixture;

  const gameWeek = displayedLeaderboards?.[0]?.gameWeek;

  const hasConfirmedLineup = vicc5Leaderboards.some(leaderboard =>
    leaderboard.myVicc5Lineups.some(lineup => !lineup?.draft)
  );

  return (
    <HomeBlockWithTimeline
      fixtureShortDisplayName={vicc5Fixture?.shortDisplayName}
      gameWeek={gameWeek}
      type="upcoming"
      isLast={isLast}
      title={<GameWeekTitle vicc5Fixture={vicc5Fixture} type="upcoming" />}
      loading={loading}
      action={
        <ManagerTaskTooltip
          name={LearnCompetitionsOnboardingStep.menu}
          title={
            <LearnCompetitionsOnboardingTask
              name={LearnCompetitionsOnboardingStep.menu}
              onClick={() => {
                navigate(FOOTBALL_LOBBY_UPCOMING);
                setStep(LearnCompetitionsOnboardingStep.lobby);
              }}
            />
          }
          disable={!task}
        >
          <SeeAllButton
            context="Upcoming"
            to={generatePath(FOOTBALL_LOBBY_UPCOMING, {
              tab: '',
            })}
          />
        </ManagerTaskTooltip>
      }
    >
      <ContentWrapper>
        <ItemRows itemsCount={displayedItemsCount} loading={loading}>
          {displayedLeaderboards?.map(leaderboard => (
            <Lineup
              key={leaderboard.slug}
              leaderboard={leaderboard}
              lineup={leaderboard.myVicc5Lineups[0]}
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
                  {vicc5Fixture.endDate &&
                  isFuture(new Date(vicc5Fixture.endDate)) ? (
                    <TimeLeft time={new Date(vicc5Fixture.endDate)} />
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
  vicc5Leaderboard: gql`
    fragment UpcomingFixture_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      rarityType
      gameWeek
      vicc5Tournament {
        id
        slug
      }
      division
      vicc5Fixture {
        slug
        id
        cutOffDate
        displayName
        shortDisplayName
        endDate
        ...GameWeekTitle_vicc5Fixture
      }
      commonDraftCampaign {
        slug
        status
      }
      myVicc5Lineups {
        id
        ...Lineup_vicc5Lineup
      }
      ...Lineup_vicc5Leaderboard
      ...sortLeaderboards_leaderboard
    }
    ${Lineup.fragments.vicc5Lineup}
    ${Lineup.fragments.vicc5Leaderboard}
    ${sortLeaderboards.fragments.leaderboard}
    ${GameWeekTitle.fragments.vicc5Fixture}
  ` as TypedDocumentNode<UpcomingFixture_vicc5Leaderboard>,
};
