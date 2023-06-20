import { useLocation, useNavigate } from 'react-router-dom';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { WalletTab, useWalletDrawerContext } from '@sorare/core/src/contexts/walletDrawer';
import useQueryString from '@sorare/core/src/hooks/useQueryString';

export default () => {
  const { currentUser } = useCurrentUserContext();

  const { showDrawer, mounted, setCurrentTab, currentTab } =
    useWalletDrawerContext();
  const action = useQueryString('action');
  const location = useLocation();
  const navigate = useNavigate();

  if (
    action !== 'addFundsEth' ||
    !mounted ||
    !currentUser ||
    currentTab === WalletTab.ADD_FUNDS_ETH
  ) {
    return;
  }
  setCurrentTab(WalletTab.ADD_FUNDS_ETH);
  showDrawer();

  navigate(location.pathname, { replace: true });
};
