import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { Ball } from '@sorare/core/src/atoms/icons/Ball';
import { Title6 } from '@sorare/core/src/atoms/typography';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import idFromObject from '@sorare/core/src/gql/idFromObject';

import { Game } from '@football/components/stats/Game';
import PlayerGameScoreDialog from '@football/components/stats/PlayerGameScoreDialog';
import PlayerScore from '@football/components/stats/PlayerScore';
import { getPlayerScore } from '@football/lib/so5';

import { LobbyPlayer_vicc5Appearance } from './__generated__/index.graphql';

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
export const Player = ({ player }: { player: LobbyPlayer_vicc5Appearance }) => {
  const [openPlayerGameScore, setOpenPlayerGameScore] = useState<string>('');
  const { card, vicc5Score } = player;
  const { game } = vicc5Score || {};
  const { displayName, pictureUrl } = card?.player || {};
  const { score, status } = getPlayerScore(vicc5Score);
  return (
    <Root>
      <PlayerInfo
        type="button"
        onClick={() => setOpenPlayerGameScore(vicc5Score?.id || '')}
      >
        <Picture src={pictureUrl ?? undefined} alt="" width={80} />
        <Info>
          <Title6>{displayName}</Title6>
          {/* <Chips>
            {vicc5Score?.playerGameStats?.goals && (
              <Chip
                size="smaller"
                label={Label => (
                  <Label>
                    <Ball />
                  </Label>
                )}
              />
            )}
            {(vicc5Score?.playerGameStats?.redCard ||
              vicc5Score?.playerGameStats?.yellowCard) && (
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
                          vicc5Score?.playerGameStats?.redCard ? 'red' : 'yellow'
                        }
                      />
                    </svg>
                  </Label>
                )}
              />
            )}
          </Chips> */}
        </Info>
        <Score>
          <PlayerScore score={score} status={status} />
        </Score>
      </PlayerInfo>
      {game && <Game game={game} withMatchView />}
      <PlayerGameScoreDialog
        vicc5ScoreId={idFromObject(openPlayerGameScore)!}
        onClose={() => setOpenPlayerGameScore('')}
        open={!!openPlayerGameScore}
      />
    </Root>
  );
};

Player.fragments = {
  vicc5Appearance: gql`
    fragment LobbyPlayer_vicc5Appearance on Vicc5Appearance {
      id
      vicc5Score {
        id
        game {
          id
          ...Vicc5Game_game
          ...Vicc5Game_teamCountry
        }
        playerGameStats {
          id
          # goals
          # yellowCard
          # redCard
        }
        ...getPlayerScore_vicc5Score
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
    ${getPlayerScore.fragments.vicc5Score}
  ` as TypedDocumentNode<LobbyPlayer_vicc5Appearance>,
};
