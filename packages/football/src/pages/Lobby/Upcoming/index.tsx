import { TypedDocumentNode, gql } from '@apollo/client';
import Helmet from 'react-helmet';
import { defineMessages } from 'react-intl';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import { Flag } from '@sorare/core/src/atoms/icons/Flag';
import { Jersey } from '@sorare/core/src/atoms/icons/Jersey';
import StyledSecondaryTabs from '@sorare/core/src/atoms/navigation/StyledSecondaryTabs';
import { STADIUM_ANIMATION } from '@sorare/core/src/constants/assets';
import { LOBBY_TABS, goToLobby } from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import useDisplayIOSDownloadBanner from '@sorare/core/src/hooks/useDisplayIOSDownloadBanner';

import { Layout } from '@football/pages/Lobby/Components/Layout';
import { LobbyUpcomingTeams } from '@football/pages/Lobby/Upcoming/Teams';
import { LobbyUpcomingTournaments } from '@football/pages/Lobby/Upcoming/Tournaments';

import {
  LineupsCountQuery,
  LineupsCountQueryVariables,
} from './__generated__/index.graphql';

const UpcomingContent = styled.div<{ hide?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding-bottom: var(--quadruple-unit);
  visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};
`;

export const LINEUPS_COUNT_QUERY = gql`
  query LineupsCountQuery {
    #football {
      vicc5Root {
        myUpcomingLineupsPaginated {
          totalCount
        }
      }
    #}
  }
` as TypedDocumentNode<LineupsCountQuery, LineupsCountQueryVariables>;

const PageMenu = defineMessages({
  tournaments: {
    id: 'Lobby.Upcoming.Tournaments',
    defaultMessage: 'Tournaments',
  },
  myTeams: {
    id: 'Lobby.Upcoming.MyTeams',
    defaultMessage: 'My teams',
  },
  trainingTeams: {
    id: 'Lobby.Upcoming.TrainingTeams',
    defaultMessage: 'Training teams',
  },
  userGroupsTooltipSubtitle: {
    id: 'Lobby.Upcoming.UserGroups.Subtitle.Tooltip',
    defaultMessage: 'Play with your friends',
  },
});

export const LobbyUpcoming = () => {
  useDisplayIOSDownloadBanner();
  const bgLocation = useBgLocation(true);
  const { ...restParams } = useParams();
  const tab: any = (restParams['*'] || '').split('/')[0];

  const { data } = useQuery(LINEUPS_COUNT_QUERY, {
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  const { formatMessage } = useIntlContext();
  const { myUpcomingLineupsPaginated } = data?.vicc5 || {};
  const totalLineups = myUpcomingLineupsPaginated?.totalCount || 0;

  if (tab && !Object.values(LOBBY_TABS).includes(tab)) {
    return <Navigate to={goToLobby('upcoming')} replace />;
  }

  return (
    <>
      <Helmet>
        <link rel="preload" as="video" href={STADIUM_ANIMATION} />
      </Helmet>
      <Layout hidePlayers>
        <Container>
          <UpcomingContent>
            <StyledSecondaryTabs
              noBorder
              items={[
                {
                  to: goToLobby('upcoming'),
                  label: formatMessage(PageMenu.tournaments),
                  icon: <Flag />,
                },
                {
                  to: goToLobby('upcoming', LOBBY_TABS.MY_TEAMS),
                  label: formatMessage(PageMenu.myTeams),
                  icon: <Jersey />,
                  isIndex: true,
                  badge: totalLineups,
                },
              ]}
            />
            <Routes location={bgLocation}>
              <Route index element={<LobbyUpcomingTournaments />} />
              <Route path=":tab" element={<LobbyUpcomingTeams />}>
                <Route path=":teamsType" element={null} />
              </Route>
            </Routes>
          </UpcomingContent>
        </Container>
      </Layout>
    </>
  );
};

export default LobbyUpcoming;
