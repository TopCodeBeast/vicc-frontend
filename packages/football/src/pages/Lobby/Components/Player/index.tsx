import { gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { Ball } from '@sorare/core/src/atoms/icons/Ball';
import { Title6 } from '@sorare/core/src/atoms/typography';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import idFromObject from '@sorare/core/src/gql/idFromObject';

import { Game } from '@sorare/football/src/components/stats/Game';
import PlayerGameScoreDialog from '@sorare/football/src/components/stats/PlayerGameScoreDialog';
import PlayerScore from '@sorare/football/src/components/stats/PlayerScore';
import { getPlayerScore } from 'lib/so5';

import { LobbyPlayer_so5Appearance } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
  border-radius: var(--double-unit);
  background: var(--c-neutral-200);
  text-align: left;
  overflow: hidden;
`;
const PlayerInfo = styled.button`
  display: grid;
  padding: var(--double-unit);
  grid-template-columns: 55px 1fr min-content;
  column-gap: var(--unit);
  align-items: center;
  text-align: left;
  grid-template-areas: 'picture info score';
`;
const Info = styled.div`
  grid-area: info;
  display: flex;
  flex-direction: column;
`;
const Picture = styled(CardImg)`
  grid-area: picture;
  max-width: 55px;
  height: 100%;
  aspect-ratio: 32/40;
  object-fit: cover;
  border-radius: var(--unit);
  padding: var(--half-unit) var(--half-unit) 0;
`;
const Chips = styled.div`
  display: flex;
  align-items: center;
  grid-area: chips;
  gap: var(--half-unit);
  align-self: start;
  svg {
    display: block;
    height: 20px;
  }
`;

const Score = styled.div`
  grid-area: score;
`;

const Rect = styled.rect<{ color: string }>`
  fill: ${({ color }) =>
    color === 'red' ? 'var(--c-red-600)' : 'var(--c-yellow-600)'};
`;
export const Player = ({ player }: { player: LobbyPlayer_so5Appearance }) => {
  const [openPlayerGameScore, setOpenPlayerGameScore] = useState<string>('');
  const { card, so5Score } = player;
  const { game } = so5Score || {};
  const { displayName, pictureUrl } = card?.player || {};
  const { score, status } = getPlayerScore(so5Score);
  return (
    <Root>
      <PlayerInfo
        type="button"
        onClick={() => setOpenPlayerGameScore(so5Score?.id || '')}
      >
        <Picture src={pictureUrl ?? undefined} alt="" width={80} />
        <Info>
          <Title6>{displayName}</Title6>
          <Chips>
            {so5Score?.playerGameStats?.goals && (
              <Chip
                size="smaller"
                label={Label => (
                  <Label>
                    <Ball />
                  </Label>
                )}
              />
            )}
            {(so5Score?.playerGameStats?.redCard ||
              so5Score?.playerGameStats?.yellowCard) && (
              <Chip
                size="smaller"
                label={Label => (
                  <Label>
                    <svg width="9" height="12" viewBox="0 0 9 12">
                      <Rect
                        x="0.891479"
                        width="8"
                        height="12"
                        color={
                          so5Score?.playerGameStats?.redCard ? 'red' : 'yellow'
                        }
                      />
                    </svg>
                  </Label>
                )}
              />
            )}
          </Chips>
        </Info>
        <Score>
          <PlayerScore score={score} status={status} />
        </Score>
      </PlayerInfo>
      {game && <Game game={game} withMatchView />}
      <PlayerGameScoreDialog
        so5ScoreId={idFromObject(openPlayerGameScore)!}
        onClose={() => setOpenPlayerGameScore('')}
        open={!!openPlayerGameScore}
      />
    </Root>
  );
};

Player.fragments = {
  so5Appearance: gql`
    fragment LobbyPlayer_so5Appearance on So5Appearance {
      id
      so5Score {
        id
        game {
          id
          ...So5Game_game
          ...So5Game_teamCountry
        }
        playerGameStats {
          id
          goals
          yellowCard
          redCard
        }
        ...getPlayerScore_so5Score
      }
      card {
        slug
        assetId
        player {
          pictureUrl: pictureUrl(derivative: "avatar")
          slug
          displayName
        }
      }
    }
    ${Game.fragments.game}
    ${Game.fragments.teamCountry}
    ${getPlayerScore.fragments.so5Score}
  `,
};
