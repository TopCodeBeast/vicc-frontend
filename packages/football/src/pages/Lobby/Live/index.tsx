import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages } from 'react-intl';
import { Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import { Vicc5State } from '@sorare/core/src/__generated__/globalTypes';
import { Container } from '@sorare/core/src/atoms/container';
import { Flag } from '@sorare/core/src/atoms/icons/Flag';
import { Jersey } from '@sorare/core/src/atoms/icons/Jersey';
import LeaderboardIcon from '@sorare/core/src/atoms/icons/Leaderboard';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import { Empty } from '@sorare/core/src/components/cards/Empty';
import { LOBBY_TABS, goToLobby } from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

import { Layout } from '@football/pages/Lobby/Components/Layout';
import { LeaderboardPicker } from '@football/pages/Lobby/Components/LeaderboardPicker';
import { MyPlayers } from '@football/pages/Lobby/Components/MyPlayers';
import Teams from '@football/pages/Lobby/Components/Teams';
import { Games } from '@football/pages/Lobby/Live/Components/Games';

import ComposeTeamReminderBanner from './ComposeTeamReminderBanner';
import {
  LobbyLiveIndexQuery,
  LobbyLiveIndexQueryVariables,
} from './__generated__/index.graphql';

const Loading = styled.div`
  margin: calc(8 * var(--unit)) 0;
`;
const LiveContent = styled.div`
  padding-bottom: var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const TeamsRoutes = styled.div`
  margin-bottom: var(--double-unit);
`;

const LOBBY_LIVE_INDEX_QUERY = gql`
  query LobbyLiveIndexQuery {
    #football {
      vicc5 {
        vicc5Fixture(type: LIVE) {
          slug
          totalLineups: myVicc5LineupsCount(draft: false)
          ...Lobby_Layout_vicc5Fixture
          ...ComposeTeamReminderBanner_vicc5Fixture
          ...Teams_vicc5Fixture
        }
        vicc5FixtureUpcoming: vicc5Fixture(type: UPCOMING) {
          slug
          ...ComposeTeamReminderBanner_vicc5Fixture
        }
      }
    #}
  }
  ${Teams.fragments.vicc5Fixture}
  ${Layout.fragments.vicc5Fixture}
  ${ComposeTeamReminderBanner.fragments.vicc5Fixture}
` as TypedDocumentNode<LobbyLiveIndexQuery, LobbyLiveIndexQueryVariables>;

const messages = defineMessages({
  myPlayers: {
    id: 'LobbyLive.tab.Players',
    defaultMessage: 'My players',
  },
  myTeams: {
    id: 'LobbyLive.tab.MyTeams',
    defaultMessage: 'My teams',
  },
  trainingTeams: {
    id: 'LobbyLive.tab.TrainingTeams',
    defaultMessage: 'Training teams',
  },
  userGroups: {
    id: 'Lobby.Live.UserGroups',
    defaultMessage: 'Private Leagues',
  },
  userGroupsTooltipSubtitle: {
    id: 'Lobby.Live.UserGroups.Subtitle.Tooltip',
    defaultMessage: 'Play with your friends',
  },
  leaderboard: {
    id: 'LobbyLive.tab.leaderboard',
    defaultMessage: 'Leaderboard',
  },
  emptyTitle: {
    id: 'LobbyLive.Empty.title',
    defaultMessage: 'Quiet time',
  },
  emptyDescription: {
    id: 'LobbyLive.Empty.description',
    defaultMessage: 'There is no live game week',
  },
});

export const LobbyLiveIndex = () => {
  const { formatMessage } = useIntlContext();
  const bgLocation = useBgLocation();
  const { data, loading } = useQuery(LOBBY_LIVE_INDEX_QUERY, {
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const vicc5Fixture = data?.vicc5.vicc5Fixture || undefined;

  return (
    <Layout vicc5Fixture={vicc5Fixture}>
      <Container>
        <ComposeTeamReminderBanner
          vicc5Fixture={data?.vicc5.vicc5FixtureUpcoming}
        />
        {!vicc5Fixture && loading && (
          <Loading>
            <LoadingIndicator />
          </Loading>
        )}
        {!vicc5Fixture && !loading && (
          <Empty
            title={formatMessage(messages.emptyTitle)}
            description={formatMessage(messages.emptyDescription)}
          />
        )}
        {vicc5Fixture && (
          <LiveContent>
            <StyledSecondaryTabs
              noBorder
              items={[
                {
                  to: goToLobby('live', LOBBY_TABS.MY_TEAMS),
                  label: formatMessage(messages.myTeams),
                  icon: <Jersey />,
                  badge: vicc5Fixture?.totalLineups,
                },
                {
                  to: goToLobby('live', LOBBY_TABS.MY_PLAYERS),
                  label: formatMessage(messages.myPlayers),
                  icon: <Flag />,
                },
                { separator: '1' },
                {
                  to: goToLobby('live', LOBBY_TABS.LEADERBOARD),
                  label: formatMessage(messages.leaderboard),
                  icon: <LeaderboardIcon />,
                  isIndex: true,
                },
              ]}
            />
            <TeamsRoutes>
              <Routes location={bgLocation}>
                <Route
                  path={LOBBY_TABS.MY_PLAYERS}
                  element={<MyPlayers type={Vicc5State.LIVE} />}
                />
                <Route
                  path={`${LOBBY_TABS.LEADERBOARD}/*`}
                  element={<LeaderboardPicker type={Vicc5State.LIVE} />}
                >
                  {/** render null as it's only for routing redirection */}
                  <Route path=":leaderboardSlug" element={null} />
                </Route>
                <Route
                  path={LOBBY_TABS.MY_TEAMS}
                  element={
                    <Teams
                      queryVariables={{
                        type: Vicc5State.LIVE,
                        slug: null,
                        draft: false,
                      }}
                      vicc5Fixture={vicc5Fixture}
                    />
                  }
                />
                <Route
                  path="*"
                  element={
                    <Navigate to={goToLobby('live', LOBBY_TABS.MY_TEAMS)} />
                  }
                />
              </Routes>
            </TeamsRoutes>
            <Games />
          </LiveContent>
        )}
      </Container>
    </Layout>
  );
};

export default LobbyLiveIndex;
