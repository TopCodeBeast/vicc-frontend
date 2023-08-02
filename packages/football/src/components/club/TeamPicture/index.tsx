import { TypedDocumentNode, gql } from '@apollo/client';

import { CLUB_PLACEHOLDER } from '@sorare/core/src/constants/assets';

import { TeamPicture_team } from './__generated__/index.graphql';

interface Props {
  team: TeamPicture_team;
  className?: string;
}

export const TeamPicture = ({ team, className }: Props) => (
  <img
    className={className}
    alt={team.name}
    src={team.pictureUrl!}
    onError={e => {
      (e.target as any).src = CLUB_PLACEHOLDER;
    }}
  />
);

TeamPicture.fragments = {
  team: gql`
    fragment TeamPicture_team on Team {
      ... on TeamInterface {
        slug
        name
        pictureUrl
      }
    }
  ` as TypedDocumentNode<TeamPicture_team>,
};

export default TeamPicture;
