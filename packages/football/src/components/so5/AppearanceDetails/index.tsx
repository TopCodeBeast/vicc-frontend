import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import DetailedScore from '@football/components/stats/DetailedScore';
import { Game } from '@football/components/stats/Game';

import { AppearanceDetails_vicc5Score } from './__generated__/index.graphql';

type Props = {
  vicc5Score: AppearanceDetails_vicc5Score;
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

export const AppearanceDetails = ({ vicc5Score, withDetails }: Props) => {
  const {
    playerGameStats: { game },
  } = vicc5Score;

  if (!vicc5Score) return null;

  const hasPlayed =
    (vicc5Score.detailedScore.find(x => x.stat === 'mins_played')?.statValue ||
      0) > 0;

  return (
    <Root>
      {game && <StyledGame game={game} withMatchView />}
      {vicc5Score.score !== null && hasPlayed && (
        <DetailedScore vicc5Score={vicc5Score} withDetails={withDetails} />
      )}
    </Root>
  );
};

AppearanceDetails.fragments = {
  vicc5Score: gql`
    fragment AppearanceDetails_vicc5Score on Vicc5Score {
      id
      playerGameStats {
        id
        game {
          id
          date
          ...Vicc5Game_game
        }
      }
      score
      ...DetailedScore_vicc5Score
    }
    ${DetailedScore.fragments.vicc5Score}
    ${Game.fragments.game}
  ` as TypedDocumentNode<AppearanceDetails_vicc5Score>,
};

export default AppearanceDetails;
