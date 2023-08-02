import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import AppearanceDetails from '@football/components/so5/AppearanceDetails';
import ViewAllDetailedScore from '@football/components/stats/ViewAllDetailedScore';

import {
  AppearanceDetailsFull_player,
  AppearanceDetailsFull_so5Score,
} from './__generated__/index.graphql';

type Props = {
  so5Score: AppearanceDetailsFull_so5Score;
  player?: AppearanceDetailsFull_player;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  text-align: center;
  padding: 0 var(--double-unit) var(--unit);
`;

export const AppearanceDetailsFull = ({ so5Score, player }: Props) => {
  return (
    <Root>
      <AppearanceDetails so5Score={so5Score} />
      {so5Score.scoringVersion > 3 && (
        <ViewAllDetailedScore so5Score={so5Score} player={player} />
      )}
    </Root>
  );
};

AppearanceDetailsFull.fragments = {
  so5Score: gql`
    fragment AppearanceDetailsFull_so5Score on So5Score {
      ...ViewAllDetailedScore_so5Score
      ...AppearanceDetails_so5Score
    }
    ${ViewAllDetailedScore.fragments.so5Score}
    ${AppearanceDetails.fragments.so5Score}
  ` as TypedDocumentNode<AppearanceDetailsFull_so5Score>,
  player: gql`
    fragment AppearanceDetailsFull_player on Player {
      slug
      ...ViewAllDetailedScore_player
    }
    ${ViewAllDetailedScore.fragments.player}
  ` as TypedDocumentNode<AppearanceDetailsFull_player>,
};

export default AppearanceDetailsFull;
