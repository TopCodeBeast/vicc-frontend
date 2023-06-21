import { ReactNode, useCallback, useRef, useState } from 'react';

import { GoogleReCAPTCHA, ReCAPTCHA } from '@core/components/recaptcha';
import useEvents from '@core/lib/events/useEvents';

import WalletDrawerContextProvider, {
  WalletTab,
  backButtonDestinations,
} from '.';

interface Props {
  children: ReactNode;
}

const WalletDrawerProvider = ({ children }: Props) => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [walletOpened, setWalletOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState<WalletTab>(WalletTab.HOME);
  const [beforeBackButton, setBeforeBackButton] = useState<() => void>(
    () => {}
  );
  const [navFromMenu, setNavFromMenu] = useState<boolean>(false);
  const [walletIsLocked, setWalletIsLocked] = useState<boolean>(false);
  const track = useEvents();

  const recaptchaRef = useRef<GoogleReCAPTCHA>(null);

  const trackOpenWallet = useCallback(() => {
    track('Wallet Opened', {});
  }, [track]);

  const showDrawer = useCallback(() => {
    setDrawerOpened(true);
    trackOpenWallet();
  }, [trackOpenWallet]);
  const hideDrawer = useCallback(() => {
    setDrawerOpened(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    if (!drawerOpened) trackOpenWallet();
    setDrawerOpened(!drawerOpened);
  }, [drawerOpened, trackOpenWallet]);

  const showWallet = useCallback(() => {
    showDrawer();
    setWalletOpened(true);
  }, [showDrawer]);
  const hideWallet = useCallback(() => setWalletOpened(false), []);

  const closeWalletAndDrawer = useCallback(() => {
    hideDrawer();
    hideWallet();
    setNavFromMenu(false);
    setWalletIsLocked(false);
    setCurrentTab(WalletTab.HOME);
  }, [hideWallet, hideDrawer]);

  const onBackButton = useCallback(() => {
    if (beforeBackButton) beforeBackButton();
    else {
      hideWallet();
      setNavFromMenu(false);
      setWalletIsLocked(false);
      setCurrentTab(backButtonDestinations[currentTab] || WalletTab.HOME);
      if (!backButtonDestinations[currentTab]) hideDrawer();
    }
  }, [beforeBackButton, hideWallet, currentTab, hideDrawer]);

  return (
    <WalletDrawerContextProvider
      value={{
        drawerOpened,
        hideDrawer,
        showDrawer,
        toggleDrawer,
        showWallet,
        hideWallet,
        walletOpened,
        mounted,
        setMounted,
        currentTab,
        setCurrentTab,
        navFromMenu,
        setNavFromMenu,
        walletIsLocked,
        setWalletIsLocked,
        onBackButton,
        setBeforeBackButton,
        closeWalletAndDrawer,
        recaptchaRef,
      }}
    >
      {walletOpened && <ReCAPTCHA ref={recaptchaRef} />}
      {children}
    </WalletDrawerContextProvider>
  );
};

export default WalletDrawerProvider;
