import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Title6 } from '@sorare/core/src/atoms/typography';

import { Game } from '@sorare/football/src/components/stats/Game';
import GameCoverageBadge from '@sorare/football/src/components/stats/GameCoverageBadge';

import { UpcomingGames_player } from './__generated__/index.graphql';

type Props = {
  player: UpcomingGames_player;
};

const messages = defineMessages({
  title: {
    id: 'UpcomingGames.Title',
    defaultMessage: '3 Next games',
  },
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Empty = styled.div`
  width: 100%;
  text-align: center;
  padding: 30px 0px;
`;
const Games = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 16px;
  overflow: hidden;
`;
const StyledGame = styled(Game)`
  background-color: var(--c-neutral-200);
`;

const UpcomingGames = ({ player }: Props) => {
  return (
    <Root>
      <Title6 as="h2">
        <FormattedMessage {...messages.title} />
      </Title6>
      {!player?.activeClub?.upcomingGames.length ? (
        <Empty>
          <FormattedMessage
            id="UpcomingGames.NoGame"
            defaultMessage="No game"
          />
        </Empty>
      ) : (
        <Games>
          {player.activeClub.upcomingGames.map(
            game =>
              game && (
                <StyledGame
                  key={game.id}
                  game={game}
                  cardScore={
                    <GameCoverageBadge coverageStatus={game.coverageStatus} />
                  }
                />
              )
          )}
        </Games>
      )}
    </Root>
  );
};

UpcomingGames.fragments = {
  player: gql`
    fragment UpcomingGames_player on Player {
      slug
      activeClub {
        slug
        upcomingGames(first: 3) {
          id
          coverageStatus
          ...So5Game_game
          ...So5Game_gameWeek
          ...So5Game_competitionName
        }
      }
    }
    ${Game.fragments.game}
    ${Game.fragments.gameWeek}
    ${Game.fragments.competitionName}
  `,
};

export default UpcomingGames;
