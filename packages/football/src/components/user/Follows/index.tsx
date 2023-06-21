import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import { Text14 } from '@sorare/core/src/atoms/typography';

import useNetworkTabPath from '@football/hooks/useNetworkTabPath';

import { Follows_user } from './__generated__/index.graphql';

interface Props {
  user: Follows_user;
}
const Row = styled.div`
  display: flex;
  gap: var(--double-unit);
`;

const FollowMessage = styled(Text14)`
  color: var(--c-neutral-600);
  margin-left: var(--unit);
`;

const Button = ({
  to,
  children,
  disabled,
  user,
}: {
  to: 'followers' | 'following';
  children: ReactNode;
  disabled: boolean;
  user: { slug: string };
}) => {
  const path = useNetworkTabPath(user);

  return (
    <ButtonBase component={Link} disabled={disabled} to={path(to)}>
      {children}
    </ButtonBase>
  );
};

const Follows = ({ user }: Props) => {
  const { followersCount, followingCount } = user;

  return (
    <Row>
      <Button to="followers" disabled={followersCount === 0} user={user}>
        <Text14 bold color="var(--c-neutral-1000)">
          {followersCount}
        </Text14>
        <FollowMessage>
          <FormattedMessage id="Follows.followers" defaultMessage="Followers" />
        </FollowMessage>
      </Button>
      <Button to="following" disabled={followingCount === 0} user={user}>
        <Text14 bold color="var(--c-neutral-1000)">
          {followingCount}
        </Text14>
        <FollowMessage>
          <FormattedMessage id="Follows.following" defaultMessage="Following" />
        </FollowMessage>
      </Button>
    </Row>
  );
};

Follows.fragments = {
  user: gql`
    fragment Follows_user on PublicUserInfoInterface {
      slug
      followersCount
      followingCount
    }
  `,
};

export default Follows;
