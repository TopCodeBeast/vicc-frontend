/* eslint-disable no-restricted-imports */
import { useCallback, useEffect } from 'react';

import {
  EthereumConfig,
  EthereumManagers,
  setupEthereum,
} from '@sorare/blockchain';
import { useConfigContext } from '@core/contexts/config';
import { useWeb3Context } from '@core/contexts/web3';
import { EthereumSetupStatus } from '@core/lib/web3';
/* eslint-enable no-restricted-imports */

import { InitEthereumSource } from '.';

export interface Props {
  onEthereumSetup: (ethereum: EthereumManagers | null) => void;
  source: InitEthereumSource;
}

export const LazyLoader = ({ onEthereumSetup, source }: Props) => {
  const {
    viccTokensAddress,
    viccCardsAddress,
    baseballTokensAddress,
    nbaTokensAddress,
    cricketNationalSeriesTokensAddress,
    bankAddress,
    relayAddress,
    migratorAddress,
    starkExchangeAddress,
  } = useConfigContext();
  const { currentProvider, ethereumSetupStatus, enable } = useWeb3Context();

  const initEthereum = useCallback(async () => {
    if (
      [
        EthereumSetupStatus.NO_NATIVE_WALLET,
        EthereumSetupStatus.NOK,
        EthereumSetupStatus.WRONG_NETWORK,
      ].includes(ethereumSetupStatus)
    ) {
      return null;
    }

    if (ethereumSetupStatus === EthereumSetupStatus.MUST_ENABLE) {
      if (source !== 'OnUserRequest') {
        return null;
      }
      try {
        await enable({ provider: currentProvider });
        return null;
      } catch (error) {
        // User denied account access...
        return null;
      }
    }

    const starkExchangeConfig =
      (starkExchangeAddress && {
        contractAddress: starkExchangeAddress,
      }) ||
      undefined;

    const config: EthereumConfig = {
      provider: currentProvider,
      bankConfig: {
        bankAddress,
      },
      relayConfig: {
        contractAddress: relayAddress,
      },
      viccTokensAddress,
      viccCardsAddress,
      sorareDataAddress: '',
      starkExchangeConfig,
      tokensConfig: {
        footballTokensAddress: viccTokensAddress,
        baseballTokensAddress,
        nbaTokensAddress,
        cricketNationalSeriesTokensAddress,
      },
    };

    if (migratorAddress) {
      config.migratorConfig = {
        contractAddress: migratorAddress,
        ethReceiverAddress: '0x4eaa7147c3C66B792855E2CE4321b1D37a27956F',
      };
    }

    return setupEthereum(config);
  }, [
    ethereumSetupStatus,
    currentProvider,
    bankAddress,
    starkExchangeAddress,
    relayAddress,
    viccTokensAddress,
    baseballTokensAddress,
    nbaTokensAddress,
    cricketNationalSeriesTokensAddress,
    viccCardsAddress,
    migratorAddress,
    source,
    enable,
  ]);

  useEffect(() => {
    initEthereum().then(onEthereumSetup);
  }, [initEthereum, onEthereumSetup]);

  return null;
};

export default LazyLoader;
