import { gql } from '@apollo/client';
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
  if (player.so5Scores.length === 0) {
    return null;
  }
  return (
    <Wrapper>
      {player.so5Scores.map((so5Score, index) => (
        <BenchPlayerGameScore
          key={so5Score ? so5Score.id : `dnp-${index}`}
          so5Score={so5Score}
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
        ...BenchPlayerGameScore_so5Score
      }
    }
    ${BenchPlayerGameScore.fragments.so5Score}
  `,
};
