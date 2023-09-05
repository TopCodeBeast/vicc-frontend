import { TypedDocumentNode } from '@apollo/client';
import { gql } from '@apollo/client/core';

import ComposeLineup from './ComposeLineup';
import ContextProvider, { Vicc5ComposeLineupProps } from './ContextProvider';
import {
  ComposeTeamComponent_vicc5Leaderboard,
  ComposeTeamComponent_vicc5Lineup,
} from './__generated__/index.graphql';

export interface Props extends Vicc5ComposeLineupProps {
  vicc5Leaderboard: ComposeTeamComponent_vicc5Leaderboard;
  vicc5Lineup: ComposeTeamComponent_vicc5Lineup;
}

const ComposeTeam = (props: Props) => (
  <ContextProvider {...props}>
    <ComposeLineup />
  </ContextProvider>
);

ComposeTeam.fragments = {
  vicc5Leaderboard: gql`
    fragment ComposeTeamComponent_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      id
      ...ContextProvider_vicc5Leaderboard
      ...ComposeLineup_vicc5Leaderboard
    }
    ${ContextProvider.fragments.vicc5Leaderboard}
    ${ComposeLineup.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<ComposeTeamComponent_vicc5Leaderboard>,
  vicc5Lineup: gql`
    fragment ComposeTeamComponent_vicc5Lineup on Vicc5Lineup {
      id
      ...ContextProvider_vicc5Lineup
      ...ComposeLineup_vicc5Lineup
    }
    ${ContextProvider.fragments.vicc5Lineup}
    ${ComposeLineup.fragments.vicc5Lineup}
  ` as TypedDocumentNode<ComposeTeamComponent_vicc5Lineup>,
};

export default ComposeTeam;
