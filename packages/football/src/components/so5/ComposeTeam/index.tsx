import { gql } from '@apollo/client/core';

import ComposeLineup from './ComposeLineup';
import ContextProvider, { So5ComposeLineupProps } from './ContextProvider';
import {
  ComposeTeamComponent_so5Leaderboard,
  ComposeTeamComponent_so5Lineup,
} from './__generated__/index.graphql';

export interface Props extends So5ComposeLineupProps {
  so5Leaderboard: ComposeTeamComponent_so5Leaderboard;
  so5Lineup: ComposeTeamComponent_so5Lineup;
}

const ComposeTeam = (props: Props) => (
  <ContextProvider {...props}>
    <ComposeLineup />
  </ContextProvider>
);

ComposeTeam.fragments = {
  so5Leaderboard: gql`
    fragment ComposeTeamComponent_so5Leaderboard on Vicc5Leaderboard {
      slug
      id
      ...ContextProvider_so5Leaderboard
      ...ComposeLineup_so5Leaderboard
    }
    ${ContextProvider.fragments.so5Leaderboard}
    ${ComposeLineup.fragments.so5Leaderboard}
  `,
  so5Lineup: gql`
    fragment ComposeTeamComponent_so5Lineup on Vicc5Lineup {
      id
      ...ContextProvider_so5Lineup
      ...ComposeLineup_so5Lineup
    }
    ${ContextProvider.fragments.so5Lineup}
    ${ComposeLineup.fragments.so5Lineup}
  `,
};

export default ComposeTeam;
