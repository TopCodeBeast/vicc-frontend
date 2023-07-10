import { gql } from '@apollo/client';
import styled from 'styled-components';

import verifiedBadge from '@core/assets/user/verified_badge.png';

import { Nickname } from '../Nickname';
import { UserName_publicUserInfoInterface } from './__generated__/index.graphql';

const Root = styled.span`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;
const Verified = styled.img`
  width: min(1em, 18px);
  height: min(1em, 18px);
  margin-bottom: var(--half-unit);
`;

type Props = {
  user: UserName_publicUserInfoInterface;
  hideVerified?: boolean;
};

const UserName = ({ user, hideVerified }: Props) => {
  return (
    <Root>
      <Nickname user={user} />
      {!hideVerified && user.profile.verified && (
        <Verified src={verifiedBadge} alt="Verified" />
      )}
    </Root>
  );
};

UserName.fragments = {
  user: gql`
    fragment UserName_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      nickname
      suspended
      profile {
        id
        verified
      }
    }
  `,
};

export default UserName;
