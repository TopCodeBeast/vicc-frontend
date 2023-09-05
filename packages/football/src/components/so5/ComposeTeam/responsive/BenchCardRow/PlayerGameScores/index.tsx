import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { BenchPlayerGameScore } from '@football/components/so5/ComposeTeam/responsive/BenchCardRow/BenchPlayerGameScore';

import { PlayerGameScores_player } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
  padding-bottom: var(--half-unit);
`;

type Props = {
  player: PlayerGameScores_player;
};

export const PlayerGameScores = ({ player }: Props) => {
  if (player.vicc5Scores.length === 0) {
    return null;
  }
  return (
    <Wrapper>
      {player.vicc5Scores.map((vicc5Score, index) => (
        <BenchPlayerGameScore
          key={vicc5Score ? vicc5Score.id : `dnp-${index}`}
          vicc5Score={vicc5Score}
        />
      ))}
    </Wrapper>
  );
};

PlayerGameScores.fragments = {
  player: gql`
    fragment PlayerGameScores_player on Player {
      slug
      vicc5Scores(last: 5) {
        id
        ...BenchPlayerGameScore_vicc5Score
      }
    }
    ${BenchPlayerGameScore.fragments.vicc5Score}
  ` as TypedDocumentNode<PlayerGameScores_player>,
};
