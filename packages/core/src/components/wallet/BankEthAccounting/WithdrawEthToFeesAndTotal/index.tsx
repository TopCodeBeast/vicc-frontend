import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Currency, Fee, SupportedCurrency } from '__generated__/globalTypes';
import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Text16 } from '@core/atoms/typography';
import Row from '@core/components/Transaction/Row';
import { AmountWithConversion } from '@core/components/buyActions/AmountWithConversion';
import useUnquantizeAmount from '@core/hooks/useUnquantizeAmount';

export const messages = defineMessages({
  withdrawalFees: {
    id: 'WithdrawEthTo.withdrawalFee',
    defaultMessage: 'Withdrawal fee',
  },
  total: {
    id: 'WithdrawEthTo.total',
    defaultMessage: 'Total',
  },
  durationTitle: {
    id: 'WithdrawEthTo.durationTitle',
    defaultMessage: 'Estimated duration',
  },
  durationTime: {
    id: 'WithdrawEthTo.durationTime',
    defaultMessage: 'up to few minutes',
  },
  tooltipTitle: {
    id: 'WithdrawEthTo.tooltipTitle',
    defaultMessage: 'Upper limit of the estimated amount to cover gas fee',
  },
});

const LabelContainer = styled.div`
  display: flex;
  gap: var(--unit);
`;

export const WithdrawEthToFeesAndTotal = ({
  weiAmountToWithdraw,
  feeInfoUser,
}: {
  weiAmountToWithdraw: string;
  feeInfoUser: Fee | undefined | null;
}) => {
  const unquantizeAmount = useUnquantizeAmount();

  const feeAmount = unquantizeAmount(feeInfoUser?.feeLimit || '0');

  return (
    <>
      <Row
        inline
        title={
          <LabelContainer>
            <Text16>
              <FormattedMessage {...messages.withdrawalFees} />
            </Text16>
            <Tooltip
              interactive
              placement="top"
              title={<FormattedMessage {...messages.tooltipTitle} />}
            >
              <div>
                <FontAwesomeIcon
                  color="var(--c-neutral-600)"
                  icon={faInfoCircle}
                />
              </div>
            </Tooltip>
          </LabelContainer>
        }
      >
        {feeInfoUser ? (
          <AmountWithConversion
            monetaryAmount={{
              referenceCurrency: SupportedCurrency.WEI,
              wei: feeAmount,
            }}
            primaryCurrency={Currency.ETH}
            withApproxSymbol
          />
        ) : (
          '—'
        )}
      </Row>
      <Row
        inline
        title={
          <Text16 bold>
            <FormattedMessage {...messages.total} />
          </Text16>
        }
      >
        {feeInfoUser ? (
          <AmountWithConversion
            monetaryAmount={{
              referenceCurrency: SupportedCurrency.WEI,
              [SupportedCurrency.WEI.toLowerCase()]:
                +weiAmountToWithdraw + +feeAmount,
            }}
            primaryCurrency={Currency.ETH}
            withApproxSymbol
          />
        ) : (
          '—'
        )}
      </Row>
      <Row inline title={<FormattedMessage {...messages.durationTitle} />}>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage {...messages.durationTime} />
        </Text16>
      </Row>
    </>
  );
};

export default WithdrawEthToFeesAndTotal;
