import { MatchViewFormationsQuery } from './__generated__/index.graphql';

type MatchViewFormationsQuery_game =
  MatchViewFormationsQuery['game'];

type MatchViewFormationsQuery_game_awayFormation_startingLineup =
  MatchViewFormationsQuery_game['awayFormation']['startingLineup'][number][number];
type MatchViewFormationsQuery_game_homeFormation_startingLineup =
  MatchViewFormationsQuery_game['homeFormation']['startingLineup'][number][number];

export enum SelectedTeam {
  AWAY = '1',
  HOME = '2',
}
export type SelectedPlayer =
  | MatchViewFormationsQuery_game_awayFormation_startingLineup
  | MatchViewFormationsQuery_game_homeFormation_startingLineup;
