import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Big from 'bignumber.js';
import {
  FormEvent,
  ReactChild,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  FormattedNumber,
  defineMessages,
  useIntl,
} from 'react-intl';
import styled, { css } from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import Checkbox from '@core/atoms/inputs/Checkbox';
import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Caption, Text16 } from '@core/atoms/typography';
import Row from '@core/components/Transaction/Row';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useToggle from '@core/hooks/useToggle';
import useBankWithdrawableAmount from '@core/hooks/users/useBankWithdrawableAmount';
import useFastWithdrawal from '@core/hooks/withdrawals/useFastWithdrawal';
import useWithdraw from '@core/hooks/withdrawals/useWithdraw';

import WithdrawCancelDialog from '../WithdrawCancelDialog';

const Value = styled(Text16).attrs({ as: 'span' })<{ isLoading: boolean }>`
  ${({ isLoading }) =>
    isLoading
      ? css`
          color: var(--c-neutral-400);
          background-color: var(--c-neutral-400);
        `
      : null}
`;

const BoldValue = styled(Value)`
  font-weight: 700;
`;

type FeesProps = {
  title: ReactNode;
  tooltipTitle: ReactChild;
  value: number;
  currency: string;
  isLoading: boolean;
};

const CreditCardFees = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const InfoCircle = styled(FontAwesomeIcon)`
  opacity: 0.5;
`;

const FeesRow = ({
  title,
  tooltipTitle,
  value,
  currency,
  isLoading,
}: FeesProps) => {
  return (
    <Row
      inline
      title={
        <CreditCardFees>
          {title}
          <Tooltip interactive placement="top" title={tooltipTitle}>
            <div>
              <InfoCircle icon={faInfoCircle} />
            </div>
          </Tooltip>
        </CreditCardFees>
      }
    >
      <Value isLoading={isLoading}>
        <FormattedNumber
          value={value}
          style="currency"
          currency={currency}
          maximumFractionDigits={0}
        />
      </Value>
    </Row>
  );
};

export enum Fees {
  Free = 'free',
  Base = 'base',
  Trustless = 'trustless',
}

type Props = {
  open: boolean;
  ethAmount: number;
  address: string;
  fees?: Fees;
  onCancel: () => void;
};

const messages = defineMessages({
  title: {
    id: 'WithdrawSummary.title',
    defaultMessage: 'Withdrawal summary',
  },
  amountLabel: {
    id: 'WithdrawSummary.amountLabel',
    defaultMessage: 'You are sending',
  },
  eth: {
    id: 'WithdrawSummary.eth',
    defaultMessage: 'ETH',
  },
  to: {
    id: 'WithdrawSummary.to',
    defaultMessage: 'To',
  },
  gasFees: {
    id: 'WithdrawSummary.gasFees',
    defaultMessage: 'Gas fees',
  },
  trustlessFees: {
    id: 'WithdrawSummary.trustlessFees',
    defaultMessage: 'Trustless fees',
  },
  gasFeesInfo: {
    id: 'WithdrawSummary.gasFeesInfo',
    defaultMessage: 'Sorare covers the gas fees for this withdrawal',
  },
  totalReceived: {
    id: 'WithdrawSummary.totalReceived',
    defaultMessage: 'Total received',
  },
  addressDisclaimer: {
    id: 'WithdrawSummary.addressDisclaimer',
    defaultMessage:
      'I have reviewed and confirmed the wallet address is correct',
  },
  understandFeesDisclaimer: {
    id: 'WithdrawSummary.understandFeesDisclaimer',
    defaultMessage: 'I understand the fees that i am being charged on',
  },
  withdrawalFailDisclaimer: {
    id: 'WithdrawSummary.withdrawalFailDisclaimer',
    defaultMessage:
      'I understand that if my withdrawal fails due to incorrect wallet information, fees will not be refunded',
  },
  cta: {
    id: 'WithdrawSummary.cta',
    defaultMessage: 'Send now',
  },
});

// To change when WithdrawSummaryDialog will be used with fees = Base | Trustless
const gasFees = 0;

const Root = styled.div``;
const SummaryTable = styled.div`
  background-color: var(--c-neutral-200);
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 8px;
`;
const Address = styled(Value)`
  color: var(--c-neutral-600);
  max-width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 10px;
  margin-top: 10px;
`;
const Cta = styled(Button)`
  margin-top: 10px;
  width: 100%;
`;

export const WithdrawSummary = ({
  ethAmount,
  address,
  fees = Fees.Free,
  onCancel,
}: Props) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useCurrentUserContext();
  const { showNotification } = useSnackNotificationContext();
  const bankWithdrawableAmount = useBankWithdrawableAmount();
  const { bankBalance, ethMigration } = currentUser!;
  const withdraw = useWithdraw();
  const fastWithdrawal = useFastWithdrawal();
  const { setBeforeBackButton } = useWalletDrawerContext();
  const [creating, setCreating] = useState(false);
  const [correctAddress, toggleCorrectAddress] = useToggle(false);
  const [promptWithdrawCancelDialog, togglePromptWithdrawCancelDialog] =
    useToggle(false);
  const [understandFees, toggleUnderstandFees] = useToggle(false);
  const [withdrawalFailDisclaimer, toggleWithdrawalFailDisclaimer] =
    useToggle(false);

  const isFastWithdrawal = ethMigration || new Big(bankBalance).eq(0);

  const totalEthAmountReceived = useMemo(() => {
    return ethAmount - gasFees;
  }, [ethAmount]);

  const canSubmit =
    fees === Fees.Free
      ? correctAddress
      : correctAddress && understandFees && withdrawalFailDisclaimer;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCreating(true);

    try {
      const errors = isFastWithdrawal
        ? await fastWithdrawal(ethAmount.toString(), address)
        : await withdraw(bankWithdrawableAmount, address);

      if (errors?.length) {
        throw new Error(errors.map(e => e.message).join(', '));
      }
      showNotification('confirmWithdrawal');
    } catch (error: any) {
      showNotification(
        'errors',
        { errors: error.message },
        { level: Level.ERROR }
      );
    } finally {
      setCreating(false);
    }
  };

  const promptWithdrawCancelDialogCallback = useCallback(() => {
    togglePromptWithdrawCancelDialog();
  }, [togglePromptWithdrawCancelDialog]);

  useEffect(() => {
    setBeforeBackButton(() => promptWithdrawCancelDialogCallback);
    return () => {
      setBeforeBackButton(() => {});
    };
  }, [setBeforeBackButton, promptWithdrawCancelDialogCallback]);

  return (
    <>
      <WithdrawCancelDialog
        open={promptWithdrawCancelDialog}
        onConfirm={onCancel}
        onClose={promptWithdrawCancelDialogCallback}
      />
      <Root>
        <SummaryTable>
          <Row
            inline
            title={
              <Text16>
                <FormattedMessage {...messages.amountLabel} />
              </Text16>
            }
          >
            <Value isLoading={creating}>
              {ethAmount} <FormattedMessage {...messages.eth} />
            </Value>
          </Row>
          <Row
            title={
              <Text16>
                <FormattedMessage {...messages.to} />
              </Text16>
            }
          >
            <Address isLoading={creating}>{address}</Address>
          </Row>
          <FeesRow
            title={formatMessage(messages.gasFees)}
            isLoading={creating}
            value={0}
            currency="ETH"
            tooltipTitle={
              <Caption color="var(--c-neutral-600)">
                <FormattedMessage {...messages.gasFeesInfo} />
              </Caption>
            }
          />
          <Row
            inline
            title={
              <Text16 bold>
                <FormattedMessage {...messages.totalReceived} />
              </Text16>
            }
          >
            <BoldValue isLoading={creating}>
              {totalEthAmountReceived} <FormattedMessage {...messages.eth} />
            </BoldValue>
          </Row>
        </SummaryTable>
        <form
          onSubmit={event => {
            onSubmit(event);
          }}
        >
          <StyledCheckbox
            required
            checked={correctAddress}
            onChange={toggleCorrectAddress}
            label={formatMessage(messages.addressDisclaimer)}
          />
          {fees !== Fees.Free && (
            <>
              <StyledCheckbox
                required
                checked={understandFees}
                onChange={toggleUnderstandFees}
                label={formatMessage(messages.understandFeesDisclaimer)}
              />
              <StyledCheckbox
                required
                checked={withdrawalFailDisclaimer}
                onChange={toggleWithdrawalFailDisclaimer}
                label={formatMessage(messages.withdrawalFailDisclaimer)}
              />
            </>
          )}
          <Cta
            medium
            color="blue"
            type="submit"
            disabled={!canSubmit || creating}
          >
            <FormattedMessage {...messages.cta} />
          </Cta>
        </form>
      </Root>
    </>
  );
};

export default WithdrawSummary;
