import { gql } from '@apollo/client';
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
import { isA } from '@sorare/core/src/lib/gql';

import { OwnerAccount_account } from './__generated__/index.graphql';

type OwnerAccount_account_accountable_EthereumAccount =
  OwnerAccount_account['accountable'] & { __typename: 'EthereumAccount' };

type OwnerAccount_account_accountable_StarkwareAccount =
  OwnerAccount_account['accountable'] & { __typename: 'StarkwareAccount' };

type OwnerAccount_account_owner_User = OwnerAccount_account['owner'] & {
  __typename: 'User';
};

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
  const { sorareTokensAddress } = useConfigContext();
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
        {isA<ActiveUserAvatar_user>('User', user) ? (
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

  if (
    account.owner &&
    isA<OwnerAccount_account_owner_User>('User', account.owner)
  ) {
    return renderOwnerAccount(
      account.owner as OwnerAccount_account_owner_User,
      <GalleryLink user={account.owner} galleryPathFactory={galleryLinkPath}>
        <Text16>
          <UserName user={account.owner} />
        </Text16>
      </GalleryLink>
    );
  }

  if (
    isA<OwnerAccount_account_accountable_EthereumAccount>(
      'EthereumAccount',
      account.accountable
    )
  ) {
    return renderOwnerAccount(
      account.accountable as OwnerAccount_account_accountable_EthereumAccount,
      <a
        href={tokenHolderLink(sorareTokensAddress, account.accountable.address)}
        title={account.accountable.address}
        target="_blank"
        rel="noreferrer"
      >
        {account.accountable.address}
      </a>
    );
  }

  if (
    isA<OwnerAccount_account_accountable_StarkwareAccount>(
      'StarkwareAccount',
      account.accountable
    )
  ) {
    const accountable =
      account.accountable as OwnerAccount_account_accountable_StarkwareAccount;
    return renderOwnerAccount(accountable, accountable.starkKey);
  }

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
        ... on StarkwareAccount {
          id
          starkKey
          ...Avatar_starkwareAccount
        }
      }
    }
    ${UserName.fragments.user}
    ${ActiveUserAvatar.fragments.user}
    ${Avatar.fragments.ethereumAccount}
    ${Avatar.fragments.starkwareAccount}
    ${GalleryLink.fragments.user}
  `,
};

export default OwnerAccount;
