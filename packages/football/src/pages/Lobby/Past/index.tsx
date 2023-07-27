import { gql } from '@apollo/client';
import classnames from 'classnames';
import { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import {
  Navigate,
  Route,
  Routes,
  generatePath,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';

import { Vicc5State as So5State } from '@sorare/core/src/__generated__/globalTypes';
import { Container } from '@sorare/core/src/atoms/container';
import { Flag } from '@sorare/core/src/atoms/icons/Flag';
import { Jersey } from '@sorare/core/src/atoms/icons/Jersey';
import LeaderboardIcon from '@sorare/core/src/atoms/icons/Leaderboard';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import {
  FOOTBALL_LOBBY_LIVE,
  FOOTBALL_LOBBY_UPCOMING,
  LOBBY_TABS,
  goToLobby,
} from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

import { RewardsBanner } from '@football/components/rewards/Banner';
import { isFixtureLive, isFixtureOpened } from '@football/lib/so5';
import { Layout } from '@football/pages/Lobby/Components/Layout';
import { LeaderboardPicker } from '@football/pages/Lobby/Components/LeaderboardPicker';
import { MyPlayers } from '@football/pages/Lobby/Components/MyPlayers';
import Teams from '@football/pages/Lobby/Components/Teams';

import {
  LobbyPastQuery,
  LobbyPastQueryVariables,
} from './__generated__/index.graphql';

const tabs = defineMessages({
  myPlayers: {
    id: 'LobbyPast.tab.Players',
    defaultMessage: 'My players',
  },
  myTeams: {
    id: 'LobbyPast.tab.MyTeams',
    defaultMessage: 'My teams',
  },
  trainingTeams: {
    id: 'LobbyPast.tab.TrainingTeams',
    defaultMessage: 'Training teams',
  },
  leaderboard: {
    id: 'LobbyPast.tab.leaderboard',
    defaultMessage: 'Leaderboard',
  },
});

const LOBBY_PAST_QUERY = gql`
  query LobbyPastQuery($slug: String, $type: Vicc5State) {
    so5: vicc5Root {
      so5Fixture: vicc5Fixture(slug: $slug, type: $type) {
        slug
        aasmState
        totalLineups: myVicc5LineupsCount(draft: false)
        mySo5Rewards: myVicc5Rewards {
          slug
          ...RewardsBanner_so5Reward
        }
        ...Lobby_Layout_so5Fixture
        ...Teams_so5Fixture
      }
    }
  }
  ${Layout.fragments.so5Fixture}
  ${RewardsBanner.fragments.so5Reward}
  ${Teams.fragments.so5Fixture}
`;

const StyledRewardsBanner = styled.div`
  &.active {
    margin: 10px 0px 30px 0px;
  }
`;
const SecondaryTabs = styled(StyledSecondaryTabs)`
  margin-bottom: 20px;
`;
const StyledTeams = styled.div`
  margin-bottom: 40px;
`;

export const LobbyPast = () => {
  const { formatMessage } = useIntlContext();
  const bgLocation = useBgLocation();
  const { slug } = useParams();
  const slugAndType = useMemo(
    () => ({
      slug: slug !== 'past' && slug ? slug : null,
      type: slug === 'past' ? So5State.PAST : null,
    }),
    [slug]
  );
  const { data } = useQuery<LobbyPastQuery, LobbyPastQueryVariables>(
    LOBBY_PAST_QUERY,
    {
      variables: slugAndType,
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
    }
  );
  const so5Fixture = data?.so5.so5Fixture || undefined;
  const rewardsLeftToBeClaimed = so5Fixture?.mySo5Rewards.some(
    ({ aasmState }) => aasmState !== 'claimed'
  );

  if (so5Fixture) {
    if (isFixtureLive(so5Fixture)) {
      return (
        <Navigate
          to={generatePath(FOOTBALL_LOBBY_LIVE, { tab: 'my-teams' })}
          replace
        />
      );
    }
    if (isFixtureOpened(so5Fixture)) {
      return (
        <Navigate
          to={generatePath(FOOTBALL_LOBBY_UPCOMING, { tab: '' })}
          replace
        />
      );
    }
  }

  return (
    <Layout so5Fixture={so5Fixture}>
      <Container>
        <div>
          <StyledRewardsBanner
            className={classnames({ active: rewardsLeftToBeClaimed })}
          >
            {so5Fixture?.mySo5Rewards && so5Fixture.mySo5Rewards.length > 0 && (
              <RewardsBanner
                rewards={so5Fixture.mySo5Rewards}
                // necessary to force remount between lobby gameweeks change
                // & reset the rewards banner to its initial state
                key={so5Fixture.slug}
              />
            )}
          </StyledRewardsBanner>
          <SecondaryTabs
            noBorder
            items={[
              {
                to: goToLobby('past', LOBBY_TABS.MY_TEAMS, slug),
                label: formatMessage(tabs.myTeams),
                icon: <Jersey />,
                badge: so5Fixture?.totalLineups,
              },
              {
                to: goToLobby('past', LOBBY_TABS.MY_PLAYERS, slug),
                label: formatMessage(tabs.myPlayers),
                icon: <Flag />,
              },
              { separator: '1' },
              {
                to: goToLobby('past', LOBBY_TABS.LEADERBOARD, slug),
                label: formatMessage(tabs.leaderboard),
                icon: <LeaderboardIcon />,
                isIndex: true,
              },
            ]}
          />
          <StyledTeams>
            <Routes location={bgLocation}>
              <Route
                path={LOBBY_TABS.MY_PLAYERS}
                element={<MyPlayers type={So5State.PAST} />}
              />
              <Route
                path={`${LOBBY_TABS.LEADERBOARD}/*`}
                element={<LeaderboardPicker type={So5State.PAST} />}
              >
                {/** render null as it's only for routing redirection */}
                <Route path=":leaderboardSlug" element={null} />
              </Route>
              <Route
                path={LOBBY_TABS.MY_TEAMS}
                element={
                  <Teams
                    queryVariables={{
                      ...slugAndType,
                      draft: false,
                    }}
                    so5Fixture={so5Fixture}
                  />
                }
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to={goToLobby('past', LOBBY_TABS.MY_TEAMS, slug || 'past')}
                  />
                }
              />
            </Routes>
          </StyledTeams>
        </div>
      </Container>
    </Layout>
  );
};

export default LobbyPast;
