import { gql } from '@apollo/client';
import classnames from 'classnames';
import styled from 'styled-components';

import { CompetitionLogo_competition } from './__generated__/index.graphql';

export interface Props {
  small?: boolean;
  competition: CompetitionLogo_competition;
}

const Root = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 48px;
  height: 48px;
  &.small {
    width: 40px;
    height: 40px;
  }
`;

export const CompetitionLogo = ({ competition, small = false }: Props) => {
  return (
    <Root
      style={{ backgroundImage: `url('${competition.pictureUrl}')` }}
      data-className={classnames({ small })}
    />
  );
};

CompetitionLogo.fragments = {
  competition: gql`
    fragment CompetitionLogo_competition on Competition {
      slug
      pictureUrl
    }
  `,
};

export default CompetitionLogo;
