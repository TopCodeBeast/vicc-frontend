import { gql } from '@apollo/client';
import classnames from 'classnames';
import { forwardRef } from 'react';
import styled from 'styled-components';

import Player from '@sorare/football/src/components/MatchView/Player';

import { Formation_game } from './__generated__/index.graphql';

type Formation_game_awayFormation = Formation_game['awayFormation'];
type Formation_game_homeFormation = Formation_game['homeFormation'];

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  padding-top: calc(6 * var(--unit));
  scroll-snap-align: center;
  &.reverse {
    flex-direction: column-reverse;
  }
  &.desktop {
    flex-direction: row;
    &.reverse {
      flex-direction: row-reverse;
    }
  }
`;
const PlayerLine = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  gap: var(--half-unit);
  &.desktop {
    flex-direction: column;
    align-items: center;
  }
`;
const PlayerWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type FormationProps = {
  desktop?: boolean;
  formation: Formation_game_homeFormation | Formation_game_awayFormation;
  onPlayerDetailsClick: (playerSlug: string) => void;
  gameDuration: number;
  reverse?: boolean;
};
const Formation = forwardRef<HTMLDivElement, FormationProps>(function Formation(
  { desktop, formation, onPlayerDetailsClick, gameDuration, reverse },
  ref
) {
  return (
    <Root
      className={classnames({
        desktop,
        reverse,
      })}
      ref={ref}
    >
      {formation.startingLineup.map((formationRow, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <PlayerLine key={i} className={classnames({ desktop })}>
          {formationRow.map(
            player =>
              player.so5Score && (
                <PlayerWrapper key={player.slug}>
                  <button
                    type="button"
                    onClick={() => onPlayerDetailsClick(player.slug)}
                  >
                    <Player
                      key={player.slug}
                      player={player}
                      gameDuration={gameDuration}
                    />
                  </button>
                </PlayerWrapper>
              )
          )}
        </PlayerLine>
      ))}
    </Root>
  );
});

Formation.fragments = {
  game: gql`
    fragment Formation_game on Game {
      id
      minute
      homeFormation {
        startingLineup {
          id
          slug
          ...Player_player
        }
      }
      awayFormation {
        startingLineup {
          id
          slug
          ...Player_player
        }
      }
    }
    ${Player.fragments.player}
  `,
};

export default Formation;
