import classnames from 'classnames';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text14 } from '@core/atoms/typography';
import InputField from '@core/components/form/Form/InputField';
import useInputOnChangeCallback from '@core/components/form/Form/InputField/useInputOnChangeCallback';
import { useBlockchainContext } from '@core/contexts/blockchain';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import FormattedWei from '@core/contexts/intl/FormattedWei';
import Warning from '@core/contexts/intl/Warning';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useBlockchainAccountData from '@core/hooks/useBlockchainAccountData';
import useCurrencyConverters from '@core/hooks/useCurrencyConverters';
import { glossary } from '@core/lib/glossary';
import { Wallet, getWallet } from '@core/lib/web3';
import { RoundingMode, fromWei, roundCeilFloat } from '@core/lib/wei';

export const messages = defineMessages({
  emptyWallet: {
    id: 'DepositEthForm.emptyWallet',
    defaultMessage:
      'Please transfer funds to your external wallet: it is currently empty.',
  },
  signTransaction: {
    id: 'DepositEthForm.signTransaction',
    defaultMessage: 'Please sign the transaction with your wallet.',
  },
});

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  margin-bottom: 0;
`;

const Metamask = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const BalanceEth = styled.span`
  margin-left: var(--unit);
`;

const Block = styled.span`
  padding: var(--triple-unit);
  border: solid 1px var(--c-neutral-300);
  border-radius: var(--triple-unit);
  .dark-theme & {
    border: solid 1px var(--c-neutral-300);
  }

  &.amountIsTooHigh {
    border-color: var(--c-red-600);
  }
`;

const DepositEthForm = () => {
  const { showNotification } = useSnackNotificationContext();
  const [pending, setPending] = useState(false);
  const { currentUser, fiatCurrency, currency } = useCurrentUserContext();
  const { depositEth } = useBlockchainContext();
  const { convertToEth } = useCurrencyConverters();
  const { setCurrentTab } = useWalletDrawerContext();
  const accountData = useBlockchainAccountData();

  const maxEthAmount = accountData?.ethBalance
    ? fromWei(accountData.ethBalance, 4, RoundingMode.ROUND_DOWN)
    : undefined;
  const [fiatAmountToDeposit, setFiatAmountToDeposit] = useState<number>(100);
  const [amountToDeposit, setAmountToDeposit] = useState(
    convertToEth(fiatAmountToDeposit.toString(), fiatCurrency.code)
  );

  const amountIsTooHigh = useMemo(() => {
    if (!maxEthAmount) return false;
    return amountToDeposit > maxEthAmount;
  }, [amountToDeposit, maxEthAmount]);

  const localCallback = useCallback(
    (newEthAmount: any, newFiatAmount: any) => {
      setFiatAmountToDeposit(roundCeilFloat(newFiatAmount, 2));
      setAmountToDeposit(newEthAmount);
    },
    [setAmountToDeposit, setFiatAmountToDeposit]
  );

  const onChangeCallback = useInputOnChangeCallback(
    localCallback,
    fiatCurrency.code
  );

  if (!accountData) return null;
  if (!currentUser) return null;

  const { ethBalance } = accountData;
  const wallet = getWallet(accountData.ethereum.web3.currentProvider);

  if (maxEthAmount === 0) {
    return <Warning variant="grey" message={messages.emptyWallet} />;
  }

  const deposit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);

    const result = await depositEth(amountToDeposit);

    setPending(false);

    if (result?.err) {
      if (result.err.stack)
        showNotification(
          'errors',
          { errors: `${result.err.message}: ${result.err.stack}` },
          { level: Level.WARN }
        );
      else {
        showNotification(
          'errors',
          {
            errors: `${result.err.message}`,
          },
          { level: Level.INFO }
        );
      }
    } else {
      setCurrentTab(WalletTab.HOME);
    }
  };

  return (
    <Form
      onSubmit={event => {
        deposit(event);
      }}
    >
      <Block className={classnames({ amountIsTooHigh })}>
        <InputField
          onChange={onChangeCallback}
          ethAmount={amountToDeposit}
          fiatCurrency={fiatCurrency.code}
          fiatAmount={fiatAmountToDeposit}
          defaultCurrency={currency}
          placeholder="100"
        />
      </Block>
      <Button
        medium
        color="blue"
        type="submit"
        disabled={!amountToDeposit || amountIsTooHigh}
      >
        <FormattedMessage {...glossary.depositAction} />
      </Button>
      {ethBalance && (
        <Metamask>
          <Text14>
            <FormattedMessage
              id="DepositEthForm.ethBalance"
              defaultMessage="External wallet balance"
            />
            {wallet !== Wallet.UNKNOWN && ` (${wallet})`}:
            <BalanceEth>
              <FormattedWei
                value={ethBalance}
                maximumFractionDigits={4}
                context="DepositEthForm"
              />
            </BalanceEth>
          </Text14>
        </Metamask>
      )}
      {pending && (
        <Warning variant="yellow" message={messages.signTransaction} />
      )}
    </Form>
  );
};

export default DepositEthForm;
