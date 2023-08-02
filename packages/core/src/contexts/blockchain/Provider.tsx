/* eslint-disable no-restricted-imports */

import Big from 'bignumber.js';
import { ReactNode, Suspense, useCallback, useEffect, useState } from 'react';

import { EthereumManagers } from '@sorare/blockchain';
import BlockchainContextProvider, {
  AccountData,
  EthereumAccountHandler,
  InitEthereumSource,
} from '@core/contexts/blockchain';
import { useConfigContext } from '@core/contexts/config';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { EventStep } from '@core/contexts/events/types';
import { useWeb3Context } from '@core/contexts/web3';
import useWithdrawEthEvent from '@core/hooks/events/useWithdrawEthEvent';
import { ethNetworkName } from '@core/lib/ethereum';
import { lazy } from '@core/lib/retry';
import { fromWei } from '@core/lib/wei';

import useDepositEth from './useDepositEth';
import useDepositNft from './useDepositNft';

const LazyLoader = lazy(async () => import('./LazyLoader'));

interface Props {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: Props) => {
  const { currentUser, refetch } = useCurrentUserContext();
  const { ethereumNetworkId } = useConfigContext();
  const { wallet: browserWallet } = useWeb3Context();

  const trackWithdrawEthEvent = useWithdrawEthEvent();
  const [loading, setLoading] = useState(true);
  const [promptEthereumAccount, setPromptEthereumAccount] = useState(false);
  const [ethereumAccountHandlers, setEthereumAccountHandlers] = useState<
    EthereumAccountHandler[]
  >([]);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [initEthereumSource, setInitEthereumSource] =
    useState<InitEthereumSource | null>(null);
  const depositEth = useDepositEth(accountData);
  const depositToken = useDepositNft();

  const [ethereum, setEthereum] = useState<EthereumManagers | undefined>(
    undefined
  );
  const sorareAddress = currentUser?.sorareAddress;

  const refresh = useCallback(
    async (ethereumInstance?: EthereumManagers) => {
      if (ethereumInstance && currentUser) {
        const ethAccount =
          await ethereumInstance.accountManager.getCurrentAccountAsync();

        if (ethAccount) {
          const [ethBalance, bankMapping] = await Promise.all([
            ethereumInstance.accountManager.getEthAccountBalance(ethAccount),
            ethereumInstance.bankManager.getMapping(sorareAddress!),
          ]);

          const data = {
            ethAccount,
            ethBalance,
            bankMapping,
            ethereum: ethereumInstance,
          };
          setAccountData(data);
          if (ethereumAccountHandlers.length) {
            ethereumAccountHandlers.forEach(h => h.resolve(data));
            setEthereumAccountHandlers([]);
          }
        }
      }
      setLoading(false);
    },
    [currentUser, sorareAddress, ethereumAccountHandlers]
  );

  const addEthereumAccountHandler = useCallback(
    (handler: EthereumAccountHandler) =>
      setEthereumAccountHandlers(handlers => [...handlers, handler]),
    []
  );

  const promptEthereumAccountWithCallbacks = useCallback(
    (resolve: (v: AccountData) => void, reject: (reason: any) => void) => {
      setPromptEthereumAccount(true);
      addEthereumAccountHandler({
        resolve,
        reject: (reason: any) => {
          setPromptEthereumAccount(false);
          reject(reason);
        },
      });
    },
    [addEthereumAccountHandler]
  );

  const getAccountData = useCallback(async () => {
    return new Promise<AccountData>((resolve, reject) => {
      if (accountData) {
        resolve(accountData);
      } else {
        promptEthereumAccountWithCallbacks(resolve, reject);
      }
    });
  }, [accountData, promptEthereumAccountWithCallbacks]);

  const onEthereumSetup = useCallback((eth: any) => {
    if (eth) {
      setEthereum(eth);
      setPromptEthereumAccount(false);
    }
  }, []);

  useEffect(() => {
    refresh(ethereum);
    const interval = setInterval(() => {
      refresh(ethereum);
    }, 30000);

    return () => clearInterval(interval);
  }, [ethereum, refresh]);

  const currentEthereumAccount = accountData?.ethAccount;

  useEffect(() => {
    if (ethereum) {
      ethereum.accountManager.monitorEthAccount((newEthAccount: string) => {
        if (ethereum && currentEthereumAccount !== newEthAccount) {
          refresh(ethereum);
        }
        return null;
      });

      return () => ethereum.accountManager.stopMonitoringEthAccount();
    }
    return () => {};
  }, [accountData, currentEthereumAccount, ethereum, refresh]);

  const deposit = async (amountInEth: number) => {
    const { ethereum: ethereumInstance } = await getAccountData();
    const result = await depositEth(amountInEth);

    if (result?.result) {
      refetch();
      await refresh(ethereumInstance);
    }

    return result;
  };

  const depositNft = async (contractAddress: string, assetId: string) => {
    const blockchainAccount = await getAccountData();
    if (!blockchainAccount) {
      throw new Error('Unable to load Ethereum account');
    }

    return depositToken(blockchainAccount, contractAddress, assetId);
  };

  const withdrawFromBank = async (
    amountInWei: string,
    nonce: number,
    signature: string
  ) => {
    const { ethAccount, ethereum: ethereumInstance } = await getAccountData();

    trackWithdrawEthEvent(EventStep.STARTED, {
      ethAmount: fromWei(amountInWei),
      wallet: browserWallet,
    });
    const result = await ethereumInstance.bankManager.withdrawETH(
      ethAccount!,
      sorareAddress!,
      amountInWei,
      nonce,
      signature
    );
    trackWithdrawEthEvent(EventStep.FULFILLED, {
      ethAmount: fromWei(amountInWei),
      wallet: browserWallet,
    });

    refetch();
    await refresh(ethereum);

    return { result };
  };

  const depositCardOnAccount = async (cardId: string) => {
    const {
      ethAccount,
      ethereum: ethereumInstance,
      ethBalance,
    } = await getAccountData();
    if (!ethAccount || !sorareAddress) {
      throw new Error('Unexpected error');
    }
    if (!ethBalance || new Big(ethBalance).eq(0)) {
      return Promise.resolve({
        err: ['Not enough funds in your wallet to transfer the Card'],
      });
    }
    return ethereumInstance.cardManager
      .transfer(ethAccount, sorareAddress, cardId)
      .catch(err => ({ err: [err.toString()] }));
  };

  const signMigratorApprovalForMappedAccount = async (
    nonce: number,
    address: string
  ) => {
    const {
      ethereum: { migratorManager },
    } = await getAccountData();
    if (!migratorManager) throw new Error('migrator not configured');

    return migratorManager.signApproval(nonce, address);
  };

  const signMigration = async (cardIds: string[], expirationBlock: number) => {
    const {
      ethAccount,
      ethereum: { migratorManager },
    } = await getAccountData();
    if (!migratorManager) throw new Error('migrator not configured');

    return migratorManager.signMigration(expirationBlock, cardIds, ethAccount!);
  };

  // we do not expose managers on purpose
  // everything components need should be available through the context
  return (
    <BlockchainContextProvider
      value={{
        getAccountData,
        loading,
        depositEth: deposit,
        depositNft,
        withdrawFromBank,
        ethereumInitialized: !!accountData,
        connectToEthereum: (source: InitEthereumSource) =>
          setInitEthereumSource(source),
        depositCardOnAccount,
        signMigratorApprovalForMappedAccount,
        signMigration,
        promptEthereumAccount,
        expectedEthereumNetwork: ethNetworkName(ethereumNetworkId),
        ethereumNetworkId,
        ethereumAccountHandlers,
      }}
    >
      <Suspense fallback={null}>
        {initEthereumSource && (
          <LazyLoader
            source={initEthereumSource}
            onEthereumSetup={onEthereumSetup}
          />
        )}
      </Suspense>
      {children}
    </BlockchainContextProvider>
  );
};

export default BlockchainProvider;
