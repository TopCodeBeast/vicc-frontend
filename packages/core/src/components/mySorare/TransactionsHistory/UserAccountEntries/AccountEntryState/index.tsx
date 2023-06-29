import { gql } from '@apollo/client';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import {
  UserAccountEntryState,
  WithdrawalStatus,
} from '__generated__/globalTypes';
import { Caption } from '@core/atoms/typography';
import { isA } from '@core/lib/gql';

import { AccountEntryState_userAccountEntry } from './__generated__/index.graphql';

type TokenOperation = AccountEntryState_userAccountEntry['tokenOperation'];

type FastWithdrawal = TokenOperation & { __typename: 'FastWithdrawal' };

type Withdrawal = TokenOperation & { __typename: 'Withdrawal' };

type Props = {
  userAccountEntry: AccountEntryState_userAccountEntry;
};

const withdrawalStatusMessages = defineMessages({
  [WithdrawalStatus.CREATED]: {
    id: 'AccountEntryStatus.pendingEmailConfirmation',
    defaultMessage: 'Pending email confirmation',
  },
  [WithdrawalStatus.CONFIRMED]: {
    id: 'AccountEntryStatus.confirmed',
    defaultMessage: 'Pending settlement',
  },
  [WithdrawalStatus.SETTLEMENT_PUBLISHED]: {
    id: 'AccountEntryStatus.settlementPublished',
    defaultMessage: 'Pending settlement',
  },
  [WithdrawalStatus.CANCELLED]: {
    id: 'AccountEntryStatus.cancelled',
    defaultMessage: 'Canceled',
  },
  [WithdrawalStatus.SETTLEMENT_FAILED]: {
    id: 'AccountEntryStatus.error',
    defaultMessage: 'Error',
  },
  [WithdrawalStatus.SETTLED]: {
    id: 'AccountEntryStatus.settled',
    defaultMessage: 'Settled',
  },
});

const withdrawalStateMessages = defineMessages({
  [UserAccountEntryState.PENDING]: {
    id: 'AccountEntryState.pending',
    defaultMessage: 'Pending',
  },
  [UserAccountEntryState.CONFIRMED]: {
    id: 'AccountEntryState.confirmed',
    defaultMessage: 'Confirmed',
  },
  [UserAccountEntryState.CANCELLED]: {
    id: 'AccountEntryState.cancelled',
    defaultMessage: 'Canceled',
  },
});

const EntryState = styled.div`
  padding: 0 var(--unit);
  border-radius: var(--quadruple-unit);
  color: var(--c-neutral-600);
  align-self: flex-start;
  &.pending {
    background-color: rgba(var(--c-rgb-yellow-600), 0.25);
  }
  &.cancelled {
    background-color: var(--c-neutral-300);
  }
`;

export const AccountEntryState = ({ userAccountEntry }: Props) => {
  const { aasmState, tokenOperation } = userAccountEntry;

  if (
    ![UserAccountEntryState.PENDING, UserAccountEntryState.CANCELLED].includes(
      userAccountEntry.aasmState
    )
  )
    return null;

  const isWithDrawal =
    isA<Withdrawal>('Withdrawal', tokenOperation) ||
    isA<FastWithdrawal>('FastWithdrawal', tokenOperation);

  let label: MessageDescriptor | null = null;
  if (aasmState === UserAccountEntryState.PENDING && isWithDrawal) {
    label = withdrawalStatusMessages[tokenOperation.status];
  } else {
    label = withdrawalStateMessages[aasmState];
  }

  if (!label) return null;

  return (
    <EntryState className={aasmState.toLowerCase()}>
      <Caption>
        <FormattedMessage {...label} />
      </Caption>
    </EntryState>
  );
};

AccountEntryState.fragments = {
  userAccountEntry: gql`
    fragment AccountEntryState_userAccountEntry on UserAccountEntry {
      id
      aasmState
      tokenOperation {
        ... on FastWithdrawal {
          id
          status
        }
        ... on Withdrawal {
          id
          status
        }
      }
    }
  `,
};

export default AccountEntryState;
