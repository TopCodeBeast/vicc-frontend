import { gql } from '@apollo/client';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import {
  GalleryLink,
  useCurrentSportGallery,
} from '@sorare/core/src/components/user/GalleryLink';
import { Nickname } from '@sorare/core/src/components/user/Nickname';

import { ItemUser_user } from './__generated__/index.graphql';

export interface Props {
  item: ItemUser_user;
  userPath?: string;
}

const Root = styled(Caption)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const ItemUser = ({ item, userPath }: Props) => {
  const user = item;
  const sportGalleryPathFactory = useCurrentSportGallery();
  return (
    <Root title={user.nickname} color="var(--c-neutral-600)" bold>
      <GalleryLink
        user={user}
        galleryPathFactory={userPath ? () => userPath : sportGalleryPathFactory}
      >
        <Nickname user={user} />
      </GalleryLink>
    </Root>
  );
};

ItemUser.fragments = {
  user: gql`
    fragment ItemUser_user on User {
      slug
      ...GalleryLink_publicUserInfoInterface
      ...Nickname_publicUserInfoInterface
    }
    ${GalleryLink.fragments.user}
    ${Nickname.fragments.user}
  `,
};

export default ItemUser;
