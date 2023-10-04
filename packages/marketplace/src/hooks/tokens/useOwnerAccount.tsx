import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';

import Avatar from '@sorare/core/src/components/user/Avatar';
import {
  GalleryLink,
  useCurrentSportGallery,
} from '@sorare/core/src/components/user/GalleryLink';
import UserName from '@sorare/core/src/components/user/UserName';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { tokenHolderLink } from '@sorare/core/src/lib/etherscan';
import { isType } from '@sorare/core/src/lib/gql';

import { useOwnerAccount_account } from './__generated__/useOwnerAccount.graphql';

type useOwnerAccount_account_accountable_EthereumAccount =
  useOwnerAccount_account['accountable'] & { __typename: 'EthereumAccount' };

type useOwnerAccount_account_accountable_StarkwareAccount =
  useOwnerAccount_account['accountable'] & {
    __typename: 'StarkwareAccount';
  };

type useOwnerAccount_account_owner_User = useOwnerAccount_account['owner'] & {
  __typename: 'User';
};

type Props = {
  account?: useOwnerAccount_account | null;
};

type ReturnedProps = {
  avatar: ReactNode;
  owner: ReactNode;
} | null;

export const useOwnerAccount = ({ account }: Props): ReturnedProps => {
  const { viccTokensAddress } = useConfigContext();
  const galleryLinkPath = useCurrentSportGallery();

  if (!account) return null;

  if (account.owner && isType(account.owner, 'User')) {
    return {
      avatar: (
        <Avatar user={account.owner as useOwnerAccount_account_owner_User} />
      ),
      owner: (
        <GalleryLink user={account.owner} galleryPathFactory={galleryLinkPath}>
          <strong>
            <UserName user={account.owner} />
          </strong>
        </GalleryLink>
      ),
    };
  }

  if (isType(account.accountable, 'EthereumAccount')) {
    return {
      avatar: (
        <Avatar
          user={
            account.accountable as useOwnerAccount_account_accountable_EthereumAccount
          }
        />
      ),
      owner: (
        <a
          href={tokenHolderLink(
            viccTokensAddress,
            account.accountable.address
          )}
          title={account.accountable.address}
          target="_blank"
          rel="noreferrer"
        >
          {account.accountable.address}
        </a>
      ),
    };
  }

  if (isType(account.accountable, 'StarkwareAccount')) {
    const accountable =
      account.accountable as useOwnerAccount_account_accountable_StarkwareAccount;
    return {
      avatar: <Avatar user={accountable} />,
      owner: accountable.starkKey,
    };
  }

  return null;
};

useOwnerAccount.fragments = {
  account: gql`
    fragment useOwnerAccount_account on Account {
      id
      owner {
        ... on User {
          slug
          ...UserName_publicUserInfoInterface
          ...Avatar_publicUserInfoInterface
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
    ${Avatar.fragments.publicUserInfoInterface}
    ${Avatar.fragments.ethereumAccount}
    ${GalleryLink.fragments.user}
  ` as TypedDocumentNode<useOwnerAccount_account>,
};
