import qs from 'qs';
import { useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { GeneratedKey, MessagingContext, Prompt } from '@sorare/wallet-shared';
import { useAuthContext } from '@sorare/core/src/contexts/auth';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import { WalletTab, useWalletDrawerContext } from '@sorare/core/src/contexts/walletDrawer';
import { nullAddress } from '@sorare/core/src/lib/ethereum';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { formatUpdateUserErrors } from '@sorare/core/src/lib/http';

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
        (!currentUser.sorareAddress ||
          currentUser.sorareAddress === nullAddress ||
          (!currentUser.starkKey &&
            currentUser.sorarePrivateKey &&
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
                sorareAddress: address,
                sorarePrivateKey: userPrivateKey,
                sorarePrivateKeyBackup: userPrivateKeyBackup,
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

    doPrompt();
    return () => {};
  }, [
    currentUser?.email,
    currentUser?.sorareAddress,
    currentUser?.sorarePrivateKey,
    currentUser?.starkKey,
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
