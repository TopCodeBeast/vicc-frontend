import {
  faExclamationCircle,
  faWallet,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '@material-ui/core';
import { useMemo } from 'react';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import FormattedWei from '@sorare/core/src/contexts/intl/FormattedWei';
import { useWalletDrawerContext } from '@sorare/core/src/contexts/walletDrawer';
import useWalletNeedsRecover from '@sorare/core/src/hooks/recovery/useWalletNeedsRecover';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { RoundingMode, fromWei } from '@sorare/core/src/lib/wei';

const StyledBadge = styled(Badge)`
  > span {
    /** overlap="circular" only work for icon buttons */
    transform: translate(25%, -25%);
  }
`;

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

const WalletButton = ({
  currentUser,
  small,
  compact,
  medium,
}: WalletButtonProps) => {
  const { availableBalance } = currentUser;
  const { toggleDrawer } = useWalletDrawerContext();

  const emptyWallet = useMemo(
    () => fromWei(availableBalance, 4, RoundingMode.ROUND_DOWN) === 0,
    [availableBalance]
  );

  if (emptyWallet || currentUser.userSettings?.hideBalance) {
    return (
      <IconButton
        icon={faWallet}
        // disableRipple={small} //TODO***
        onClick={toggleDrawer}
        className="light-theme"
        color={compact ? 'transparent' : 'dark'}
      />
    );
  }

  return (
    <Button
      onClick={toggleDrawer}
      color={compact ? 'transparent' : 'dark'}
      medium={medium}
      small={small}
      className="light-theme"
      // disableRipple={small} //TODO***
    >
      {!compact && (
        <Text16 bold>
          <FormattedWei value={availableBalance} context="EthereumBalance" />
        </Text16>
      )}
      {compact && <FontAwesomeIcon icon={faWallet} />}
    </Button>
  );
};

const EthereumBalance = ({
  compact = false,
  medium = true,
  small,
}: EthereumBalanceProps) => {
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

export default EthereumBalance;
