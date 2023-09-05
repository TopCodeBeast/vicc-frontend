import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text18 } from '@sorare/core/src/atoms/typography';

import { Game as GameBase } from '@football/components/stats/Game';

import { PlayerUpcomingGames_game } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Game = styled(GameBase)`
  border-radius: var(--double-unit);
`;

type Props = { games: (PlayerUpcomingGames_game | null)[] };
const PlayerUpcomingGames = ({ games }: Props) => {
  if (!games.length) {
    return null;
  }

  return (
    <Root>
      <Text18 bold>
        <FormattedMessage
          id="ComposeTeam.PlayerDetailsDialog.PlayerUpcomingGames.Title"
          defaultMessage="Upcoming games"
        />
      </Text18>
      {games.map(game => game && <Game key={game.id} game={game} />)}
    </Root>
  );
};

PlayerUpcomingGames.fragments = {
  game: gql`
    fragment PlayerUpcomingGames_game on Game {
      id
      ...Vicc5Game_game
    }
    ${Game.fragments.game}
  ` as TypedDocumentNode<PlayerUpcomingGames_game>,
};

export default PlayerUpcomingGames;
