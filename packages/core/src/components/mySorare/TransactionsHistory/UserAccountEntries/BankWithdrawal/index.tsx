import { gql } from '@apollo/client';
import { faArrowUpRight } from '@fortawesome/pro-solid-svg-icons';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { UserAccountEntryEntry } from '__generated__/globalTypes';
import { Text16 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import { AccountEntry } from '../AccountEntry';
import { WithdrawalIcon, isAToWithdrawal } from '../Withdrawal';
import { BankWithdrawal_userAccountEntry } from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'TransactionsHistoryBankWithdrawal.title',
    defaultMessage: 'Withdraw',
  },
  detail: {
    id: 'TransactionsHistoryBankWithdrawal.detail',
    defaultMessage: 'To {address}',
  },
});

const Content = styled.div`
  & > * + * {
    margin-top: var(--unit);
  }
`;

type Props = {
  userAccountEntry: BankWithdrawal_userAccountEntry;
  withIcon?: boolean;
  expandable?: boolean;
  ethFirst?: boolean;
};

export const BankWithdrawal = ({
  userAccountEntry,
  withIcon = false,
  expandable,
  ethFirst,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { formatMessage } = useIntl();
  const { tokenOperation } = userAccountEntry;

  if (
    userAccountEntry.entryType !== UserAccountEntryEntry.WITHDRAWAL ||
    !currentUser ||
    (tokenOperation && isAToWithdrawal(tokenOperation))
  )
    return null;

  const { bankMappedEthereumAddress } = currentUser;

  return (
    <AccountEntry
      expandable={expandable}
      ethFirst={ethFirst}
      userAccountEntry={userAccountEntry}
      title={formatMessage(messages.title)}
      {...(withIcon && { icon: <WithdrawalIcon icon={faArrowUpRight} /> })}
    >
      <Content>
        <Text16>
          <FormattedMessage
            {...messages.detail}
            values={{ address: bankMappedEthereumAddress }}
          />
        </Text16>
      </Content>
    </AccountEntry>
  );
};

BankWithdrawal.fragments = {
  userAccountEntry: gql`
    fragment BankWithdrawal_userAccountEntry on UserAccountEntry {
      id
      amount
      date
      entryType
      provisional
      tokenOperation {
        ... on Withdrawal {
          id
        }
        ... on FastWithdrawal {
          id
        }
      }
      ...AccountEntry_userAccountEntry
    }
    ${AccountEntry.fragments.userAccountEntry}
  `,
};
