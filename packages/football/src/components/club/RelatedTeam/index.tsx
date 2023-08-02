import { TypedDocumentNode, gql } from '@apollo/client';

import { isType } from '@sorare/core/src/lib/gql';

import RelatedClub from '@football/components/club/RelatedClub';
import RelatedNationalTeam from '@football/components/club/RelatedNationalTeam';

import { RelatedTeam_team } from './__generated__/index.graphql';

type RelatedTeam_team_Club = RelatedTeam_team & { __typename: 'Club' };

type RelatedTeam_team_NationalTeam = RelatedTeam_team & {
  __typename: 'NationalTeam';
};

interface Props {
  team: RelatedTeam_team;
  fullWidth?: boolean;
}

export const RelatedTeam = ({ team, fullWidth }: Props) => {
  if (isType(team, 'Club')) {
    return (
      <RelatedClub club={team as RelatedTeam_team_Club} fullWidth={fullWidth} />
    );
  }

  return (
    <RelatedNationalTeam
      team={team as RelatedTeam_team_NationalTeam}
      fullWidth={fullWidth}
    />
  );
};

RelatedTeam.fragments = {
  team: gql`
    fragment RelatedTeam_team on Team {
      ... on Club {
        slug
        ...RelatedClub_club
      }
      ... on NationalTeam {
        slug
        ...RelatedNationalTeam_nationalTeam
      }
    }
    ${RelatedNationalTeam.fragments.nationalTeam}
    ${RelatedClub.fragments.club}
  ` as TypedDocumentNode<RelatedTeam_team>,
};

export default RelatedTeam;
