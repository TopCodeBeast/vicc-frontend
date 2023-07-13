export type MigratorConfig = {
  contractAddress: string;
  ethReceiverAddress: string;
};

export type BankConfig = {
  bankAddress: string;
};

export type EthereumConfig = {
  provider: any;
  bankConfig: BankConfig;
  relayConfig: {
    contractAddress: string;
  };
  sorareTokensAddress: string;
  sorareCardsAddress: string;
  sorareDataAddress: string;
  starkExchangeConfig: any;
  tokensConfig: {
    footballTokensAddress: string;
    baseballTokensAddress: string;
    nbaTokensAddress: string;
    footballNationalSeriesTokensAddress: string;
  };
  migratorConfig?: MigratorConfig;
};

export type EthereumManagers = {
  accountManager: any;
  bankManager: any;
  cardManager: any;
  migratorManager: any;
  tokensManager: any;
  starkExchangeManager: any;
};

export type setupEthereum = {};

export type Deal = {};

export const setupEthereum = async (config: EthereumConfig) => {
  console.log('setupEthereum', config);
  return Promise.resolve(null);
};
