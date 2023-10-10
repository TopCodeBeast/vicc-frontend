import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { Suspense } from 'react';
import { defineMessages } from 'react-intl';
import {
  Route,
  generatePath,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import { Portal } from '@sorare/core/src/atoms/layout/Portal';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import { Text14, title4 } from '@sorare/core/src/atoms/typography';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import {
  FOOTBALL_COMPETITION_DETAILS_DETAILS,
  FOOTBALL_COMPETITION_DETAILS_LEADERBOARD,
  FOOTBALL_COMPETITION_DETAILS_MATCHES,
  FOOTBALL_COMPETITION_DETAILS_REWARDS,
  FOOTBALL_COMPETITION_DETAILS_TEAM,
} from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import { fantasy, glossary } from '@sorare/core/src/lib/glossary';
import { lazy } from '@sorare/core/src/lib/retry';
import useBottomBarNavItems from '@sorare/core/src/routing/MultiSportBottomNavBar/useBottomBarNavItems';
import { RootRoutes } from '@sorare/core/src/routing/RootRoutes';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { useLineupSharingAttributes } from '@football/components/lineup/useLineupSharingAttributes';
import DivisionLogo from '@football/components/so5/DivisionLogo';
import getLineupDisplayName from '@football/lib/lineup/getLineupDisplayName';
import { getLeaderboardInfo, isFixtureStarted } from '@football/lib/so5';

import { CompetitionDetailsTimeLeft } from './CompetitionDetailsTimeLeft';
import TeamActions from './Team/Actions';
import {
  CompetitionDetailsQuery,
  CompetitionDetailsQueryVariables,
} from './__generated__/index.graphql';

type CompetitionDetailsQuery_vicc5Leaderboard =
  CompetitionDetailsQuery['vicc5']['vicc5Leaderboard'];

// const Team = lazy(async () => import('@football/pages/Lobby/CompetitionDetails/Team'));
const Rewards = lazy(
  async () => import('@football/pages/Lobby/CompetitionDetails/Rewards')
);
// const Leaderboards = lazy(
//   async () => import('@football/pages/Lobby/CompetitionDetails/Leaderboards')
// );
const Details = lazy(
  async () => import('@football/pages/Lobby/CompetitionDetails/Details')
);
const Matches = lazy(
  async () => import('@football/pages/Lobby/CompetitionDetails/Matches')
);

const Root = styled(Container)`
  position: relative;
  isolation: isolate;
  height: 100%;
  background: var(--c-neutral-200);
  color: var(--c-neutral-1000);
  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: -1;
    height: 100px;
    content: '';
    pointer-events: none;
    background: var(--c-gradient-common);
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    );
  }
  &.mix::before {
    background: var(--c-gradient-mix);
  }
  &.limited::before {
    background: var(--c-gradient-limited);
  }
  &.rare::before {
    background: var(--c-gradient-rare);
  }
  &.super_rare::before {
    background: var(--c-gradient-superRare);
  }
  &.unique::before {
    background: var(--c-gradient-unique);
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  height: 100%;
  padding: var(--double-unit) 0;
`;
const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  color: var(--c-static-neutral-100);
  & * {
    color: inherit;
  }
`;
const Titles = styled.div`
  flex: 1;
`;
const Informations = styled.div`
  display: grid;
  grid-template-columns: calc(5 * var(--unit)) 1fr;
  grid-template-areas:
    'subtitle subtitle'
    'logo title';
  align-items: center;
  column-gap: var(--half-unit);
  width: 100%;
  @media ${laptopAndAbove} {
    grid-template-areas:
      'logo subtitle'
      'logo title';
    column-gap: var(--unit);
  }
`;
const DivisionLogoWrapper = styled.div`
  grid-area: logo;
  align-self: center;
`;
const Title = styled.h2`
  grid-area: title;
  ${title4}
  margin-top: calc(-0.5 * var(--unit));
`;
const Subtitles = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  grid-area: subtitle;
  opacity: 0.8;
`;
const Extras = styled.div`
  display: flex;
  gap: var(--unit);
`;
const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const TeamActionsWrapper = styled.div`
  position: sticky;
  bottom: 0;
  margin-top: auto;
  padding: var(--unit);
  @media ${tabletAndAbove} {
    margin-top: 0;
    width: auto;
    background: none;
    padding: 0;
  }
`;

const ShareLabel = styled.span`
  display: none;
  @media ${tabletAndAbove} {
    display: inline-block;
    margin-left: var(--unit);
  }
`;

const COMPETITION_DETAILS_QUERY = gql`
  query CompetitionDetailsQuery($slug: String!) {
    #football {
      vicc5Root {
        vicc5Leaderboard(slug: $slug) {
          slug
          rarityType
          teamsCap
          iconUrl
          vicc5Fixture {
            slug
            startDate
            endDate
            aasmState
            ...CompetitionDetailsTimeLeft_vicc5Fixture
          }
          myVicc5Lineups {
            id
            draft
            cancelledAt
            ...SocialShare_SocialPictures
            ...getLineupDisplayName_vicc5Lineup
            ...useLineupSharingAttributes_vicc5Lineup
          }
          ...getLeaderboardInfo_vicc5Leaderboard
          ...TeamActions_lineup
          ...DivisionLogo_vicc5Leaderboard
          ...getLineupDisplayName_vicc5Leaderboard
        }
      }
    #}
  }
  ${TeamActions.fragments.lineup}
  ${SocialShare.fragments.socialPictures}
  ${getLeaderboardInfo.fragments.vicc5Leaderboard}
  ${DivisionLogo.fragments.vicc5Leaderboard}
  ${CompetitionDetailsTimeLeft.fragments.vicc5Fixture}
  ${getLineupDisplayName.fragments.vicc5Lineup}
  ${getLineupDisplayName.fragments.vicc5Leaderboard}
  ${useLineupSharingAttributes.fragments.vicc5Lineup}
` as TypedDocumentNode<
  CompetitionDetailsQuery,
  CompetitionDetailsQueryVariables
>;

const ScarcityAndDate = ({
  leaderboard,
}: {
  leaderboard: CompetitionDetailsQuery_vicc5Leaderboard;
}) => {
  const { formatMessage, /*formatDateTimeRange*/ } = useIntlContext();
  const { endDate, startDate } = leaderboard.vicc5Fixture;
  const { scarcityMessageDescriptor } = getLeaderboardInfo(leaderboard);
  const formattedScarcity = formatMessage(scarcityMessageDescriptor);
  return (
    <Subtitles>
      <Text14>{formattedScarcity}</Text14>
      <svg width={3} height={3} fill="currentColor">
        <circle r={1.5} cx={1.5} cy={1.5} />
      </svg>
      <Text14>
        {/* {formatDateTimeRange(new Date(startDate), new Date(endDate), {
          day: '2-digit',
          month: 'short',
        })} */}
      </Text14>
    </Subtitles>
  );
};

const messages = defineMessages({
  draft: {
    id: 'Lobby.CompetitionDetails.Draft',
    defaultMessage: 'Draft',
  },
  joined: {
    id: 'Lobby.CompetitionDetails.Joined',
    defaultMessage: 'Submitted',
  },
  team: {
    id: 'CompetitionDetails.TabsItem.team',
    defaultMessage: 'Team',
  },
  leaderboard: {
    id: 'CompetitionDetails.TabsItem.leaderboard',
    defaultMessage: 'Leaderboard',
  },
  details: {
    id: 'CompetitionDetails.TabsItem.details',
    defaultMessage: 'Details',
  },
  matches: {
    id: 'CompetitionDetails.TabsItem.matches',
    defaultMessage: 'Matches',
  },
});

type Props = {
  closeButton?: React.JSX.Element;
};
export const CompetitionDetails = ({ closeButton }: Props) => {
  const { formatMessage } = useIntlContext();
  const { competition } = useParams();
  const [searchParams] = useSearchParams();
  const idFromQS = searchParams.get('id');
  const { up: isTablet } = useScreenSize('tablet');
  const bgLocation = useBgLocation();
  const bottomNavBarItems = useBottomBarNavItems();
  const { data } = useQuery(COMPETITION_DETAILS_QUERY, {
    variables: { slug: competition || '' },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const { vicc5Leaderboard } = data?.vicc5 || {};

  const getCorrespondingLineup = () => {
    if (idFromQS) {
      return vicc5Leaderboard?.myVicc5Lineups.find(
        ({ id }) => idFromObject(id) === idFromQS
      );
    }
    if (vicc5Leaderboard?.teamsCap && vicc5Leaderboard.teamsCap > 1) {
      return null;
    }
    return vicc5Leaderboard?.myVicc5Lineups[0];
  };
  const lineup = getCorrespondingLineup();
  const lineupSharingAttributes = useLineupSharingAttributes(lineup);

  if (!vicc5Leaderboard) {
    return null;
  }

  const { backgroundScarcity } = getLeaderboardInfo(vicc5Leaderboard);

  const paths = {
    teams: FOOTBALL_COMPETITION_DETAILS_TEAM,
    leaderboards: FOOTBALL_COMPETITION_DETAILS_LEADERBOARD,
    details: FOOTBALL_COMPETITION_DETAILS_DETAILS,
    matches: FOOTBALL_COMPETITION_DETAILS_MATCHES,
    rewards: FOOTBALL_COMPETITION_DETAILS_REWARDS,
  };

  const getTeamBadge = () => {
    if (lineup && vicc5Leaderboard?.canCompose.value) {
      return formatMessage(messages[lineup?.draft ? 'draft' : 'joined']);
    }
    if (lineup?.cancelledAt) {
      return formatMessage(glossary.canceled);
    }
    return undefined;
  };
  const TabsItems = [
    /*{
      path: paths.teams,
      to: generatePath(paths.teams, {
        competition,
      }),
      label: <span>{formatMessage(messages.team)}</span>,
      badge: getTeamBadge(),
      hide: !lineup,
      Component: Team,
    },
    {
      path: paths.leaderboards,
      to: generatePath(paths.leaderboards, {
        competition,
      }),
      label: <span>{formatMessage(messages.leaderboard)}</span>,
      hide: !isFixtureStarted(vicc5Leaderboard.vicc5Fixture),
      Component: Leaderboards,
    },*///TODO
    {
      path: paths.details,
      to: generatePath(paths.details, {
        competition,
        tab: 'details',
      }),
      label: <span>{formatMessage(messages.details)}</span>,
      Component: Details,
    },
    {
      path: paths.matches,
      to: generatePath(paths.matches, {
        competition,
      }),
      label: <span>{formatMessage(messages.matches)}</span>,
      Component: Matches,
    },
    {
      path: paths.rewards,
      to: generatePath(paths.rewards, {
        competition,
      }),
      label: <span>{formatMessage(fantasy.prizePool)}</span>,
      Component: Rewards,
    },
  ];

  return (
    <Root className={classnames(backgroundScarcity)}>
      <Content>
        <HeaderWrapper>
          <Titles>
            <CompetitionDetailsTimeLeft
              vicc5Fixture={vicc5Leaderboard.vicc5Fixture}
            />
            <Informations>
              <ScarcityAndDate leaderboard={vicc5Leaderboard} />
              <DivisionLogoWrapper>
                <DivisionLogo vicc5Leaderboard={vicc5Leaderboard} />
              </DivisionLogoWrapper>

              <Title>{getLineupDisplayName(lineup, vicc5Leaderboard)}</Title>
            </Informations>
          </Titles>
          <Extras>
            {lineup && (
              <SocialShare
                image={lineup.socialPictureUrls}
                trackingEventName={socialShareEventName.SHARE_LINEUP}
                trackingEventContext={
                  socialShareEventContext.COMPETITION_DETAILS
                }
                renderButton={({ ShareButton, label, Icon }) => (
                  <ShareButton medium>
                    {Icon}
                    <ShareLabel>{label}</ShareLabel>
                  </ShareButton>
                )}
                {...lineupSharingAttributes}
              />
            )}
            {closeButton}
          </Extras>
        </HeaderWrapper>
        <TabsContainer>
          <StyledSecondaryTabs
            items={TabsItems.filter(({ hide }: any) => !hide)}
            noBorder
            badgeColor={lineup?.cancelledAt ? 'var(--c-red-600)' : undefined}
            replace
          />
          {!isFixtureStarted(vicc5Leaderboard.vicc5Fixture) && isTablet && (
            <TeamActionsWrapper>
              <TeamActions
                vicc5Leaderboard={vicc5Leaderboard}
                lineupId={lineup?.id}
              />
            </TeamActionsWrapper>
          )}
        </TabsContainer>
        <RootRoutes>
          {TabsItems.filter(({ hide }: any) => !hide).map(({ path, Component }) => {
            return (
              <Route
                path={path}
                key={path}
                element={
                  <Suspense fallback={<LoadingIndicator />}>
                    <Component />
                  </Suspense>
                }
              />
            );
          })}
        </RootRoutes>
      </Content>
      {!isFixtureStarted(vicc5Leaderboard.vicc5Fixture) && !isTablet && (
        <>
          {bottomNavBarItems && !bgLocation ? (
            <Portal id="above-bottom-bar-portal">
              <TeamActionsWrapper>
                <TeamActions
                  vicc5Leaderboard={vicc5Leaderboard}
                  lineupId={lineup?.id}
                />
              </TeamActionsWrapper>
            </Portal>
          ) : (
            <TeamActionsWrapper>
              <TeamActions
                vicc5Leaderboard={vicc5Leaderboard}
                lineupId={lineup?.id}
              />
            </TeamActionsWrapper>
          )}
        </>
      )}
    </Root>
  );
};

export default CompetitionDetails;
