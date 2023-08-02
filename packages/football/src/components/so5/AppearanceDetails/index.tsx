import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import DetailedScore from '@football/components/stats/DetailedScore';
import { Game } from '@football/components/stats/Game';

import { AppearanceDetails_so5Score } from './__generated__/index.graphql';

type Props = {
  so5Score: AppearanceDetails_so5Score;
  withDetails?: boolean;
};

const Root = styled.div`
  display: grid;
  gap: var(--triple-unit);
`;

const StyledGame = styled(Game)`
  padding: 0;
  background: none;
`;

export const AppearanceDetails = ({ so5Score, withDetails }: Props) => {
  const {
    playerGameStats: { game },
  } = so5Score;

  if (!so5Score) return null;

  const hasPlayed =
    (so5Score.detailedScore.find(x => x.stat === 'mins_played')?.statValue ||
      0) > 0;

  return (
    <Root>
      {game && <StyledGame game={game} withMatchView />}
      {so5Score.score !== null && hasPlayed && (
        <DetailedScore so5Score={so5Score} withDetails={withDetails} />
      )}
    </Root>
  );
};

AppearanceDetails.fragments = {
  so5Score: gql`
    fragment AppearanceDetails_so5Score on So5Score {
      id
      playerGameStats {
        id
        game {
          id
          date
          ...So5Game_game
        }
      }
      score
      ...DetailedScore_so5Score
    }
    ${DetailedScore.fragments.so5Score}
    ${Game.fragments.game}
  ` as TypedDocumentNode<AppearanceDetails_so5Score>,
};

export default AppearanceDetails;
