export enum EthereumSetupStatus {
  OK = 'ok',
  NOK = 'nok',
  MUST_ENABLE = 'mustEnable',
  WRONG_NETWORK = 'wrongNetwork',
  NO_NATIVE_WALLET = 'noNativeWallet',
}

export enum Wallet {
  META_MASK = 'MetaMask',
  DAPPER = 'Dapper',
  WALLET_LINK = 'WalletLink',
  WALLET_CONNECT = 'WalletConnect',
  PORTIS = 'Portis',
  TRUST = 'Trust',
  RAMP = 'Ramp',
  COINBASE_WALLET = 'CoinbaseWallet',
  XDEFI = 'Xdefi',
  OPERA = 'Opera',
  PHANTOM = 'Phantom',
  UNKNOWN = 'Unknown',
}

export const WALLET_NOT_INITIALIZED_ERROR = 'Wallet not initialized';

interface ProviderState {
  isConnected: (provider: any) => boolean;
  isEnabled: (
    provider: any,
    state: ProviderState
  ) => Promise<boolean> | boolean;
  isOnNetwork: (provider: any, network: string) => boolean;
}

const hasEthAccount = async (provider: any) => {
  try {
    return (
      provider.request &&
      ((await provider.request({ method: 'eth_accounts' })) || []).length > 0
    );
  } catch (e: any) {
    if (
      (e.message || '').match(/jsonrpc/) &&
      JSON.parse(e.message).error?.message === 'wallet address undefined'
    ) {
      throw new Error(WALLET_NOT_INITIALIZED_ERROR);
    }
    return false;
  }
};

const defaultProviderState: ProviderState = {
  isConnected: provider =>
    typeof provider.isConnected === 'function'
      ? provider.isConnected()
      : provider.isConnected,
  isEnabled: async (provider, state) => {
    if (!state.isConnected(provider)) return false;

    return (
      provider.selectedAddress ||
      provider.accounts?.length > 0 ||
      hasEthAccount(provider)
    );
  },
  isOnNetwork: (provider, networkId) =>
    !provider.networkVersion || provider.networkVersion === networkId,
};

const isEnabledEIP1193 = async (provider: any) => {
  const accounts = await provider.request({ method: 'eth_accounts' });
  return accounts.length > 0;
};

const customProvidersState: { [key in string]: Partial<ProviderState> } = {
  MetaMask: {
    isEnabled: async provider => {
      const accounts = await provider.request({ method: 'eth_accounts' });
      return accounts.length > 0;
    },
  },
  WalletLink: {
    isEnabled: provider => !!provider.selectedAddress,
  },
  CoinbaseWallet: {
    isEnabled: provider => !!provider.selectedAddress,
  },
  Dapper: {
    isOnNetwork: (provider, networkId) =>
      provider.cachedResults.net_version?.result === networkId,
    isConnected: provider =>
      (provider.cachedResults.eth_accounts?.result || []).length > 0,
  },
  WalletConnect: {
    isConnected: () => true,
    isEnabled: provider => (provider.accounts || []).length > 0,
  },
  Portis: {
    isEnabled: provider => defaultProviderState.isConnected(provider),
  },
  Trust: {
    isEnabled: isEnabledEIP1193,
    isOnNetwork: () => true,
  },
  Xdefi: {
    isOnNetwork: (provider, networkId) => provider.networkId === networkId,
    isEnabled: provider => provider.accounts.length > 0,
  },
  Opera: {
    isEnabled: provider => !!provider.selectedAddress,
  },
  Phantom: {
    isEnabled: isEnabledEIP1193,
  },
};

const isWalletLink = (provider: any) => {
  try {
    return !!provider.isWalletLink;
  } catch (error) {
    return false;
  }
};

const isXDEFI = (provider: any) => {
  const { hasOwnProperty } = Object.prototype;

  try {
    return (
      hasOwnProperty.call(provider, '__XDEFI') ||
      hasOwnProperty.call(provider, 'isXDEFI')
    );
  } catch (error) {
    return false;
  }
};

const isMetaMask = (provider: any) => {
  try {
    return !!provider.isMetaMask;
  } catch (error) {
    return false;
  }
};

const isDapper = (provider: any) => {
  try {
    return !!provider.isDapper;
  } catch (error) {
    return false;
  }
};

const isPortis = (provider: any) => {
  try {
    return !!provider.isPortis;
  } catch (error) {
    return false;
  }
};

const isTrust = (provider: any) => {
  try {
    return !!provider.isTrust;
  } catch (error) {
    return false;
  }
};

const isCoinbaseWallet = (provider: any) => {
  try {
    return !!provider.isCoinbaseWallet;
  } catch (error) {
    return false;
  }
};

const isWalletConnect = (provider: any) => {
  try {
    return !!provider.isWalletConnect;
  } catch (error) {
    return false;
  }
};

const isOpera = (provider: any) => {
  try {
    return !!provider.isOpera;
  } catch (error) {
    return false;
  }
};

const isPhantom = (provider: any) => {
  try {
    return !!provider.isPhantom;
  } catch (error) {
    return false;
  }
};

export const getWallet = (provider: any) => {
  if (!provider) return Wallet.UNKNOWN;
  if (isPhantom(provider)) return Wallet.PHANTOM;
  if (isXDEFI(provider)) return Wallet.XDEFI;
  if (isWalletLink(provider)) return Wallet.WALLET_LINK;
  if (isMetaMask(provider)) return Wallet.META_MASK;
  if (isDapper(provider)) return Wallet.DAPPER;
  if (isPortis(provider)) return Wallet.PORTIS;
  if (isTrust(provider)) return Wallet.TRUST;
  if (isCoinbaseWallet(provider)) return Wallet.COINBASE_WALLET;
  if (isWalletConnect(provider)) return Wallet.WALLET_CONNECT;
  if (isOpera(provider)) return Wallet.OPERA;

  return Wallet.UNKNOWN;
};

const getWalletState = (provider: any): ProviderState => ({
  ...defaultProviderState,
  ...customProvidersState[getWallet(provider)],
});

export const getWalletStatus = async (
  provider: any,
  ethereumNetworkId: string
) => {
  if (!provider) {
    return EthereumSetupStatus.NO_NATIVE_WALLET;
  }
  const walletState = getWalletState(provider);
  const isEnabled = await walletState.isEnabled(provider, walletState);

  if (!isEnabled) {
    return EthereumSetupStatus.MUST_ENABLE;
  }
  if (!walletState.isOnNetwork(provider, ethereumNetworkId))
    return EthereumSetupStatus.WRONG_NETWORK;

  return EthereumSetupStatus.OK;
};
