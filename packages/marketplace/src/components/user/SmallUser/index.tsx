import { gql } from '@apollo/client';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Avatar from '@sorare/core/src/components/user/Avatar';
import {
  GalleryLink,
  useCurrentSportGallery,
} from '@sorare/core/src/components/user/GalleryLink';
import UserName from '@sorare/core/src/components/user/UserName';
import { formatEthereumAddress } from '@sorare/core/src/lib/ethereum';
import { isA } from '@sorare/core/src/lib/gql';

import {
  SmallUser_anonymousUser,
  SmallUser_user,
} from './__generated__/index.graphql';

type Props = {
  user: SmallUser_user | SmallUser_anonymousUser;
};

const Root = styled.div`
  display: flex;
  color: var(--c-neutral-1000);
  align-items: center;
  gap: var(--half-unit);
`;
const InfoContainer = styled(Text16)`
  max-width: calc(100% - 44px);
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
`;

const SmallAnonymousUser = ({ user }: { user: SmallUser_anonymousUser }) => {
  return (
    <Root>
      <Avatar user={user} />
      <InfoContainer>
        {formatEthereumAddress(user.ethereumAddress)}
      </InfoContainer>
    </Root>
  );
};

const SmallUserBody = ({ user }: { user: SmallUser_user }) => {
  return (
    <>
      <Avatar user={user} />
      <InfoContainer>
        <UserName user={user} />
      </InfoContainer>
    </>
  );
};

const SuspendedRegularUser = ({ user }: { user: SmallUser_user }) => {
  return (
    <Root as="span">
      <SmallUserBody user={user} />
    </Root>
  );
};

const SmallRegularUser = ({ user }: { user: SmallUser_user }) => {
  const galleryPathFactory = useCurrentSportGallery();
  return (
    // @ts-expect-error Typescript is getting lost with these props and as
    <Root user={user} galleryPathFactory={galleryPathFactory} as={GalleryLink}>
      <SmallUserBody user={user} />
    </Root>
  );
};
const SmallUser = (props: Props) => {
  const { user } = props;
  if (isA<SmallUser_user>('User', user)) {
    if (user.suspended) {
      return <SuspendedRegularUser user={user} />;
    }
    return <SmallRegularUser user={user} />;
  }
  return <SmallAnonymousUser user={user} />;
};

SmallUser.fragments = {
  user: gql`
    fragment SmallUser_user on User {
      slug
      ...Avatar_publicUserInfoInterface
      ...UserName_publicUserInfoInterface
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${UserName.fragments.user}
  `,
  anonymousUser: gql`
    fragment SmallUser_anonymousUser on AnonymousUser {
      ethereumAddress
      id
      ...Avatar_anonymousUser
    }
    ${Avatar.fragments.anonymousUser}
  `,
};

export default SmallUser;
