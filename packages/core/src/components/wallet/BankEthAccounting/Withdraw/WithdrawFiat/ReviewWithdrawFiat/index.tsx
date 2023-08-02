import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { FiatCurrency, SupportedCurrency } from '__generated__/globalTypes';
import LoadingButton from '@core/atoms/buttons/LoadingButton';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Caption, Text16, Text18 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { fiatAccounts } from '@core/contexts/currentUser/queries';
import { useIntlContext } from '@core/contexts/intl';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { formatGqlErrors } from 'gql';
import idFromObject from '@core/gql/idFromObject';
import useMutation from '@core/hooks/graphql/useMutation';
import useQuery from '@core/hooks/graphql/useQuery';
import { tradeLabels } from '@core/lib/glossary';

import { BankAccount } from '../BankAccount';
import {
  CountryCurrencyQuery,
  CountryCurrencyQueryVariables,
  ReviewWithdrawFiat_bankAccount,
  createFiatWithdrawalMutation,
  createFiatWithdrawalMutationVariables,
} from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--double-unit) 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--c-neutral-400);
  }
`;

const To = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding-top: var(--double-unit);
  border-top: 1px solid var(--c-neutral-400);
`;

const COUNTRY_CURRENCY_QUERY = gql`
  query CountryCurrencyQuery($countryCode: String!) {
    mangopay {
      id
      countryCurrency(countryCode: $countryCode)
    }
  }
` as TypedDocumentNode<CountryCurrencyQuery, CountryCurrencyQueryVariables>;

const CREATE_FIAT_WITHDRAWAL_MUTATION = gql`
  mutation createFiatWithdrawalMutation($input: createFiatWithdrawalInput!) {
    createFiatWithdrawal(input: $input) {
      currentUser {
        slug
        ...CurrentUseProvider_fiatAccounts
      }
      errors {
        code
        message
      }
    }
  }
  ${fiatAccounts}
` as TypedDocumentNode<
  createFiatWithdrawalMutation,
  createFiatWithdrawalMutationVariables
>;

const withdrawalFeesRate = {
  [FiatCurrency.EUR]: 0.05,
  [FiatCurrency.USD]: 0.25,
  [FiatCurrency.GBP]: 0.25,
  INTERNATIONAL: 8,
};

type Props = {
  bankAccount: ReviewWithdrawFiat_bankAccount;
  amount: number;
  setTotalAmount: (value: number) => void;
};

export const ReviewWithdrawFiat = ({
  bankAccount,
  amount,
  setTotalAmount,
}: Props) => {
  const { setCurrentTab } = useWalletDrawerContext();
  const { fiatCurrency, fiatWalletAccountable } = useCurrentUserContext();
  const { formatNumber } = useIntlContext();
  const { showNotification } = useSnackNotificationContext();

  const { data, loading } = useQuery(COUNTRY_CURRENCY_QUERY, {
    variables: { countryCode: bankAccount.country.code },
  });

  const [mutate, { loading: mutationLoading }] = useMutation(
    CREATE_FIAT_WITHDRAWAL_MUTATION
  );

  const withdraw = useCallback(async () => {
    const { errors } = await mutate({
      variables: {
        input: {
          bankAccountId: idFromObject(bankAccount.id),
          amounts: {
            amount: (amount * 100).toString(),
            currency: SupportedCurrency[fiatCurrency.code],
          },
        },
      },
    });

    if (errors.length) {
      showNotification('errors', { errors: formatGqlErrors(errors) });
      return;
    }

    setCurrentTab(WalletTab.WITHDRAW_TO_FIAT_WALLET_SUCCESS);
  }, [
    amount,
    bankAccount.id,
    fiatCurrency.code,
    mutate,
    setCurrentTab,
    showNotification,
  ]);

  const bankAccountCurrency = data?.mangopay.countryCurrency;
  const fiatWalletCurrency = fiatWalletAccountable?.currency;

  const feesAmount =
    bankAccountCurrency && fiatWalletCurrency === bankAccountCurrency
      ? withdrawalFeesRate[fiatWalletCurrency]
      : withdrawalFeesRate.INTERNATIONAL;

  const totalAmount = amount - feesAmount;

  useEffect(() => {
    setTotalAmount(totalAmount);
  }, [setTotalAmount, totalAmount]);

  if (!fiatWalletAccountable?.currency) return null;

  return (
    <Root>
      <Text18 bold>
        <FormattedMessage
          id="Withdraw.WithdrawFiat.ReviewWithdrawFiat.withdrawalSummary"
          defaultMessage="Withdrawal summary"
        />
      </Text18>
      {loading ? (
        <LoadingIndicator small />
      ) : (
        <>
          <div>
            <Row>
              <Text16>
                <FormattedMessage
                  id="Withdraw.WithdrawFiat.ReviewWithdrawFiat.withdrawalAmount"
                  defaultMessage="Withdrawal amount"
                />
              </Text16>
              <Text16>
                {formatNumber(amount, {
                  style: 'currency',
                  currency: fiatCurrency.code,
                })}
              </Text16>
            </Row>
            <Row>
              <Text16>
                <FormattedMessage
                  id="Withdraw.WithdrawFiat.ReviewWithdrawFiat.withdrawalFees"
                  defaultMessage="Withdrawal fees"
                />
              </Text16>
              <Text16>
                {formatNumber(feesAmount * -1, {
                  style: 'currency',
                  currency: fiatCurrency.code,
                })}
              </Text16>
            </Row>
            <Row>
              <Text16
                bold
                color={totalAmount <= 0 ? 'var(--c-red-600)' : undefined}
              >
                <FormattedMessage {...tradeLabels.youReceive} />
              </Text16>
              <Text16
                bold
                color={totalAmount <= 0 ? 'var(--c-red-600)' : undefined}
              >
                {formatNumber(totalAmount, {
                  style: 'currency',
                  currency: fiatCurrency.code,
                })}
              </Text16>
            </Row>
            <Caption color="var(--c-neutral-600)">
              <FormattedMessage
                id="Withdraw.WithdrawFiat.ReviewWithdrawFiat.couldTakeUpTo2Days"
                defaultMessage="It could take up to 2 business days for your withdrawal to complete."
              />
            </Caption>
          </div>
          <To>
            <Text16 bold>
              <FormattedMessage
                id="Withdraw.WithdrawFiat.ReviewWithdrawFiat.withdrawTo"
                defaultMessage="Withdraw to"
              />
            </Text16>
            <BankAccount bankAccount={bankAccount} />
          </To>
          <LoadingButton
            fullWidth
            loading={mutationLoading}
            color="blue"
            medium
            onClick={() => {
              withdraw();
            }}
            disabled={totalAmount <= 0}
          >
            <FormattedMessage
              id="AddFundsToFiatWallet.requestWithdrawal"
              defaultMessage="Request withdrawal"
            />
          </LoadingButton>
        </>
      )}
    </Root>
  );
};

ReviewWithdrawFiat.fragments = {
  bankAccount: gql`
    fragment ReviewWithdrawFiat_bankAccount on BankAccount {
      ... on UsBankAccount {
        id
        country {
          id
          code
        }
      }
      ... on IbanBankAccount {
        id
        country {
          id
          code
        }
      }
      ... on GbBankAccount {
        id
        country {
          id
          code
        }
      }
      ... on CaBankAccount {
        id
        country {
          id
          code
        }
      }
      ... on OtherBankAccount {
        id
        country {
          id
          code
        }
      }
      ...BankAccount_bankAccount
    }
    ${BankAccount.fragments.bankAccount}
  ` as TypedDocumentNode<ReviewWithdrawFiat_bankAccount>,
};
