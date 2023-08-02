import Big from 'bignumber.js';
import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
  WithdrawalStatus,
} from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { Caption, Text14 } from '@core/atoms/typography';
import { AmountWithConversion } from '@core/components/buyActions/AmountWithConversion';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { txLink } from '@core/lib/etherscan';
import { glossary } from '@core/lib/glossary';

const messages = defineMessages<WithdrawalStatus>({
  [WithdrawalStatus.CREATED]: {
    id: 'Withdrawal.created',
    defaultMessage: 'pending confirmation',
  },
  [WithdrawalStatus.CONFIRMED]: {
    id: 'Withdrawal.confirmed',
    defaultMessage: 'processing',
  },
  [WithdrawalStatus.SETTLEMENT_PUBLISHED]: {
    id: 'Withdrawal.published',
    defaultMessage: 'processing',
  },
  [WithdrawalStatus.SETTLED]: {
    id: 'Withdrawal.settled',
    defaultMessage: 'settled',
  },
  [WithdrawalStatus.SETTLEMENT_FAILED]: {
    id: 'Withdrawal.failed',
    defaultMessage: 'failed',
  },
  [WithdrawalStatus.CANCELLED]: {
    id: 'Withdrawal.cancelled',
    defaultMessage: 'canceled',
  },
});

export interface Withdrawal {
  id: string;
  amount: string;
  amountInFiat: {
    eur: number;
    usd: number;
    gbp: number;
  };
  to: string;
  transactionHash: string | null;
  status: WithdrawalStatus;
  createdAt: ISO8601DateTime;
  agreedFeeAmount?: string;
}

type FiatCurrencyLowercase = keyof Withdrawal['amountInFiat'];

export interface Props {
  withdrawal: Withdrawal;
  cancel: () => void | Promise<any>;
}
const Item = styled.div`
  display: flex;
  flex-direction: column;
`;
const Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--double-unit);
`;
const ActionLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;
const Link = styled.a`
  color: var(--c-brand-600);
`;
const Status = styled.div`
  padding: 0 var(--unit);
  &.created {
    background-color: rgba(var(--c-rgb-yellow-600), 0.25);
  }
  &.confirmed,
  &.settlement_published,
  &.settled {
    background-color: 'rgba(var(--c-rgb-green-600), 0.25)';
  }
  &.settlement_failed,
  &.cancelled {
    background-color: rgba(var(--c-rgb-red-600), 0.25);
  }
  border-radius: var(--triple-unit);
`;
const zero = new Big(0);

export const WithdrawalItem = ({ withdrawal, cancel }: Props) => {
  const { formatMessage, formatDate } = useIntl();
  const [cancelling, setCancelling] = useState(false);
  const { showNotification } = useSnackNotificationContext();

  const {
    amount,
    amountInFiat,
    to,
    transactionHash,
    status,
    createdAt,
    agreedFeeAmount,
  } = withdrawal;

  const agreedFeeAmountInFiat = Object.keys(amountInFiat)
    .filter(k => k !== '__typename')
    .reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: new Big(amount).gt(zero)
          ? new Big(agreedFeeAmount || 0).multipliedBy(
              new Big(amountInFiat[cur as FiatCurrencyLowercase]).dividedBy(
                amount
              )
            )
          : zero,
      }),
      {}
    );

  const onCancel = async () => {
    setCancelling(true);

    try {
      await cancel();
    } catch (error: any) {
      showNotification(
        'errors',
        { errors: error.message },
        { level: Level.WARN }
      );
    } finally {
      setCancelling(false);
    }
  };

  const renderTo = () => {
    if (!transactionHash) return to;

    return (
      <Link
        target="_blank"
        href={txLink(transactionHash)}
        rel="noopener noreferrer"
      >
        {to}
      </Link>
    );
  };

  const renderDestroy = () => {
    if (status !== WithdrawalStatus.CREATED) return <div />;

    return (
      <Button
        onClick={() => {
          onCancel();
        }}
        disabled={cancelling}
        compact
        color="red"
        stroke
      >
        <FormattedMessage {...glossary.cancel} />
      </Button>
    );
  };

  return (
    <Item>
      <Line>
        <AmountWithConversion
          monetaryAmount={{
            wei: amount,
            ...amountInFiat,
          }}
          usingLegacyFiat
          primaryCurrency={Currency.ETH}
        />
        <Status className={status.toLowerCase()}>
          <Caption>{formatMessage(messages[status])}</Caption>
        </Status>
      </Line>
      {agreedFeeAmount && agreedFeeAmount !== '0' && (
        <Caption as="div">
          <FormattedMessage id="Withdrawal.fees" defaultMessage="Fees" />
          :&nbsp;
          <AmountWithConversion
            monetaryAmount={{
              referenceCurrency: SupportedCurrency.WEI,
              wei: agreedFeeAmount,
              ...agreedFeeAmountInFiat,
            }}
            usingLegacyFiat
            primaryCurrency={Currency.ETH}
          />
        </Caption>
      )}
      <Line>
        <Caption>{renderTo()}</Caption>
      </Line>
      <ActionLine>
        <Text14>{formatDate(createdAt)}</Text14>
        {renderDestroy()}
      </ActionLine>
    </Item>
  );
};

export default WithdrawalItem;
