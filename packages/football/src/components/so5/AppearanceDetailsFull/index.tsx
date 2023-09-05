import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import AppearanceDetails from '@football/components/so5/AppearanceDetails';
import ViewAllDetailedScore from '@football/components/stats/ViewAllDetailedScore';

import {
  AppearanceDetailsFull_player,
  AppearanceDetailsFull_vicc5Score,
} from './__generated__/index.graphql';

type Props = {
  vicc5Score: AppearanceDetailsFull_vicc5Score;
  player?: AppearanceDetailsFull_player;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  text-align: center;
  padding: 0 var(--double-unit) var(--unit);
`;

export const AppearanceDetailsFull = ({ vicc5Score, player }: Props) => {
  return (
    <Root>
      <AppearanceDetails vicc5Score={vicc5Score} />
      {vicc5Score.scoringVersion > 3 && (
        <ViewAllDetailedScore vicc5Score={vicc5Score} player={player} />
      )}
    </Root>
  );
};

AppearanceDetailsFull.fragments = {
  vicc5Score: gql`
    fragment AppearanceDetailsFull_vicc5Score on Vicc5Score {
      ...ViewAllDetailedScore_vicc5Score
      ...AppearanceDetails_vicc5Score
    }
    ${ViewAllDetailedScore.fragments.vicc5Score}
    ${AppearanceDetails.fragments.vicc5Score}
  ` as TypedDocumentNode<AppearanceDetailsFull_vicc5Score>,
  player: gql`
    fragment AppearanceDetailsFull_player on Player {
      slug
      ...ViewAllDetailedScore_player
    }
    ${ViewAllDetailedScore.fragments.player}
  ` as TypedDocumentNode<AppearanceDetailsFull_player>,
};

export default AppearanceDetailsFull;
