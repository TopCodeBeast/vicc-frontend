import { gql, useSubscription } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Drawer } from '@sorare/core/src/atoms/layout/Drawer';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { useFootballEvents } from '@football/lib/events';

import FootballField from './FootballField';
import Overview from './Overview';
import PlayerDetails from './PlayerDetails';
import {
  MatchViewFormationsQuery,
  MatchViewFormationsQueryVariables,
} from './__generated__/index.graphql';
import { SelectedTeam } from './types';

const Root = styled.div`
  max-height: calc(100% - 48px);
  display: flex;
  gap: var(--double-unit);
`;
const PlayerDetailsContainer = styled.div`
  overflow: auto;
`;
const LoaderContainer = styled.div`
  padding: var(--quadruple-unit) 0;
`;
const MatchViewContainer = styled.div`
  max-width: 100%;
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--c-neutral-300);
  border-radius: var(--double-unit);
`;

const subscription = gql`
  subscription onMatchViewDataUpdated($id: ID!) {
    aGameWasUpdated(id: $id) {
      id
      ...Overview_game
      ...FootballField_game
    }
  }
  ${Overview.fragments.game}
  ${FootballField.fragments.game}
`;

const MATCH_VIEW_FORMATIONS_QUERY = gql`
  query MatchViewFormationsQuery($id: ID!) {
    football {
      game(id: $id) {
        id
        ...Overview_game
        ...FootballField_game
      }
    }
  }
  ${Overview.fragments.game}
  ${FootballField.fragments.game}
`;

type Props = {
  id: string;
  desktop?: boolean;
};
const MatchView = ({ id, desktop }: Props) => {
  useSubscription(subscription, { variables: { id: idFromObject(id) } });
  const track = useFootballEvents();
  const { up: isDesktop } = useScreenSize('desktop');
  const [selectedTeam, setSelectedTeam] = useState(SelectedTeam.HOME);
  const matchViewRef = useRef<HTMLDivElement>(null);
  const [selectedPlayerSlug, setSelectedPlayerSlug] = useState<
    string | undefined
  >(undefined);
  const [isPlayerDetailsOpen, setIsPlayerDetailsOpen] =
    useState<boolean>(false);
  const gameId = idFromObject(id);
  const { data: formationData, loading: formationLoading } = useQuery<
    MatchViewFormationsQuery,
    MatchViewFormationsQueryVariables
  >(MATCH_VIEW_FORMATIONS_QUERY, {
    variables: {
      id: gameId!,
    },
    skip: !gameId,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (formationData) {
      track('Open Match View', {
        gameId,
        gameStatus: formationData.football.game.status,
        deviceType: `web_${desktop ? 'desktop' : 'mobile'}`,
      });
    }
  }, [desktop, formationData, gameId, track]);

  if (formationLoading || !formationData) {
    return (
      <LoaderContainer>
        <LoadingIndicator small />
      </LoaderContainer>
    );
  }
  const { game } = formationData.football;

  const onPlayerDetailsClick = (playerSlug?: string) => {
    if (isPlayerDetailsOpen && selectedPlayerSlug === playerSlug) {
      setIsPlayerDetailsOpen(false);
    } else {
      setSelectedPlayerSlug(playerSlug);
      setIsPlayerDetailsOpen(true);
      if (playerSlug) {
        track('Open Match View Player Details', {
          playerSlug,
        });
      }
    }
  };

  const onPlayerDetailsClose = () => setIsPlayerDetailsOpen(false);

  return (
    <Root>
      {isDesktop && isPlayerDetailsOpen ? (
        <PlayerDetailsContainer
          style={{
            height: matchViewRef.current?.getBoundingClientRect().height,
          }}
        >
          <PlayerDetails
            slug={selectedPlayerSlug}
            gameId={gameId}
            onClose={onPlayerDetailsClose}
          />
        </PlayerDetailsContainer>
      ) : (
        <Drawer open={isPlayerDetailsOpen} side="bottom">
          <PlayerDetails
            slug={selectedPlayerSlug}
            gameId={gameId}
            onClose={onPlayerDetailsClose}
          />
        </Drawer>
      )}
      <MatchViewContainer ref={matchViewRef}>
        <Overview game={game} selectedTeam={selectedTeam} desktop={desktop} />
        <FootballField
          game={game}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          onPlayerDetailsClick={onPlayerDetailsClick}
          desktop={desktop}
        />
      </MatchViewContainer>
    </Root>
  );
};

export default MatchView;
