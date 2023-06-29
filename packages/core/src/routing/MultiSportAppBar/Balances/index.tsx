import {
  faExclamationCircle,
  faWallet,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '@material-ui/core';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import IconButton from '@core/atoms/buttons/IconButton';
import { Caption, Text14, Text16 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import { useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useWalletNeedsRecover from '@core/hooks/recovery/useWalletNeedsRecover';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { RoundingMode, fromWei } from '@core/lib/wei';

type EthereumBalanceProps = {
  compact?: boolean;
  medium?: boolean;
  small?: boolean;
};

type WalletButtonProps = {
  currentUser: NonNullable<
    ReturnType<typeof useCurrentUserContext>['currentUser']
  >;
} & EthereumBalanceProps;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &:not(:last-child) {
    padding-right: var(--intermediate-unit);
    margin-right: var(--half-unit);
    border-right: 1px solid var(--c-static-neutral-400);
  }
`;

const StyledCaption = styled(Caption)`
  line-height: 1;
`;
const StyledText14 = styled(Text14)`
  line-height: 1;
`;

const WalletButton = ({
  currentUser,
  small,
  compact,
  medium,
}: WalletButtonProps) => {
  const { formatNumber, formatWei } = useIntlContext();
  const { availableBalance } = currentUser;
  const {
    walletPreferences: { showEthWallet, showFiatWallet },
  } = useCurrentUserContext();

  const {
    hasActiveFiatBalance,
    availableBalance: availableFiatBalance,
    fiatCurrency,
  } = useFiatBalance();
  const { toggleDrawer } = useWalletDrawerContext();

  const emptyEthWallet = useMemo(
    () => fromWei(availableBalance, 4, RoundingMode.ROUND_DOWN) === 0,
    [availableBalance]
  );

  const emptyFiatWallet = !hasActiveFiatBalance || availableFiatBalance === 0;

  const emptyWallet =
    (showEthWallet && emptyEthWallet) || (showFiatWallet && emptyFiatWallet);

  if (emptyWallet || currentUser.userSettings?.hideBalance) {
    return (
      <IconButton
        icon={faWallet}
        onClick={toggleDrawer}
        className="light-theme"
        color={compact ? 'transparent' : 'dark'}
      />
    );
  }

  const renderBalances = () => {
    if (showEthWallet && showFiatWallet)
      return (
        <>
          <Column>
            <StyledCaption>
              <FormattedMessage
                id="appbar.balances.cash"
                defaultMessage="Cash"
              />
            </StyledCaption>
            <StyledText14 bold>
              {formatNumber(availableFiatBalance, {
                style: 'currency',
                currency: fiatCurrency,
              })}
            </StyledText14>
          </Column>
          <Column>
            <StyledCaption>
              <FormattedMessage id="appbar.balances.eth" defaultMessage="ETH" />
            </StyledCaption>
            <StyledText14 bold>
              {showEthWallet && showFiatWallet
                ? fromWei(availableBalance, 4, RoundingMode.ROUND_DOWN)
                : formatWei(availableBalance)}
            </StyledText14>
          </Column>
        </>
      );
    if (showEthWallet)
      return <Text16 bold>{formatWei(availableBalance)}</Text16>;
    if (showFiatWallet)
      return (
        <Text16 bold>
          {formatNumber(availableFiatBalance, {
            style: 'currency',
            currency: fiatCurrency,
          })}
        </Text16>
      );
    return null;
  };

  return (
    <Button
      onClick={toggleDrawer}
      color={compact ? 'transparent' : 'dark'}
      medium={medium}
      small={small}
      className="light-theme"
    >
      {compact ? <FontAwesomeIcon icon={faWallet} /> : renderBalances()}
    </Button>
  );
};

const StyledBadge = styled(Badge)`
  > span {
    /** overlap="circular" only work for icon buttons */
    transform: translate(25%, -25%);
  }
`;

export const Balances = ({ medium, small, compact }: EthereumBalanceProps) => {
  const { currentUser } = useCurrentUserContext();
  const walletNeedsRecover = useWalletNeedsRecover();
  const {
    flags: { onlyAllowPrivateKeyAccessFromConfirmedDevice = false },
  } = useFeatureFlags();

  if (!currentUser) {
    return null;
  }

  if (
    walletNeedsRecover ||
    (!currentUser.confirmedDevice &&
      onlyAllowPrivateKeyAccessFromConfirmedDevice)
  )
    return (
      <StyledBadge
        badgeContent={<FontAwesomeIcon icon={faExclamationCircle} />}
      >
        <WalletButton
          currentUser={currentUser}
          compact={compact}
          medium={medium}
          small={small}
        />
      </StyledBadge>
    );

  return (
    <WalletButton
      currentUser={currentUser}
      compact={compact}
      medium={medium}
      small={small}
    />
  );
};
