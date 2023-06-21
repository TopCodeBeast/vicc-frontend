import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { goToLobby } from '@sorare/core/src/constants/routes';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

import LineupActions from '@football/pages/Lobby/Components/LineupActions';

import { TeamActions_lineup } from './__generated__/index.graphql';

interface Props {
  so5Leaderboard: TeamActions_lineup;
  lineupId?: string;
}

const TeamActions = ({ so5Leaderboard, lineupId }: Props) => {
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
      so5Leaderboard={so5Leaderboard}
      lineupId={lineupId}
    />
  );
};

TeamActions.fragments = {
  lineup: gql`
    fragment TeamActions_lineup on So5Leaderboard {
      slug
      ...Lobby_LineupActions_so5Leaderboard
    }
    ${LineupActions.fragments.so5Leaderboard}
  `,
};

export default TeamActions;
