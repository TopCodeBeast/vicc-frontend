import { gql } from '@apollo/client';
import { Tab, Tabs } from '@material-ui/core';
import { Fragment, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { UserAccountEntryEntry } from '__generated__/globalTypes';
import { Text16, Title4 } from '@core/atoms/typography';
import { BankWithdrawal } from '@core/components/mySorare/TransactionsHistory/UserAccountEntries/BankWithdrawal';
import { Deposit } from '@core/components/mySorare/TransactionsHistory/UserAccountEntries/Deposit';
import { Withdrawal } from '@core/components/mySorare/TransactionsHistory/UserAccountEntries/Withdrawal';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import EmptyContent from '@core/contexts/intl/EmptyContent';
import { extractConnectionData } from '@core/gql/extractData';
import useCurrentUserPaginatedQuery from '@core/hooks/graphql/useCurrentUserPaginatedQuery';
import useInfiniteScroll from '@core/hooks/useInfiniteScroll';
import { glossary } from '@core/lib/glossary';

import PendingDeposit from './PendingDeposit';
import {
  WalletRecentActivityQuery,
  WalletRecentActivityQueryVariables,
} from './__generated__/index.graphql';

const fragment = gql`
  fragment RecentActivity_userAccountEntry on UserAccountEntry {
    id
    entryType
    date
    aasmState
    provisional
    ...BankWithdrawal_userAccountEntry
    ...Deposit_userAccountEntry
    ...Withdrawal_userAccountEntry
  }
  ${BankWithdrawal.fragments.userAccountEntry}
  ${Deposit.fragments.userAccountEntry}
  ${Withdrawal.fragments.userAccountEntry}
`;

export const WALLET_RECENT_ACTIVITY_QUERY = gql`
  query WalletRecentActivityQuery(
    $cursor: String
    $entryTypes: [UserAccountEntryEntry!]!
  ) {
    currentUser {
      slug
      accountEntries(
        first: 20
        after: $cursor
        entryType: $entryTypes
        significant: true
      ) {
        nodes {
          id
          ...RecentActivity_userAccountEntry
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      pendingDeposits {
        date
        ...PendingDeposit_pendingDeposit
      }
    }
  }
  ${fragment}
  ${PendingDeposit.fragments.pendingDeposit}
`;

const messages = defineMessages({
  title: {
    id: 'bankEthAccounting.recentActivity.title',
    defaultMessage: 'Recent activity',
  },
  empty: {
    id: 'bankEthAccounting.recentActivity.empty',
    defaultMessage: 'No recent activity found',
  },
  pendingDepositsTitle: {
    id: 'bankEthAccounting.recentActivity.pendingDepositsTitle',
    defaultMessage: 'Pending',
  },
  pendingDepositsHelper: {
    id: 'bankEthAccounting.recentActivity.pendingDepositsHelper',
    defaultMessage:
      'Pending transactions are not reflected in your wallet balance.',
  },
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const StyledTabs = styled(Tabs)`
  background-color: var(--c-dialog-background);
`;

const PaddingY = styled.div`
  padding: var(--unit) 0;
`;

enum RecentActivityTab {
  ALL = 'ALL',
  FIAT = 'FIAT',
  ETH = 'ETH',
}

const tabs = [
  {
    value: RecentActivityTab.ALL,
    label: <FormattedMessage {...glossary.all} />,
  },
  {
    value: RecentActivityTab.FIAT,
    label: <FormattedMessage {...glossary.cash} />,
  },
  {
    value: RecentActivityTab.ETH,
    label: <FormattedMessage {...glossary.eth} />,
  },
];

const entryTypes = {
  [RecentActivityTab.ALL]: [
    UserAccountEntryEntry.DEPOSIT,
    UserAccountEntryEntry.WITHDRAWAL,
  ],
  [RecentActivityTab.ETH]: [
    UserAccountEntryEntry.DEPOSIT,
    UserAccountEntryEntry.WITHDRAWAL,
  ],
  [RecentActivityTab.FIAT]: [],
};

const RecentActivity = () => {
  const {
    walletPreferences: { showFiatWallet, showEthWallet },
  } = useCurrentUserContext();
  const showTabs = showFiatWallet && showEthWallet;
  const initActiveTab = useMemo(() => {
    if (showTabs) return RecentActivityTab.ALL;
    if (showEthWallet) return RecentActivityTab.ETH;
    return RecentActivityTab.FIAT;
  }, [showEthWallet, showTabs]);

  const [activeTab, setActiveTab] = useState<RecentActivityTab>(initActiveTab);

  const { data, loading, loadMore } = useCurrentUserPaginatedQuery<
    'UserAccountEntryConnection',
    'accountEntries',
    WalletRecentActivityQuery,
    WalletRecentActivityQueryVariables
  >(WALLET_RECENT_ACTIVITY_QUERY, {
    notifyOnNetworkStatusChange: true,
    connection: 'UserAccountEntryConnection',
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      entryTypes: entryTypes[activeTab],
    },
  });

  const {
    items: accountEntries,
    hasMore,
    cursor,
  } = extractConnectionData(data?.currentUser?.accountEntries, src => src);

  const pendingEthDeposits = data?.currentUser?.pendingDeposits || [];

  const hasPendingEthDeposits =
    pendingEthDeposits && pendingEthDeposits.length > 0;

  const needsToShowPendingEthDeposits =
    hasPendingEthDeposits &&
    [RecentActivityTab.ALL, RecentActivityTab.ETH].includes(activeTab);

  const { InfiniteScrollLoader } = useInfiniteScroll(
    () => {
      loadMore(false, {
        cursor,
        entryTypes: entryTypes[activeTab],
      });
    },
    !!hasMore,
    loading
  );

  const renderEntries = useMemo(() => {
    if ((!loading && !data) || accountEntries?.length === 0)
      return (
        <PaddingY>
          <EmptyContent message={messages.empty} />
        </PaddingY>
      );

    return (accountEntries || []).map(accountEntry => {
      return (
        <Fragment key={accountEntry.id}>
          <BankWithdrawal
            expandable={false}
            withIcon
            userAccountEntry={accountEntry}
            ethFirst={false}
          />
          <Deposit
            expandable={false}
            withIcon
            userAccountEntry={accountEntry}
            ethFirst={false}
          />
          <Withdrawal
            expandable={false}
            withIcon
            userAccountEntry={accountEntry}
            ethFirst={false}
          />
        </Fragment>
      );
    });
  }, [accountEntries, data, loading]);

  return (
    <Root>
      {showTabs && (
        <>
          <Title4>
            <FormattedMessage {...messages.title} />
          </Title4>
          <StyledTabs
            value={activeTab}
            onChange={(_event, val: RecentActivityTab) => {
              setActiveTab(val);
            }}
          >
            {tabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </StyledTabs>
        </>
      )}
      {!showTabs && needsToShowPendingEthDeposits && (
        <div>
          <Title4>
            <FormattedMessage {...messages.pendingDepositsTitle} />
          </Title4>
          <Text16>
            <FormattedMessage {...messages.pendingDepositsHelper} />
          </Text16>
          {pendingEthDeposits.map(pendingDeposit => (
            <PendingDeposit
              key={pendingDeposit.date}
              deposit={pendingDeposit}
            />
          ))}
        </div>
      )}
      <div>
        {!showTabs && (
          <Title4>
            <FormattedMessage {...messages.title} />
          </Title4>
        )}
        {showTabs &&
          needsToShowPendingEthDeposits &&
          pendingEthDeposits.map(pendingDeposit => (
            <PendingDeposit
              key={pendingDeposit.date}
              deposit={pendingDeposit}
            />
          ))}
        {renderEntries}
        <InfiniteScrollLoader />
      </div>
    </Root>
  );
};

export default RecentActivity;
