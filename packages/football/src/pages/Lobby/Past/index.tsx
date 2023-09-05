import { TypedDocumentNode, gql } from '@apollo/client';
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

import { Vicc5State } from '@sorare/core/src/__generated__/globalTypes';
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
    football {
      vicc5 {
        vicc5Fixture(slug: $slug, type: $type) {
          slug
          aasmState
          totalLineups: myVicc5LineupsCount(draft: false)
          myVicc5Rewards {
            slug
            ...RewardsBanner_vicc5Reward
          }
          ...Lobby_Layout_vicc5Fixture
          ...Teams_vicc5Fixture
        }
      }
    }
  }
  ${Layout.fragments.vicc5Fixture}
  ${RewardsBanner.fragments.vicc5Reward}
  ${Teams.fragments.vicc5Fixture}
` as TypedDocumentNode<LobbyPastQuery, LobbyPastQueryVariables>;

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
      type: slug === 'past' ? Vicc5State.PAST : null,
    }),
    [slug]
  );
  const { data } = useQuery(LOBBY_PAST_QUERY, {
    variables: slugAndType,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });
  const vicc5Fixture = data?.football.vicc5.vicc5Fixture || undefined;
  const rewardsLeftToBeClaimed = vicc5Fixture?.myVicc5Rewards.some(
    ({ aasmState }) => aasmState !== 'claimed'
  );

  if (vicc5Fixture) {
    if (isFixtureLive(vicc5Fixture)) {
      return (
        <Navigate
          to={generatePath(FOOTBALL_LOBBY_LIVE, { tab: 'my-teams' })}
          replace
        />
      );
    }
    if (isFixtureOpened(vicc5Fixture)) {
      return (
        <Navigate
          to={generatePath(FOOTBALL_LOBBY_UPCOMING, { tab: '' })}
          replace
        />
      );
    }
  }

  return (
    <Layout vicc5Fixture={vicc5Fixture}>
      <Container>
        <div>
          <StyledRewardsBanner
            className={classnames({ active: rewardsLeftToBeClaimed })}
          >
            {vicc5Fixture?.myVicc5Rewards && vicc5Fixture.myVicc5Rewards.length > 0 && (
              <RewardsBanner
                rewards={vicc5Fixture.myVicc5Rewards}
                // necessary to force remount between lobby gameweeks change
                // & reset the rewards banner to its initial state
                key={vicc5Fixture.slug}
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
                badge: vicc5Fixture?.totalLineups,
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
                element={<MyPlayers type={Vicc5State.PAST} />}
              />
              <Route
                path={`${LOBBY_TABS.LEADERBOARD}/*`}
                element={<LeaderboardPicker type={Vicc5State.PAST} />}
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
                    vicc5Fixture={vicc5Fixture}
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
