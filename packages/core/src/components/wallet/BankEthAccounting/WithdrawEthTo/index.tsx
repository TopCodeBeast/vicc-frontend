import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField, Tooltip } from '@material-ui/core';
import Big from 'bignumber.js';
import classnames from 'classnames';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import Block from '@core/atoms/layout/Block';
import { Caption, Text16 } from '@core/atoms/typography';
import { AmountWithConversion } from '@core/components/buyActions/AmountWithConversion';
import InputField from '@core/components/form/Form/InputField';
import useInputOnChangeCallback from '@core/components/form/Form/InputField/useInputOnChangeCallback';
import DisabledEmailWarning from '@core/components/user/DisabledEmailWarning';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import Warning from '@core/contexts/intl/Warning';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import useCurrencyConverters from '@core/hooks/useCurrencyConverters';
import useBankWithdrawableAmount from '@core/hooks/users/useBankWithdrawableAmount';
import { isAddress } from '@core/lib/ethereum';
import { glossary } from '@core/lib/glossary';
import { RoundingMode, fromWei, roundCeilFloat } from '@core/lib/wei';

import WithdrawSummary from '../WithdrawSummary';
import Withdrawals from '../Withdrawals';

export const messages = defineMessages({
  disclaimer: {
    id: 'WithdrawEthTo.disclaimer',
    defaultMessage: 'Withdraw {amount}.',
  },
  tooltip: {
    id: 'WithdrawEthTo.tooltip',
    defaultMessage:
      'You can withdraw funds to any valid Ethereum wallet by entering its address.',
  },
  toError: {
    id: 'WithdrawEthTo.toError',
    defaultMessage: 'Invalid address',
  },
  notEnoughFunds: {
    id: 'WithdrawEthTo.notEnoughFunds',
    defaultMessage: 'Not enough funds',
  },
  addressPlaceholder: {
    id: 'WithdrawEthTo.addressPlaceholder',
    defaultMessage:
      'Public address (0x0000000000000000000000000000000000000000)',
  },
});

const BlueAmountWithConversion = styled(AmountWithConversion)`
  color: var(--c-brand-600);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Amount = styled(Block)`
  width: 100%;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  &.error {
    border-color: var(--c-red-600);
  }
`;
const Error = styled(Text16)`
  color: var(--c-red-600);
  margin-top: 10px;
`;
const To = styled(TextField)`
  width: 100%;
  margin-bottom: 10px;
  & .MuiInputBase-root {
    width: 100%;
  }
  & .Mui-error {
    border-color: var(--c-red-600);
  }
  & .MuiFormHelperText-contained {
    margin-right: 0;
    margin-left: 0;
  }
`;
const Label = styled(Text16)`
  margin-right: 10px;
  margin-left: 0;
`;
const Infos = styled.div`
  color: var(--c-neutral-600);
  margin-left: 10px;
`;

export const WithdrawEthTo = () => {
  const { formatMessage } = useIntl();
  const [to, setTo] = useState('');
  const [promptWithdrawSummary, setPromptWithdrawSummary] = useState(false);
  const [formErrors, setFormErrors] = useState({
    to: false,
    amountToWithdraw: false,
  });
  const { currentUser, fiatCurrency, currency } = useCurrentUserContext();
  const { showNotification } = useSnackNotificationContext();
  const bankWithdrawableAmount = useBankWithdrawableAmount();
  const { availableBalance, bankBalance, ethMigration } = currentUser!;
  const { convertFromEth } = useCurrencyConverters();

  const maxEthAmount = fromWei(availableBalance, 4, RoundingMode.ROUND_DOWN);
  const maxFiatAmout = roundCeilFloat(
    convertFromEth(maxEthAmount, fiatCurrency.code),
    2
  );

  const isFastWithdrawal = ethMigration || new Big(bankBalance).eq(0);

  const [amountToWithdraw, setAmountToWithdraw] = useState(() => {
    if (!isFastWithdrawal)
      return fromWei(bankWithdrawableAmount, 4, RoundingMode.ROUND_DOWN);

    return maxEthAmount > 0 ? 0.01 : 0;
  });

  const [fiatAmountToWithdraw, setFiatAmountToWithdraw] = useState<number>(() =>
    roundCeilFloat(convertFromEth(amountToWithdraw, fiatCurrency.code), 2)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormErrors({
        amountToWithdraw:
          maxEthAmount < amountToWithdraw ||
          maxFiatAmout < fiatAmountToWithdraw,
        to: to !== '' && !isAddress(to),
      });
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [to, amountToWithdraw, fiatAmountToWithdraw, maxEthAmount, maxFiatAmout]);

  const localCallback = useCallback(
    (newEthAmount, newFiatAmount) => {
      setFiatAmountToWithdraw(roundCeilFloat(newFiatAmount, 2));
      setAmountToWithdraw(newEthAmount);
    },
    [setFiatAmountToWithdraw, setAmountToWithdraw]
  );

  const onChangeCallback = useInputOnChangeCallback(
    localCallback,
    fiatCurrency.code
  );

  const submitIsDisabled =
    formErrors.amountToWithdraw ||
    formErrors.to ||
    !amountToWithdraw ||
    to === '';

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isAddress(to)) {
      showNotification('invalidAddress', {}, { level: Level.ERROR });
    } else {
      setPromptWithdrawSummary(true);
    }
  };

  if (promptWithdrawSummary) {
    return (
      <WithdrawSummary
        ethAmount={amountToWithdraw}
        address={to}
        onCancel={() => setPromptWithdrawSummary(false)}
        open={promptWithdrawSummary}
      />
    );
  }

  return (
    <div>
      <DisabledEmailWarning />
      <Form onSubmit={onSubmit}>
        {isFastWithdrawal ? (
          <div>
            <Amount
              variant="round"
              border="around"
              className={classnames({
                error: formErrors.amountToWithdraw,
              })}
            >
              <InputField
                onChange={onChangeCallback}
                ethAmount={amountToWithdraw}
                fiatCurrency={fiatCurrency.code}
                fiatAmount={fiatAmountToWithdraw}
                defaultCurrency={currency}
                variant="withdraw"
                placeholder="0"
              />
            </Amount>
            {formErrors.amountToWithdraw && (
              <Error>
                <FormattedMessage {...messages.notEnoughFunds} />
              </Error>
            )}
          </div>
        ) : (
          <Warning
            message={messages.disclaimer}
            values={{
              amount: (
                <BlueAmountWithConversion
                  monetaryAmount={{
                    referenceCurrency: SupportedCurrency.WEI,
                    [SupportedCurrency.WEI.toLowerCase()]:
                      bankWithdrawableAmount,
                  }}
                />
              ),
            }}
            variant="blue"
          />
        )}
        <div>
          <To
            type="string"
            variant="outlined"
            required
            placeholder={formatMessage(messages.addressPlaceholder)}
            value={to}
            error={formErrors.to}
            onChange={event => setTo(event.target.value)}
            helperText={
              formErrors.to ? (
                <Error>
                  <FormattedMessage {...messages.toError} />
                </Error>
              ) : (
                ''
              )
            }
            InputProps={{
              startAdornment: (
                <Label bold>
                  <FormattedMessage id="WithdrawEthTo.to" defaultMessage="To" />
                </Label>
              ),
              endAdornment: (
                <Tooltip
                  arrow
                  interactive
                  placement="top"
                  title={
                    <Caption color="var(--c-static-neutral-1000)">
                      <FormattedMessage {...messages.tooltip} />
                    </Caption>
                  }
                >
                  <Infos>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </Infos>
                </Tooltip>
              ),
            }}
          />
        </div>
        <Button medium color="blue" type="submit" disabled={submitIsDisabled}>
          <FormattedMessage {...glossary.continue} />
        </Button>
      </Form>
      <Withdrawals />
    </div>
  );
};

export default WithdrawEthTo;
