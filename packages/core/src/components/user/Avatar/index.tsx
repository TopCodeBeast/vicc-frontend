import { gql } from '@apollo/client';
import classnames from 'classnames';
import styled from 'styled-components';

import { isA } from '@core/lib/gql';

import {
  Avatar_anonymousUser,
  Avatar_ethereumAccount,
  Avatar_publicUserInfoInterface,
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
    | Avatar_user;
  placeholderUrl?: string;
} & AvatarDisplayProps;

const isAnonymous = (
  user:
    | Avatar_publicUserInfoInterface
    | Avatar_anonymousUser
    | Avatar_ethereumAccount
): user is
  | Avatar_anonymousUser
  | Avatar_ethereumAccount => {
  return (
    isA<Avatar_anonymousUser>('AnonymousUser', user) ||
    isA<Avatar_ethereumAccount>('EthereumAccount', user)
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
  border-radius: var(--unit);
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
    border-radius: 50%;
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

const Avatar = ({ user, placeholderUrl, variant, ...rest }: Props) => {
  const disabledAvatar = isAnonymous(user) || user.suspended;
  if (disabledAvatar) {
    return <DisabledAvatar {...rest} />;
  }
  const { pictureUrl, fullPictureUrl } = user.profile;

  const url =
    variant === 'large' || variant === 'extraLarge'
      ? fullPictureUrl
      : pictureUrl;

  if (url) {
    return (
      <PictureAvatar user={user} pictureUrl={url} variant={variant} {...rest} />
    );
  }
  if (placeholderUrl) {
    return (
      <PictureAvatar
        user={user}
        pictureUrl={placeholderUrl}
        variant={variant}
        {...rest}
      />
    );
  }
  return <PlaceHolderAvatar user={user} variant={variant} {...rest} />;
};

Avatar.fragments = {
  user: gql`
    fragment Avatar_user on User {
      slug
      nickname
      suspended
      profile {
        id
        fullPictureUrl: pictureUrl
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
        fullPictureUrl: pictureUrl
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
};

export default Avatar;
