import { faClock } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text16, Text18 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { glossary } from '@core/lib/glossary';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  text-align: center;
`;

type Props = { amountToReceive: number };

export const WithdrawFiatSuccess = ({ amountToReceive }: Props) => {
  const { setCurrentTab } = useWalletDrawerContext();
  const { fiatCurrency } = useCurrentUserContext();
  const { formatNumber } = useIntlContext();

  return (
    <Root>
      <FontAwesomeIcon icon={faClock} size="3x" />
      <Text18 bold>
        <FormattedMessage
          id="Withdraw.WithdrawFiat.WithdrawFiatSuccess.weHaveReceivedYourWithdrawalRequest"
          defaultMessage="We have received your withdrawal request."
        />
      </Text18>
      <Text16>
        <FormattedMessage
          id="Withdraw.WithdrawFiat.WithdrawFiatSuccess.onceApprovedYouWillReceive"
          defaultMessage="Once it is approved, you will receive <b>{amount}</b> within approximately two business days."
          values={{
            b: Bold,
            amount: formatNumber(amountToReceive, {
              style: 'currency',
              currency: fiatCurrency.code,
            }),
          }}
        />
      </Text16>
      <Button
        fullWidth
        color="blue"
        medium
        onClick={() => {
          setCurrentTab(WalletTab.HOME);
        }}
      >
        <FormattedMessage {...glossary.next} />
      </Button>
    </Root>
  );
};
