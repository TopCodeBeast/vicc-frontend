import { gql } from '@apollo/client';
import classnames from 'classnames';
import styled from 'styled-components';

import { isA } from '@core/lib/gql';
import { theme } from '@core/style/theme';

import {
  Avatar_anonymousUser,
  Avatar_ethereumAccount,
  Avatar_publicUserInfoInterface,
  Avatar_starkwareAccount,
  Avatar_user,
} from './__generated__/index.graphql';

export type AvatarDisplayProps = {
  variant?: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
  rounded?: boolean;
  invert?: boolean;
};

type Props = {
  user:
    | Avatar_publicUserInfoInterface
    | Avatar_anonymousUser
    | Avatar_ethereumAccount
    | Avatar_starkwareAccount
    | Avatar_user;
} & AvatarDisplayProps;

const isAnonymous = (
  user:
    | Avatar_publicUserInfoInterface
    | Avatar_anonymousUser
    | Avatar_ethereumAccount
    | Avatar_starkwareAccount
): user is
  | Avatar_anonymousUser
  | Avatar_ethereumAccount
  | Avatar_starkwareAccount => {
  return (
    isA<Avatar_anonymousUser>('AnonymousUser', user) ||
    isA<Avatar_ethereumAccount>('EthereumAccount', user) ||
    isA<Avatar_starkwareAccount>('StarkwareAccount', user)
  );
};

const Root = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: calc(4 * var(--unit));
  object-fit: cover;
  background-color: var(--c-neutral-800);
  border-radius: ${theme.radius.xs}px;
  aspect-ratio: 1;
  color: var(--c-neutral-100);
  font: var(--t-16);
  text-transform: uppercase;
  &.extraSmall {
    width: 14px;
    line-height: 100%;
    font-size: 10px;
  }
  &.small {
    width: calc(3 * var(--unit));
    font-size: var(--t-12);
  }
  &.medium {
    width: calc(5 * var(--unit));
  }
  &.large {
    width: calc(8 * var(--unit));
  }
  &.extraLarge {
    width: calc(10 * var(--unit));
  }
  &.rounded {
    border-radius: ${theme.radius.circle};
  }
  &.invert {
    background-color: var(--c-neutral-300);
    color: var(--c-neutral-600);
  }
`;

export const DisabledAvatar = ({
  rounded,
  invert,
  variant,
}: AvatarDisplayProps) => {
  return <Root className={classnames(variant, { rounded, invert })}>?</Root>;
};

export const PlaceHolderAvatar = ({
  rounded,
  invert,
  variant,
  user,
}: AvatarDisplayProps & { user: { nickname: string } }) => {
  return (
    <Root className={classnames(variant, { rounded, invert })}>
      {user.nickname![0]}
    </Root>
  );
};

export const PictureAvatar = ({
  rounded,
  invert,
  variant,
  user,
  pictureUrl,
}: AvatarDisplayProps & {
  user: { nickname: string };
  pictureUrl: NonNullable<
    Avatar_publicUserInfoInterface['profile']['pictureUrl']
  >;
}) => {
  return (
    <Root
      as="img"
      src={pictureUrl}
      className={classnames(variant, { rounded, invert })}
      alt={user.nickname!}
    />
  );
};

const Avatar = ({ user, ...rest }: Props) => {
  const disabledAvatar = isAnonymous(user) || user.suspended;
  if (disabledAvatar) {
    return <DisabledAvatar {...rest} />;
  }
  const { pictureUrl } = user.profile;
  return pictureUrl ? (
    <PictureAvatar user={user} pictureUrl={pictureUrl} {...rest} />
  ) : (
    <PlaceHolderAvatar user={user} {...rest} />
  );
};

Avatar.fragments = {
  user: gql`
    fragment Avatar_user on User {
      slug
      nickname
      suspended
      profile {
        id
        pictureUrl(derivative: "avatar")
      }
    }
  `,
  publicUserInfoInterface: gql`
    fragment Avatar_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      nickname
      suspended
      profile {
        id
        pictureUrl(derivative: "avatar")
      }
    }
  `,
  anonymousUser: gql`
    fragment Avatar_anonymousUser on AnonymousUser {
      id
    }
  `,
  ethereumAccount: gql`
    fragment Avatar_ethereumAccount on EthereumAccount {
      id
    }
  `,
  starkwareAccount: gql`
    fragment Avatar_starkwareAccount on StarkwareAccount {
      id
    }
  `,
};

export default Avatar;
