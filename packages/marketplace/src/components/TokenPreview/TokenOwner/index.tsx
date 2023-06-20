import { gql } from '@apollo/client';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Avatar from '@sorare/core/src/components/user/Avatar';
import { Avatar_publicUserInfoInterface } from '@sorare/core/src/components/user/Avatar/__generated__/index.graphql';
import { GalleryLink } from '@sorare/core/src/components/user/GalleryLink';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { Nickname_publicUserInfoInterface } from '@sorare/core/src/components/user/Nickname/__generated__/index.graphql';

import { galleryPathFromToken } from 'lib/galleryPathFromToken';

import { TokenOwner_token } from './__generated__/index.graphql';

interface Props {
  token: TokenOwner_token;
  withAvatar?: boolean;
}

// min-width: 0 allow child to have text-overflow: ellipsis;
const StyledGalleryLink = styled(GalleryLink)`
  display: flex;
  gap: var(--unit);
  max-width: 100%;
  align-items: center;
  min-width: 0;
`;

const Name = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font: var(--t-12);
  font-weight: var(--t-bold);
`;

export type OwnerGalleryLink_User = Avatar_publicUserInfoInterface &
  Nickname_publicUserInfoInterface;

interface GalleryProps {
  sport: Sport;
  user: OwnerGalleryLink_User;
  withAvatar: boolean;
}

export const OwnerGalleryLink = ({ sport, user, withAvatar }: GalleryProps) => {
  const path = galleryPathFromToken(user.slug, { sport });
  return (
    <StyledGalleryLink user={user} galleryPathFactory={() => path}>
      {withAvatar && <Avatar rounded user={user} variant="extraSmall" />}
      <Name>
        <Nickname user={user} />
      </Name>
    </StyledGalleryLink>
  );
};

export const TokenOwner = ({ token, withAvatar = false }: Props) => {
  if (token?.owner?.user) {
    return (
      <OwnerGalleryLink
        user={token.owner.user}
        sport={token.sport}
        withAvatar={withAvatar}
      />
    );
  }
  return null;
};

OwnerGalleryLink.fragments = {
  user: gql`
    fragment OwnerGalleryLink_User on User {
      slug
      ...Avatar_publicUserInfoInterface
      ...Nickname_publicUserInfoInterface
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${Nickname.fragments.user}
  `,
};

TokenOwner.fragments = {
  token: gql`
    fragment TokenOwner_token on Token {
      assetId
      slug
      sport
      owner {
        id
        user {
          slug
          ...OwnerGalleryLink_User
        }
      }
    }
    ${OwnerGalleryLink.fragments.user}
  `,
};

export default TokenOwner;
