import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import ecusson from '@sorare/core/src/assets/user/ecusson.png';
import { Text16 } from '@sorare/core/src/atoms/typography';
import ActiveUserAvatar from '@sorare/core/src/components/user/ActiveUserAvatar';
import { ActiveUserAvatar_user } from '@sorare/core/src/components/user/ActiveUserAvatar/__generated__/index.graphql';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import Avatar from '@sorare/core/src/components/user/Avatar';
import {
  Avatar_ethereumAccount,
  Avatar_starkwareAccount,
} from '@sorare/core/src/components/user/Avatar/__generated__/index.graphql';
import {
  GalleryLink,
  useCurrentSportGallery,
} from '@sorare/core/src/components/user/GalleryLink';
import UserName from '@sorare/core/src/components/user/UserName';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { tokenHolderLink } from '@sorare/core/src/lib/etherscan';
import { isType } from '@sorare/core/src/lib/gql';

import { OwnerAccount_account } from './__generated__/index.graphql';

type Props = {
  account: OwnerAccount_account | null;
  children?: ReactNode;
};

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const Content = styled.div`
  min-width: 0;
`;
const Owner = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const OwnerAccount = ({ children, account }: Props) => {
  const { viccTokensAddress } = useConfigContext();
  const galleryLinkPath = useCurrentSportGallery();

  if (!account) return null;

  const renderOwnerAccount = (
    user:
      | ActiveUserAvatar_user
      | Avatar_ethereumAccount
      | Avatar_starkwareAccount,
    owner: ReactNode
  ) => {
    return (
      <Root>
        {isType(user, 'User') ? (
          <ActiveUserAvatar
            user={user}
            variant="medium"
            placeholderUrl={ecusson}
          />
        ) : (
          <Avatar user={user} variant="medium" />
        )}
        <Content>
          {children}
          <Owner>{owner}</Owner>
        </Content>
      </Root>
    );
  };

  if (account.owner && isType(account.owner, 'User')) {
    return renderOwnerAccount(
      account.owner,
      <GalleryLink user={account.owner} galleryPathFactory={galleryLinkPath}>
        <Text16>
          <UserName user={account.owner} />
        </Text16>
      </GalleryLink>
    );
  }

  if (isType(account.accountable, 'EthereumAccount')) {
    return renderOwnerAccount(
      account.accountable,
      <a
        href={tokenHolderLink(viccTokensAddress, account.accountable.address)}
        title={account.accountable.address}
        target="_blank"
        rel="noreferrer"
      >
        {account.accountable.address}
      </a>
    );
  }

  /*if (isType(account.accountable, 'StarkwareAccount')) {
    return renderOwnerAccount(
      account.accountable,
      account.accountable.starkKey
    );
  }*/

  return null;
};

OwnerAccount.fragments = {
  account: gql`
    fragment OwnerAccount_account on Account {
      id
      owner {
        ... on User {
          slug
          ...UserName_publicUserInfoInterface
          ...ActiveUserAvatar_user
          ...GalleryLink_publicUserInfoInterface
        }
      }
      accountable {
        ... on EthereumAccount {
          id
          address
          ...Avatar_ethereumAccount
        }
      }
    }
    ${UserName.fragments.user}
    ${ActiveUserAvatar.fragments.user}
    ${Avatar.fragments.ethereumAccount}
    ${GalleryLink.fragments.user}
  ` as TypedDocumentNode<OwnerAccount_account>,
};

export default OwnerAccount;
