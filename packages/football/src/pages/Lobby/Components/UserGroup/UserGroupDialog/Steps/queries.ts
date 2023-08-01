import { gql } from '@apollo/client';

import TournamentInput from '@football/components/userGroup/form/TournamentInput';

export const ELIGIBLE_TOURNAMENTS_USERGROUP_QUERY = gql`
  query eligibleTournamentsForUserGroupQuery {
    so5: vicc5Root {
      eligibleTournamentTypesForSo5UserGroups: eligibleTournamentTypesForVicc5UserGroups {
        id
        ...TournamentInput_tournaments
      }
    }
  }
  ${TournamentInput.fragments.tournaments}
`;
