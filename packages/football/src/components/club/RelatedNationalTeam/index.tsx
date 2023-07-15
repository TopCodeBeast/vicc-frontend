import { gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import RelatedPage from '@sorare/core/src/atoms/navigation/RelatedPage';
import FlagAvatar from '@sorare/core/src/components/country/FlagAvatar';
import { FOOTBALL_COUNTRY_SHOW } from '@sorare/core/src/constants/routes';

import { RelatedNationalTeam_nationalTeam } from './__generated__/index.graphql';

interface Props {
  team: RelatedNationalTeam_nationalTeam;
  fullWidth?: boolean;
}

const Logo = styled.div`
  max-height: 80px;
  margin-right: 40px;
`;

export const RelatedNationalTeam = ({ team, fullWidth }: Props) => {
  return (
    <RelatedPage
      title={team.name}
      subtitle=""
      link={generatePath(FOOTBALL_COUNTRY_SHOW, { slug: team.country.slug })}
      fullWidth={fullWidth}
    >
      <Logo>
        <FlagAvatar country={team.country} />
      </Logo>
    </RelatedPage>
  );
};

RelatedNationalTeam.fragments = {
  nationalTeam: gql`
    fragment RelatedNationalTeam_nationalTeam on NationalTeam {
      slug
      name
      country {
        slug
      }
    }
  `,
};

export default RelatedNationalTeam;
