import { gql } from '@apollo/client';
import { faStopwatch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Blockchain } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Caption } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { isUserOwner } from '@sorare/core/src/lib/gql';

import TokenWithdrawalDialog from '../TokenWithdrawalDialog';
import { TokenWithdrawal_token } from './__generated__/index.graphql';

type TokenWithdrawal_token_owner_account_owner_User = NonNullable<
  NonNullable<TokenWithdrawal_token['owner']>['account']
>['owner'] & {
  __typename: 'User';
};

const messages = defineMessages({
  transferInProgress: {
    id: 'BlockchainInfo.transferInProgress',
    defaultMessage: 'Transfer in progress',
  },
});

export interface Props {
  token: TokenWithdrawal_token;
}

const TransferInProgress = styled(Button)`
  display: flex;
  gap: 5px;
  &:disabled {
    background-color: rgb(255, 201, 49, 0.25);
    color: #da8302;
    opacity: 1;
  }
`;

const TokenWithdrawal = ({ token }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { formatMessage } = useIntlContext();
  const { pendingWithdrawal, owner } = token;

  const inRollup = false; //owner?.blockchain === Blockchain.STARKWARE;

  const renderTransferInProgress = () => {
    if (!pendingWithdrawal) return null;

    return (
      <div>
        <TransferInProgress compact disabled>
          <FontAwesomeIcon icon={faStopwatch} />
          <span>{formatMessage(messages.transferInProgress)}</span>
        </TransferInProgress>
        <div>
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage
              id="BlockchainInfo.duration"
              defaultMessage="Estimated duration 8-10 hours"
            />
          </Caption>
        </div>
      </div>
    );
  };

  const renderTransfer = () => {
    if (
      pendingWithdrawal ||
      !inRollup ||
      !token.owner ||
      token.owner.optimistic
    )
      return null;
    // if (
    //   !isUserOwner<TokenWithdrawal_token_owner_account_owner_User>(token.owner)
    // )
    //   return null;

    // if (token.owner.account.owner.slug !== currentUser?.slug) return null;

    return (
      <div>
        <TokenWithdrawalDialog token={token} />
      </div>
    );
  };

  return (
    <>
      {renderTransfer()}
      {renderTransferInProgress()}
    </>
  );
};

TokenWithdrawal.fragments = {
  token: gql`
    fragment TokenWithdrawal_token on Token {
      assetId
      slug
      owner {
        id
        blockchain
        account {
          id
          owner {
            ... on User {
              slug
            }
          }
        }
        optimistic
      }
      pendingWithdrawal {
        id
      }
      ...TokenWithdrawalDialog_token
    }
    ${TokenWithdrawalDialog.fragments.token}
  `,
};

export default TokenWithdrawal;
