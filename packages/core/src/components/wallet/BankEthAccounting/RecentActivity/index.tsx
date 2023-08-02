import { TypedDocumentNode, gql } from '@apollo/client';
import { Tab, Tabs } from '@material-ui/core';
import { Fragment, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
  UserAccountEntryEntry,
} from '__generated__/globalTypes';
import { Text16, Title4 } from '@core/atoms/typography';
import { BankWithdrawal } from '@core/components/mySorare/TransactionsHistory/UserAccountEntries/BankWithdrawal';
import { Deposit } from '@core/components/mySorare/TransactionsHistory/UserAccountEntries/Deposit';
import { Withdrawal } from '@core/components/mySorare/TransactionsHistory/UserAccountEntries/Withdrawal';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import EmptyContent from '@core/contexts/intl/EmptyContent';
import { extractConnectionData } from '@core/gql/extractData';
import usePaginatedQuery from '@core/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@core/hooks/useInfiniteScroll';
import { glossary } from '@core/lib/glossary';

import PendingDeposit from './PendingDeposit';
import {
  RecentActivity_userAccountEntry,
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
` as TypedDocumentNode<RecentActivity_userAccountEntry>;

export const WALLET_RECENT_ACTIVITY_QUERY = gql`
  query WalletRecentActivityQuery(
    $cursor: String
    $entryTypes: [UserAccountEntryEntry!]!
    $currencyType: Currency
  ) {
    currentUser {
      slug
      accountEntries(
        first: 20
        after: $cursor
        entryType: $entryTypes
        significant: true
        currencyType: $currencyType
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
` as TypedDocumentNode<
  WalletRecentActivityQuery,
  WalletRecentActivityQueryVariables
>;

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

const currencyTypes = {
  [RecentActivityTab.ALL]: null,
  [RecentActivityTab.FIAT]: Currency.FIAT,
  [RecentActivityTab.ETH]: Currency.ETH,
};

const entryTypes = [
  UserAccountEntryEntry.DEPOSIT,
  UserAccountEntryEntry.WITHDRAWAL,
  UserAccountEntryEntry.WITHDRAWAL_FEE,
];

const getCurrencyFromReferenceCurrency = (
  supportedCurrency: SupportedCurrency
) =>
  supportedCurrency === SupportedCurrency.WEI ? Currency.ETH : Currency.FIAT;

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

  const { data, loading, loadMore } = usePaginatedQuery(
    WALLET_RECENT_ACTIVITY_QUERY,
    {
      notifyOnNetworkStatusChange: true,
      connection: 'UserAccountEntryConnection',
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      variables: {
        entryTypes,
        currencyType: currencyTypes[activeTab],
      },
    }
  );

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
        entryTypes,
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

    // GET CURRENCY FROM ACCOUNT ENTRY MONETARY AMOUNT WHEN AVAILABLE
    const currency = currencyTypes[activeTab];
    return (accountEntries || []).map(accountEntry => {
      return (
        <Fragment key={accountEntry.id}>
          <BankWithdrawal
            expandable={false}
            withIcon
            userAccountEntry={accountEntry}
            primaryCurrency={
              currency ||
              getCurrencyFromReferenceCurrency(
                accountEntry?.amounts.referenceCurrency
              )
            }
          />
          <Deposit
            expandable={false}
            withIcon
            userAccountEntry={accountEntry}
            primaryCurrency={
              currency ||
              getCurrencyFromReferenceCurrency(
                accountEntry?.amounts.referenceCurrency
              )
            }
          />
          <Withdrawal
            expandable={false}
            withIcon
            userAccountEntry={accountEntry}
            primaryCurrency={
              currency ||
              getCurrencyFromReferenceCurrency(
                accountEntry?.amounts.referenceCurrency
              )
            }
          />
        </Fragment>
      );
    });
  }, [accountEntries, activeTab, data, loading]);

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
