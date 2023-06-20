import { gql } from '@apollo/client';
import classnames from 'classnames';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import Avatar from 'components/user/Avatar';
import UserName from 'components/user/UserName';
import { LEGACY_USER_GALLERY } from '@sorare/core/src/constants/routes';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import { formatEthereumAddress } from '@sorare/core/src/lib/ethereum';
import { isA } from '@sorare/core/src/lib/gql';

import {
  User_anonymousUser,
  User_blockchainUser,
  User_blockchainUser_User_ as User_blockchainUser_User,
  User_user,
} from './__generated__/index.graphql';

type Props = {
  user: User_user | User_anonymousUser | User_blockchainUser | null;
  disabled?: boolean;
  context?: MessageDescriptor;
  reverse?: boolean;
};

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-neutral-1000);
  overflow: hidden;
  &.disabled {
    color: var(--c-neutral-600);
  }
  &.context {
    flex-direction: row-reverse;
  }
  &.reverse {
    flex-direction: row-reverse;
  }
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
`;

const Wrapper = styled(Text16)`
  overflow: hidden;
  margin-right: var(--unit);
  white-space: nowrap;
  text-overflow: ellipsis;
`;

type SorareUserProps = Props & {
  user: User_user | User_blockchainUser_User;
};

const SorareSuspendedUser = ({
  user,
  disabled,
  reverse,
  context,
}: SorareUserProps) => {
  return (
    <StyledLink as="div" className={classnames({ disabled, reverse })}>
      <UserContainer>
        {context && (
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage {...context} />
          </Caption>
        )}
        <Wrapper>
          <UserName user={user} />
        </Wrapper>
      </UserContainer>
      <Avatar user={user} />
    </StyledLink>
  );
};

const SorareRegularUser = ({
  user,
  disabled,
  reverse,
  context,
}: SorareUserProps) => {
  const { generateSportPath } = useSportContext();
  return (
    <StyledLink
      className={classnames({ disabled, reverse, context })}
      to={generateSportPath(LEGACY_USER_GALLERY, {
        params: { slug: user.slug },
      })}
    >
      <UserContainer>
        {context && (
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage {...context} />
          </Caption>
        )}
        <Wrapper>
          <UserName user={user} />
        </Wrapper>
      </UserContainer>
      <Avatar user={user} />
    </StyledLink>
  );
};

const SorareUser = ({ user, ...rest }: SorareUserProps) => {
  if (user.suspended) {
    return <SorareSuspendedUser user={user} {...rest} />;
  }
  return <SorareRegularUser user={user} {...rest} />;
};

const AnonymousUser = ({
  user,
  disabled,
  reverse,
}: Props & { user: User_anonymousUser }) => {
  return (
    <StyledLink as="div" className={classnames({ disabled, reverse })}>
      <Avatar user={user} />
      <Text16 bold>{formatEthereumAddress(user.ethereumAddress)}</Text16>
    </StyledLink>
  );
};

export const User = ({ user, ...rest }: Props) => {
  if (!user) return null;

  if (isA<User_user | User_blockchainUser_User>('User', user)) {
    return <SorareUser user={user} {...rest} />;
  }

  return <AnonymousUser user={user} {...rest} />;
};

User.fragments = {
  user: gql`
    fragment User_user on User {
      slug
      ...Avatar_publicUserInfoInterface
      ...UserName_publicUserInfoInterface
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${UserName.fragments.user}
  `,
  anonymousUser: gql`
    fragment User_anonymousUser on AnonymousUser {
      id
      ethereumAddress
      ...Avatar_anonymousUser
    }
    ${Avatar.fragments.anonymousUser}
  `,
  blockchainUser: gql`
    fragment User_blockchainUser on BlockchainUser {
      ... on User {
        slug
        nickname
        ...Avatar_publicUserInfoInterface
        ...UserName_publicUserInfoInterface
      }
      ... on AnonymousUser {
        id
        ethereumAddress
        ...Avatar_anonymousUser
      }
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${Avatar.fragments.anonymousUser}
    ${UserName.fragments.user}
  `,
};

export default User;
