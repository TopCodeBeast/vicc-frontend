import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Title6 } from '@sorare/core/src/atoms/typography';

import PlayerGame from '@football/components/stats/PlayerGame';

import { LastGames_player } from './__generated__/index.graphql';

type Props = {
  player: LastGames_player;
};

const messages = defineMessages({
  title: {
    id: 'LastGames.Title',
    defaultMessage: 'Previous games (detailed)',
  },
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;
const Empty = styled.div`
  width: 100%;
  text-align: center;
  padding: 30px 0px;
`;
const GamesContainer = styled.div`
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 16px;
  overflow: hidden;
`;
const Game = styled.div`
  background-color: var(--c-neutral-200);
`;

const LastGames = ({ player }: Props) => {
  return (
    <Root>
      <Title6 as="h2">
        <FormattedMessage {...messages.title} />
      </Title6>
      {!player.allGameStats.length ? (
        <Empty>
          <FormattedMessage id="LastGames.NoGame" defaultMessage="No game" />
        </Empty>
      ) : (
        <GamesContainer>
          {player.allGameStats.map(
            score =>
              score && (
                <Game key={score.id}>
                  <PlayerGame so5Score={score} game={score.game} />
                </Game>
              )
          )}
        </GamesContainer>
      )}
    </Root>
  );
};

LastGames.fragments = {
  player: gql`
    fragment LastGames_player on Player {
      slug
      allGameStats: so5Scores(last: 5, lowCoverage: true) {
        id
        ...PlayerGame_so5Score
        game {
          id
          ...PlayerGame_game
        }
      }
    }
    ${PlayerGame.fragments.game}
    ${PlayerGame.fragments.so5Score}
  `,
};

export default LastGames;
