import { TypedDocumentNode, gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import RelatedPage from '@sorare/core/src/atoms/navigation/RelatedPage';
import { FOOTBALL_CLUB_SHOW } from '@sorare/core/src/constants/routes';

import TeamPicture from '@football/components/club/TeamPicture';

import { RelatedClub_club } from './__generated__/index.graphql';

interface Props {
  club: RelatedClub_club;
  fullWidth?: boolean;
}

const ClubLogo = styled(TeamPicture)`
  max-height: 80px;
  margin-right: 40px;
`;

export const RelatedClub = ({ club, fullWidth }: Props) => {
  return (
    <RelatedPage
      title={club.name}
      subtitle={club.domesticLeague ? club.domesticLeague.displayName : ''}
      link={generatePath(FOOTBALL_CLUB_SHOW, { slug: club.slug })}
      fullWidth={fullWidth}
    >
      <ClubLogo team={club} />
    </RelatedPage>
  );
};

RelatedClub.fragments = {
  club: gql`
    fragment RelatedClub_club on Club {
      slug
      name
      domesticLeague {
        slug
        displayName
      }
      ...TeamPicture_team
    }
    ${TeamPicture.fragments.team}
  ` as TypedDocumentNode<RelatedClub_club>,
};

export default RelatedClub;
