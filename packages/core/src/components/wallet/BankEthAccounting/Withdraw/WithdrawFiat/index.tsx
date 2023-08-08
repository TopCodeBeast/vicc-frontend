import { TypedDocumentNode, gql } from '@apollo/client';
import { FormControlLabel } from '@material-ui/core';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Currency, FiatWalletAccount } from '__generated__/globalTypes';
import LoadingButton from '@core/atoms/buttons/LoadingButton';
import Radio from '@core/atoms/inputs/Radio';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text14, Text16 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import InputField from '@core/components/form/Form/InputField';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import Warning from '@core/contexts/intl/Warning';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { isType } from '@core/gql';
import usePaginatedQuery from '@core/hooks/graphql/usePaginatedQuery';
import { glossary } from '@core/lib/glossary';

import { AddBankAccount } from './AddBankAccount';
import { BankAccount } from './BankAccount';
import { ReviewWithdrawFiat } from './ReviewWithdrawFiat';
import { WithdrawFiatSuccess } from './WithdrawFiatSuccess';
import {
  WithdrawalBankAccountsQuery,
  WithdrawalBankAccountsQueryVariables,
} from './__generated__/index.graphql';

const messages = defineMessages({
  withdrawableBalance: {
    id: 'Withdraw.WithdrawFiat.withdrawableBalance',
    defaultMessage: 'Withdrawable balance: <b>{amount}</b>',
  },
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const StyledFormControlLabel = styled(FormControlLabel)`
  gap: var(--double-unit);
  align-items: flex-start;
  margin: 0;
`;
const AmountInput = styled.div`
  width: 100%;
  padding: var(--unit);
  border-radius: var(--unit);
  border: 1px solid var(--c-neutral-400);
`;
const Accounts = styled.div`
  border-radius: var(--unit);
  border: 1px solid var(--c-neutral-400);

  & > *:not(.noPadding) {
    padding: var(--double-unit);
  }

  & > *:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-400);
  }
`;

const StyledButton = styled.button`
  width: 100%;
  display: inline-block;
  padding: var(--double-unit);
  color: var(--c-link);
  text-align: left;
`;

const WITHDRAWAL_BANK_ACCOUNTS_QUERY = gql`
  query WithdrawalBankAccountsQuery($cursor: String) {
    currentUser {
      slug
      accounts {
        id
        accountable {
          ... on FiatWalletAccount {
            id
            withdrawalBankAccounts(first: 20, after: $cursor) {
              nodes {
                ...ReviewWithdrawFiat_bankAccount
                ...BankAccount_bankAccount
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    }
  }
  ${ReviewWithdrawFiat.fragments.bankAccount}
  ${BankAccount.fragments.bankAccount}
` as TypedDocumentNode<
  WithdrawalBankAccountsQuery,
  WithdrawalBankAccountsQueryVariables
>;

export const WithdrawFiat = () => {
  const { currentTab, setCurrentTab } = useWalletDrawerContext();
  const { formatNumber } = useIntlContext();
  const {
    fiatCurrency: { code },
    fiatWalletAccountable,
  } = useCurrentUserContext();

  const { data, loading, loadMore } = usePaginatedQuery(
    WITHDRAWAL_BANK_ACCOUNTS_QUERY,
    {
      skip: !fiatWalletAccountable,
      connection: 'TokenBidConnection',
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
    }
  );

  const fiatAccountable = data?.currentUser?.accounts.find(account =>
    isType(account.accountable, 'FiatWalletAccount')
  )?.accountable as FiatWalletAccount | undefined;

  const bankAccounts =
    fiatAccountable?.withdrawalBankAccounts?.nodes?.filter(Boolean) || [];

  const [amount, setAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedBankAccount, setSelectedBankAccount] = useState(
    bankAccounts[0]
  );

  if (!fiatWalletAccountable) return null;

  if (currentTab === WalletTab.WITHDRAW_TO_FIAT_WALLET_ADD_BANK_ACCOUNT) {
    return <AddBankAccount />;
  }

  if (currentTab === WalletTab.WITHDRAW_TO_FIAT_WALLET_REVIEW) {
    return (
      <ReviewWithdrawFiat
        bankAccount={selectedBankAccount}
        amount={amount}
        setTotalAmount={setTotalAmount}
      />
    );
  }

  if (currentTab === WalletTab.WITHDRAW_TO_FIAT_WALLET_SUCCESS) {
    return <WithdrawFiatSuccess amountToReceive={totalAmount} />;
  }

  return (
    <Root>
      <Warning
        variant="grey"
        message={messages.withdrawableBalance}
        values={{
          b: Bold,
          amount: formatNumber(fiatWalletAccountable.availableBalance / 100, {
            style: 'currency',
            currency: code,
          }),
        }}
      />
      <StyledFormControlLabel
        control={
          <AmountInput>
            <InputField
              ethAmount={0}
              fiatAmount={amount}
              fiatCurrency={code}
              defaultCurrency={Currency.FIAT}
              placeholder="100"
              hideConversion
              onChange={(c, value) => {
                setAmount(value);
              }}
            />
          </AmountInput>
        }
        label={
          <Text16 bold color="var(--c-neutral-1000)">
            <FormattedMessage
              id="Withdraw.WithdrawFiat.amountToWithdraw"
              defaultMessage="Amount to withdraw"
            />
          </Text16>
        }
        labelPlacement="top"
      />
      <Text16 bold>
        <FormattedMessage
          id="Withdraw.WithdrawFiat.selectAccount"
          defaultMessage="Select account"
        />
      </Text16>
      <Accounts>
        {loading ? (
          <LoadingIndicator small />
        ) : (
          <>
            {bankAccounts.map(bankAccount => (
              <Radio
                key={bankAccount.id}
                checked={selectedBankAccount?.id === bankAccount.id.toString()}
                name={bankAccount.id.toString()}
                labelContent={<BankAccount bankAccount={bankAccount} />}
                value={bankAccount.id.toString()}
                onChange={() => {
                  setSelectedBankAccount(bankAccount);
                }}
                reverse
                checkedColor="var(--c-brand-600)"
              />
            ))}
          </>
        )}
        {fiatAccountable?.withdrawalBankAccounts?.pageInfo.hasNextPage && (
          <div className="noPadding">
            <StyledButton
              onClick={() => {
                loadMore(false, {
                  cursor:
                    fiatAccountable?.withdrawalBankAccounts?.pageInfo.endCursor,
                });
              }}
            >
              <Text14 bold color="var(--c-link)">
                <FormattedMessage {...glossary.loadMore} />
              </Text14>
            </StyledButton>
          </div>
        )}
        <div className="noPadding">
          <StyledButton
            onClick={() =>
              setCurrentTab(WalletTab.WITHDRAW_TO_FIAT_WALLET_ADD_BANK_ACCOUNT)
            }
          >
            <Text14 bold color="var(--c-link)">
              <FormattedMessage
                id="Withdraw.WithdrawFiat.addNewBankAccount"
                defaultMessage="Add a new bank account"
              />
            </Text14>
          </StyledButton>
        </div>
      </Accounts>
      <LoadingButton
        fullWidth
        loading={false}
        color="blue"
        disabled={!amount || !selectedBankAccount}
        medium
        onClick={() => {
          setCurrentTab(WalletTab.WITHDRAW_TO_FIAT_WALLET_REVIEW);
        }}
      >
        <FormattedMessage
          id="AddFundsToFiatWallet.reviewWithdraw"
          defaultMessage="Review withdraw"
        />
      </LoadingButton>
    </Root>
  );
};
