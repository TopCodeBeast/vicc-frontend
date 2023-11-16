import qs from 'qs';
import { useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { GeneratedKey, MessagingContext, Prompt } from '@sorare/wallet-shared';
import { useAuthContext } from '@core/contexts/auth';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useWalletContext } from '@core/contexts/wallet';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { nullAddress } from '@core/lib/ethereum';
import useEvents from '@core/lib/events/useEvents';
import { formatUpdateUserErrors } from '@core/lib/http';

export default () => {
  const { registerHandler, sendRequest } = useContext(MessagingContext)!;
  const { updateUser } = useAuthContext();
  const { closeWalletAndDrawer, setCurrentTab, showWallet, showDrawer } =
    useWalletDrawerContext();
  const track = useEvents();
  const { prompt } = useWalletContext();
  const { currentUser } = useCurrentUserContext();
  const location = useLocation();

  const { reset_password_token } = useMemo(
    () => qs.parse(location.search.slice(1)),
    [location.search]
  );

  useEffect(() => {
    const doPrompt = async () => {
      if (
        currentUser?.email &&
        (!currentUser.viccAddress ||
          currentUser.viccAddress === nullAddress ||
          (currentUser.viccPrivateKey &&
            !reset_password_token))
      ) {
        setCurrentTab(WalletTab.GENERATE_KEYS);
        showWallet();
        track('View Set Wallet Password');
        await sendRequest<Prompt>('prompt', {
          type: 'generateKeys',
        });
      }
    };

    if (currentUser?.email) {
      registerHandler<GeneratedKey>(
        'generatedKey',
        async ({
          address,
          passwordHash,
          userPrivateKey,
          userPrivateKeyBackup,
          starkKey,
          wallet,
        }) => {
          const walletParams = wallet
            ? { wallet }
            : {
                starkKey,
                viccAddress: address,
                viccPrivateKey: userPrivateKey,
                viccPrivateKeyBackup: userPrivateKeyBackup,
              };

          const { errors } = await updateUser({
            ...walletParams,
            passwordHash,
          });

          if (errors) return { error: formatUpdateUserErrors(errors) };
          closeWalletAndDrawer();
          return {};
        }
      );
    }

    //doPrompt(); //TODO****It shows generate key draws
    return () => {};
  }, [
    currentUser?.email,
    currentUser?.viccAddress,
    currentUser?.viccPrivateKey,
    // currentUser?.starkKey,
    prompt,
    registerHandler,
    sendRequest,
    updateUser,
    reset_password_token,
    setCurrentTab,
    showDrawer,
    showWallet,
    track,
    closeWalletAndDrawer,
  ]);
};
