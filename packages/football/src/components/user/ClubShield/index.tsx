import { gql } from '@apollo/client';
import classnames from 'classnames';
import styled from 'styled-components';

import defaultShield from '@sorare/core/src/assets/club/shield_none.png';

import { ClubShield_userProfile } from './__generated__/index.graphql';

type Size = 'xlarge' | 'large' | 'medium' | 'small';

interface Props {
  userProfile: ClubShield_userProfile;
  size?: Size;
}

const Root = styled.img`
  height: 32px;
  width: 32px;
  &.medium {
    height: 24px;
    width: 24px;
  }
  &.small {
    height: 16px;
    width: 16px;
  }
  &.xlarge {
    height: 96px;
    width: 96px;
  }
`;

export const ClubShield = (props: Props) => {
  const { userProfile, size = 'large' } = props;
  return (
    <Root
      className={classnames(size)}
      src={userProfile.clubShield?.pictureUrl || defaultShield}
      alt={userProfile.clubName}
      onError={e => {
        (e.target as any).src = defaultShield;
      }}
    />
  );
};

ClubShield.fragments = {
  userProfile: gql`
    fragment ClubShield_userProfile on UserProfile {
      id
      clubName
      clubShield {
        id
        pictureUrl
      }
    }
  `,
};

export default ClubShield;
