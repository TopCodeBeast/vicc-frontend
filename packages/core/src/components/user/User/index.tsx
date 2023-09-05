import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Caption, Text16 } from '@core/atoms/typography';
import Avatar from '@core/components/user/Avatar';
import UserName from '@core/components/user/UserName';
import { LEGACY_USER_GALLERY } from '@core/constants/routes';
import { useSportContext } from '@core/contexts/sport';
import { formatEthereumAddress } from '@core/lib/ethereum';
import { isType } from '@core/lib/gql';

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

type ViccUserProps = Props & {
  user: User_user | User_blockchainUser_User;
};

const ViccSuspendedUser = ({
  user,
  disabled,
  reverse,
  context,
}: ViccUserProps) => {
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

const ViccRegularUser = ({
  user,
  disabled,
  reverse,
  context,
}: ViccUserProps) => {
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

const ViccUser = ({ user, ...rest }: ViccUserProps) => {
  if (user.suspended) {
    return <ViccSuspendedUser user={user} {...rest} />;
  }
  return <ViccRegularUser user={user} {...rest} />;
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

  if (isType(user, 'User')) {
    return <ViccUser user={user} {...rest} />;
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
  ` as TypedDocumentNode<User_user>,
  anonymousUser: gql`
    fragment User_anonymousUser on AnonymousUser {
      id
      ethereumAddress
      ...Avatar_anonymousUser
    }
    ${Avatar.fragments.anonymousUser}
  ` as TypedDocumentNode<User_anonymousUser>,
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
  ` as TypedDocumentNode<User_blockchainUser>,
};

export default User;
