import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowUpRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Currency, UserAccountEntryEntry } from '__generated__/globalTypes';
import { Text14 } from '@core/atoms/typography';

import { AccountEntry } from '../AccountEntry';
import { Withdrawal_userAccountEntry } from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'TransactionsHistoryWithdrawal.title',
    defaultMessage: 'Withdrawal',
  },
  titleFees: {
    id: 'TransactionsHistoryWithdrawal.titleFees',
    defaultMessage: 'Withdrawal fees',
  },
  detail: {
    id: 'TransactionsHistoryWithdrawal.detail',
    defaultMessage: 'Withdrawal to {address}',
  },
});

type Props = {
  userAccountEntry: Withdrawal_userAccountEntry;
  withIcon?: boolean;
  expandable?: boolean;
  primaryCurrency: Currency;
};

type WithdrawalType = {
  __typename: 'Withdrawal' | 'FastWithdrawal';
  to: string;
};

export const isAToWithdrawal = function isAWithdrawal(item: {
  __typename: string;
  to?: string;
}): item is WithdrawalType {
  return (
    ['Withdrawal', 'FastWithdrawal', 'MangopayWithdrawal'].includes(
      item?.__typename
    ) && !!item.to
  );
};

export const WithdrawalIcon = styled(FontAwesomeIcon)`
  width: var(--double-unit);
  height: var(--double-unit);
  border-radius: 50%;
  align-self: center;
  background-color: transparent;
  border: 1px solid var(--c-neutral-1000);
  color: var(--c-neutral-1000);
  padding: var(--unit);
`;

export const Withdrawal = ({
  userAccountEntry,
  withIcon,
  expandable,
  primaryCurrency,
}: Props) => {
  const { tokenOperation } = userAccountEntry;
  const { formatMessage } = useIntl();

  if (!tokenOperation || !isAToWithdrawal(tokenOperation)) return null;

  return (
    <AccountEntry
      expandable={expandable}
      userAccountEntry={userAccountEntry}
      title={
        userAccountEntry.entryType === UserAccountEntryEntry.WITHDRAWAL_FEE
          ? formatMessage(messages.titleFees)
          : formatMessage(messages.title)
      }
      {...(withIcon && { icon: <WithdrawalIcon icon={faArrowUpRight} /> })}
      primaryCurrency={primaryCurrency}
    >
      <Text14>
        <FormattedMessage
          {...messages.detail}
          values={{ address: tokenOperation.to }}
        />
      </Text14>
    </AccountEntry>
  );
};

Withdrawal.fragments = {
  userAccountEntry: gql`
    fragment Withdrawal_userAccountEntry on UserAccountEntry {
      id
      entryType
      tokenOperation {
        ... on Withdrawal {
          id
          to
        }
        ... on FastWithdrawal {
          id
          to
        }
        ... on MangopayWithdrawal {
          id
          to
        }
      }
      ...AccountEntry_userAccountEntry
    }
    ${AccountEntry.fragments.userAccountEntry}
  ` as TypedDocumentNode<Withdrawal_userAccountEntry>,
};
