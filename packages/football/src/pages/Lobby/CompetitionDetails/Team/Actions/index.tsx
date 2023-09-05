import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { goToLobby } from '@sorare/core/src/constants/routes';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

import LineupActions from '@football/pages/Lobby/Components/LineupActions';

import { TeamActions_lineup } from './__generated__/index.graphql';

interface Props {
  vicc5Leaderboard: TeamActions_lineup;
  lineupId?: string;
}

const TeamActions = ({ vicc5Leaderboard, lineupId }: Props) => {
  const navigate = useNavigate();
  const bgLocation = useBgLocation();
  const closePage = useCallback(
    (id: string) =>
      navigate(
        bgLocation?.pathname ? bgLocation?.pathname : goToLobby('upcoming'),
        { state: { shouldRefetch: id } }
      ),
    [bgLocation?.pathname, navigate]
  );

  return (
    <LineupActions
      onDelete={closePage}
      vicc5Leaderboard={vicc5Leaderboard}
      lineupId={lineupId}
    />
  );
};

TeamActions.fragments = {
  lineup: gql`
    fragment TeamActions_lineup on Vicc5Leaderboard {
      slug
      ...Lobby_LineupActions_vicc5Leaderboard
    }
    ${LineupActions.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<TeamActions_lineup>,
};

export default TeamActions;
