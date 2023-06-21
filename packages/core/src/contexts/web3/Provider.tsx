import { gql, useMutation } from '@apollo/client';
import {
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useConfigContext } from '@core/contexts/config';
import { useSentryContext } from '@core/contexts/sentry';
import Web3ContextProvider from '@core/contexts/web3';
import { lazy } from '@core/lib/retry';
import {
  EthereumSetupStatus,
  WALLET_NOT_INITIALIZED_ERROR,
  Wallet,
  getWallet,
  getWalletStatus,
} from '@core/lib/web3';

import {
  UpdateUserSettingsLastWeb3ProviderMutation,
  UpdateUserSettingsLastWeb3ProviderMutationVariables,
} from './__generated__/Provider.graphql';

const PortisLoader = lazy(async () => import('./PortisLoader'));
const WalletConnectLoader = lazy(async () => import('./WalletConnectLoader'));
const CoinbaseWalletLoader = lazy(async () => import('./CoinbaseWalletLoader'));

const UPDATE_USER_SETTINGS_LAST_WEB3_PROVIDER_MUTATION = gql`
  mutation UpdateUserSettingsLastWeb3ProviderMutation(
    $input: updateUserSettingsInput!
  ) {
    updateUserSettings(input: $input) {
      errors {
        message
        code
      }
    }
  }
`;

export const nativeWalletProvider = () => {
  if (window.ethereum) {
    return window.ethereum;
  }
  if (window.web3) {
    return window.web3.currentProvider;
  }
  return null;
};

declare global {
  interface Window {
    Portis: any;
  }
}

const SILENT_ERRORS = new RegExp(
  `denied|rejected|User closed|${WALLET_NOT_INITIALIZED_ERROR}`,
  'i'
);

const isSilentError = (error: any) => {
  if (error instanceof Error && error.message?.match(SILENT_ERRORS))
    return true;
  if (typeof error === 'string' && error.match(SILENT_ERRORS)) return true;

  return false;
};

interface Props {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Props) => {
  const { ethereumNetworkId } = useConfigContext();
  const [ethereumSetupStatus, setEthereumSetupStatus] =
    useState<EthereumSetupStatus>(EthereumSetupStatus.NOK);
  const [currentProvider, setCurrentProvider] = useState(nativeWalletProvider);
  const { sendSafeError } = useSentryContext();
  const [loadPortis, setLoadPortis] = useState(false);
  const [walletConnectRequestPending, setWalletConnectRequestPending] =
    useState(false);
  const [
    walletConnectAlreadyRequestedError,
    setWalletConnectAlreadyRequestedError,
  ] = useState(false);
  const [loadWalletConnect, setLoadWalletConnect] = useState(false);
  const [loadCoinbaseWallet, setLoadCoinbaseWallet] = useState(false);
  const [saveLastWeb3Provider] = useMutation<
    UpdateUserSettingsLastWeb3ProviderMutation,
    UpdateUserSettingsLastWeb3ProviderMutationVariables
  >(UPDATE_USER_SETTINGS_LAST_WEB3_PROVIDER_MUTATION);

  const wallet = useMemo(() => getWallet(currentProvider), [currentProvider]);

  const getEthereumSetupStatus = useCallback(async () => {
    try {
      return getWalletStatus(currentProvider, ethereumNetworkId);
    } catch (error) {
      if (!isSilentError(error)) {
        sendSafeError(error);
      }

      return EthereumSetupStatus.NO_NATIVE_WALLET;
    }
  }, [currentProvider, sendSafeError, ethereumNetworkId]);

  const enable = useCallback(
    async ({
      provider,
      legacyWeb3 = false,
    }: {
      provider: any;
      legacyWeb3?: boolean;
    }) => {
      setWalletConnectRequestPending(true);
      setWalletConnectAlreadyRequestedError(false);
      try {
        if (legacyWeb3) {
          await provider.enable();
        } else {
          await provider.request({ method: 'eth_requestAccounts' });
        }
        setCurrentProvider(provider);
        saveLastWeb3Provider({
          variables: {
            input: {
              lastWeb3Provider: getWallet(provider),
            },
          },
        });
        setEthereumSetupStatus(await getEthereumSetupStatus());
        setWalletConnectRequestPending(false);
        return true;
      } catch (error: any) {
        if (error.code === -32002) {
          // Request of type 'wallet_requestPermissions' already pending
          setWalletConnectAlreadyRequestedError(true);
          return false;
        }
        setWalletConnectRequestPending(false);
        if (!isSilentError(error) && wallet !== Wallet.UNKNOWN) {
          sendSafeError(error);
        }
        return false;
      }
    },
    [saveLastWeb3Provider, getEthereumSetupStatus, wallet, sendSafeError]
  );

  const setupCoinbaseWallet = () => {
    setLoadCoinbaseWallet(true);
  };

  const setupWalletConnect = () => {
    setLoadWalletConnect(true);
  };

  const setupPortis = () => {
    setLoadPortis(true);
  };

  useEffect(() => {
    const fetchEthereumSetupStatus = async () =>
      setEthereumSetupStatus(await getEthereumSetupStatus());
    fetchEthereumSetupStatus();
    return () => {};
  }, [getEthereumSetupStatus]);

  const onWalletEnabled = useCallback(() => {
    setLoadCoinbaseWallet(false);
    setLoadWalletConnect(false);
    setLoadPortis(false);
  }, [setLoadCoinbaseWallet, setLoadWalletConnect, setLoadPortis]);

  return (
    <Web3ContextProvider
      value={{
        currentProvider,
        walletConnectRequestPending,
        walletConnectAlreadyRequestedError,
        ethereumSetupStatus,
        wallet,
        setupCoinbaseWallet,
        setupWalletConnect,
        setupPortis,
        setCurrentProvider,
        enable,
      }}
    >
      <Suspense fallback={<div />}>
        <>
          {loadPortis && <PortisLoader onEnabled={onWalletEnabled} />}
          {loadWalletConnect && (
            <WalletConnectLoader onEnabled={onWalletEnabled} />
          )}
          {loadCoinbaseWallet && (
            <CoinbaseWalletLoader onEnabled={onWalletEnabled} />
          )}
        </>
      </Suspense>
      {children}
    </Web3ContextProvider>
  );
};

export default Web3Provider;
