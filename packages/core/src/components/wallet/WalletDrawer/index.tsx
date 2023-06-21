import {
  faChevronLeft,
  faClose,
  faGear,
} from '@fortawesome/pro-solid-svg-icons';
import { Suspense, useEffect, useState } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import {
  CancelUnlockScreen,
  ReturnToWalletSettingsTab,
  Toggle,
  WalletIsLocked,
} from '@sorare/wallet-shared';
import IconButton from '@core/atoms/buttons/IconButton';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Title6 } from '@core/atoms/typography';
import { DeviceNeedsConfirming } from '@core/components/devices/DeviceNeedsConfirming';
import { useBlockchainContext } from '@core/contexts/blockchain';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useMessagingContext } from '@core/contexts/wallet';
import WalletPlaceholder from '@core/contexts/wallet/Placeholder';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useWalletNeedsRecover from '@core/hooks/recovery/useWalletNeedsRecover';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { nullAddress } from '@core/lib/ethereum';
import { wallet } from '@core/lib/glossary';
import { lazy } from '@core/lib/retry';
import { theme } from '@core/style/theme';

import { WalletNeedsRecover } from '../WalletNeedsRecover';
import Wallet2FA from '../WalletTwoFA';
import DrawerWithNavigation from './DrawerWithNavigation';

const BankEthAccounting = lazy(async () => import('../BankEthAccounting'));

const DRAWER_TRANSITION_DURATION = 200;

const tabTitles = defineMessages<WalletTab, MessageDescriptor>({
  [WalletTab.HOME]: {
    id: 'NewWalletDrawer.title',
    defaultMessage: 'My Sorare wallet',
  },
  [WalletTab.SETTINGS]: {
    id: 'NewWalletDrawer.settingsTitle',
    defaultMessage: 'Wallet Settings',
  },
  [WalletTab.CHANGE_PASSWORD]: {
    id: 'NewWalletDrawer.changePasswordTitle',
    defaultMessage: 'Change your password',
  },
  [WalletTab.DEPOSIT]: {
    id: 'NewWalletDrawer.depositTitle',
    defaultMessage: 'Deposit',
  },
  [WalletTab.PRIVATE_KEY_EXPORT]: {
    id: 'NewWalletDrawer.privateKeyTitle',
    defaultMessage: 'Private Key',
  },
  [WalletTab.GENERATE_KEYS]: {
    id: 'NewWalletDrawer.generateKeysTitle',
    defaultMessage: 'Generate Keys',
  },
  [WalletTab.RECOVER_KEY]: {
    id: 'NewWalletDrawer.recoverKeyTitle',
    defaultMessage: 'Recover Key',
  },
  [WalletTab.RESTORE_WALLET]: {
    id: 'NewWalletDrawer.restoreWalletTitle',
    defaultMessage: 'Restore Wallet',
  },
  [WalletTab.ADD_FUNDS]: {
    id: 'NewWalletDrawer.addFunds',
    defaultMessage: 'Add funds',
  },
  [WalletTab.ADD_FUNDS_ETH]: {
    id: 'NewWalletDrawer.addFundsEth',
    defaultMessage: 'Add funds',
  },
  [WalletTab.ADD_FUNDS_FIAT]: {
    id: 'NewWalletDrawer.addFundsFiat',
    defaultMessage: 'Add funds',
  },
  [WalletTab.WITHDRAW]: {
    id: 'NewWalletDrawer.withdraw',
    defaultMessage: 'Withdraw',
  },
  [WalletTab.WITHDRAW_TO]: {
    id: 'NewWalletDrawer.withdrawTo',
    defaultMessage: 'Withdraw',
  },
  [WalletTab.GENERATE_KEY]: {
    id: 'NewWalletDrawer.generateKey',
    defaultMessage: 'Generate Key',
  },
  [WalletTab.GET_PASSWORD]: {
    id: 'NewWalletDrawer.getPassword',
    defaultMessage: 'Get password',
  },
});

const CustomButton = styled(IconButton)<{ $hideOnDesktop?: boolean }>`
  min-width: auto;
  display: flex;
  ${props =>
    props.$hideOnDesktop
      ? `
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: none;
  } `
      : ''}
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Accounting = styled.div`
  margin: 0;
  height: 100%;
`;
const WalletFrame = styled.div`
  height: 100%;
  display: flex;
  & > :first-child {
    width: 100%;
  }
`;

const WalletTitle = ({
  walletIsLocked,
  currentTab,
}: {
  walletIsLocked: boolean;
  currentTab: WalletTab;
}) => {
  if (walletIsLocked) {
    return (
      <Title6>
        <FormattedMessage {...wallet.walletIsLockedTitle} />
      </Title6>
    );
  }
  if (currentTab in tabTitles && currentTab !== WalletTab.HOME) {
    return (
      <Title6>
        <FormattedMessage {...tabTitles[currentTab]} />
      </Title6>
    );
  }
  return null;
};

export const WalletDrawer = () => {
  const { ethereumAccountHandlers } = useBlockchainContext()!;
  const {
    mounted,
    setMounted,
    drawerOpened,
    hideDrawer,
    hideWallet,
    closeWalletAndDrawer,
    showWallet,
    onBackButton,
    walletOpened,
    currentTab,
    setCurrentTab,
    walletIsLocked,
    setWalletIsLocked,
  } = useWalletDrawerContext();
  const { currentUser } = useCurrentUserContext();
  const walletNeedsRecover = useWalletNeedsRecover();
  const { registerHandler, sendRequest } = useMessagingContext();
  const [showWalletPlaceholder, setShowWalletPlaceholder] =
    useState<boolean>(false);
  const {
    flags: { onlyAllowPrivateKeyAccessFromConfirmedDevice = false },
  } = useFeatureFlags();

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted, setMounted]);

  useEffect(
    () =>
      registerHandler<Toggle>('toggle', async ({ display }) => {
        if (display) {
          showWallet();
        } else hideDrawer();
        return {};
      }),
    [registerHandler, showWallet, hideDrawer]
  );

  useEffect(
    () =>
      registerHandler<WalletIsLocked>(
        'walletIsLocked',
        async ({ isLocked }) => {
          setWalletIsLocked(isLocked);
          return {};
        }
      ),
    [registerHandler, setWalletIsLocked]
  );

  useEffect(
    () =>
      registerHandler<ReturnToWalletSettingsTab>(
        'returnToWalletSettingsTab',
        async () => {
          setCurrentTab(WalletTab.SETTINGS);
          hideWallet();
          return {};
        }
      ),
    [hideWallet, registerHandler, setCurrentTab, setWalletIsLocked]
  );

  if (!currentUser) return null;

  const { sorarePrivateKey, sorareAddress, starkKey } = currentUser;

  const handleClick = () => {
    setCurrentTab(WalletTab.SETTINGS);
  };

  const cancelPromptUnlockScreen = () => {
    sendRequest<CancelUnlockScreen>('cancelUnlockScreen', {
      bypassMessagingQueue: true,
    });
  };

  const closeDrawer = () => {
    // Prevent the user from closing the Wallet as long as his sorare address and stark key are not setup
    if (sorareAddress !== nullAddress && starkKey) {
      if (walletIsLocked) cancelPromptUnlockScreen();
      ethereumAccountHandlers.forEach(h => h.reject('Access denied'));
      closeWalletAndDrawer();
    }
  };

  const closable = ![WalletTab.GENERATE_KEY, WalletTab.GENERATE_KEYS].includes(
    currentTab
  );

  if (showWalletPlaceholder !== drawerOpened) {
    if (drawerOpened) {
      setTimeout(() => {
        setShowWalletPlaceholder(drawerOpened);
      }, DRAWER_TRANSITION_DURATION * 2);
    } else {
      setShowWalletPlaceholder(drawerOpened);
    }
  }

  return (
    <DrawerWithNavigation
      disableEnforceFocus
      anchor="right"
      open={drawerOpened}
      onClose={closeDrawer}
      transitionDuration={DRAWER_TRANSITION_DURATION}
      backButton={
        closable && (
          <CustomButton
            color="white"
            icon={faChevronLeft}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={onBackButton}
            $hideOnDesktop={currentTab === WalletTab.HOME}
          />
        )
      }
      right={
        closable && (
          <CustomButton
            color="white"
            icon={faClose}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={closeDrawer}
          />
        )
      }
      contentTitle={<WalletTitle {...{ walletIsLocked, currentTab }} />}
    >
      <Content>
        {sorarePrivateKey && drawerOpened && !walletOpened && (
          <Accounting>
            <Suspense fallback={<LoadingIndicator />}>
              <BankEthAccounting
                settingsButton={
                  currentTab === WalletTab.HOME &&
                  !walletNeedsRecover && (
                    <CustomButton
                      color="white"
                      icon={faGear}
                      onClick={handleClick}
                    />
                  )
                }
              />
            </Suspense>
          </Accounting>
        )}
        {walletNeedsRecover && <WalletNeedsRecover walletTab={currentTab} />}
        {!walletNeedsRecover &&
          !currentUser.confirmedDevice &&
          onlyAllowPrivateKeyAccessFromConfirmedDevice && (
            <DeviceNeedsConfirming walletTab={currentTab} />
          )}
        {walletOpened && showWalletPlaceholder && (
          <WalletFrame>
            <WalletPlaceholder />
          </WalletFrame>
        )}
      </Content>
      <Wallet2FA />
    </DrawerWithNavigation>
  );
};

export default WalletDrawer;
