import { TypedDocumentNode, gql } from '@apollo/client';

import TournamentInput from '@football/components/userGroup/form/TournamentInput';

import {
  eligibleTournamentsForPrivateUserGroupQuery,
  eligibleTournamentsForPrivateUserGroupQueryVariables,
} from './__generated__/queries.graphql';

export const ELIGIBLE_TOURNAMENTS_FOR_PRIVATE_USER_GROUP_QUERY = gql`
  query eligibleTournamentsForPrivateUserGroupQuery {
    football {
      vicc5 {
        eligibleTournamentTypesForVicc5UserGroups {
          id
          ...TournamentInput_tournaments
        }
      }
    }
  }
  ${TournamentInput.fragments.tournaments}
` as TypedDocumentNode<
  eligibleTournamentsForPrivateUserGroupQuery,
  eligibleTournamentsForPrivateUserGroupQueryVariables
>;
