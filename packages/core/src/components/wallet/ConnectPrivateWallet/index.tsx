import { useEffect, useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text16 } from '@core/atoms/typography';
import RecommendedWalletApp from '@core/components/wallet/RecommendedWalletApp';
import { useBlockchainContext } from '@core/contexts/blockchain';
import { useWeb3Context } from '@core/contexts/web3';
import useBlockchainAccountData from '@core/hooks/useBlockchainAccountData';
import { EthereumSetupStatus } from '@core/lib/web3';

const messages = defineMessages({
  wrongNetwork: {
    id: 'ConnectPrivateWallet.wrongNetwork',
    defaultMessage:
      'Please switch your Wallet to the Ethereum {expectedEthereumNetwork} network.',
  },
});

const Message = styled(Text16)`
  text-align: center;
`;
const Warning = styled(Text16)`
  padding: 10px;
  color: var(--c-neutral-600);
  border-radius: 8px;
  background: var(--c-neutral-200);
`;
const AlreadyOpen = styled(Text16)`
  text-align: center;
`;

export const ConnectPrivateWallet = () => {
  const blockchains = useBlockchainContext();
  const accountData = useBlockchainAccountData();
  const {
    ethereumSetupStatus,
    walletConnectRequestPending,
    walletConnectAlreadyRequestedError,
  } = useWeb3Context();
  const {
    expectedEthereumNetwork,
    loading,
    ethereumInitialized,
    connectToEthereum,
  } = blockchains!;

  useEffect(() => {
    if (!ethereumInitialized && !loading) {
      connectToEthereum('InBackground');
    }
  }, [connectToEthereum, ethereumInitialized, loading]);

  const connectButtonMessage = useMemo(() => {
    if (walletConnectRequestPending) {
      return (
        <FormattedMessage
          id="ConnectPrivateWallet.connecting"
          defaultMessage="Connecting..."
        />
      );
    }
    return (
      <FormattedMessage
        id="ConnectPrivateWallet.connect"
        defaultMessage="Connect my wallet"
      />
    );
  }, [walletConnectRequestPending]);

  if (loading) {
    return <LoadingIndicator />;
  }

  const renderContent = () => {
    if (!ethereumInitialized) {
      if (ethereumSetupStatus === EthereumSetupStatus.NO_NATIVE_WALLET) {
        return <RecommendedWalletApp />;
      }

      if (ethereumSetupStatus === EthereumSetupStatus.NOK) {
        return (
          <Message bold>
            <FormattedMessage
              id="ConnectPrivateWallet.nok"
              defaultMessage="You need to install an Ethereum wallet to access this part of Vicc."
            />
          </Message>
        );
      }
      if (ethereumSetupStatus === EthereumSetupStatus.WRONG_NETWORK) {
        return (
          <Warning>
            <FormattedMessage
              {...messages.wrongNetwork}
              values={{ expectedEthereumNetwork }}
            />
          </Warning>
        );
      }
      if (
        ethereumSetupStatus === EthereumSetupStatus.MUST_ENABLE ||
        !accountData
      ) {
        return (
          <>
            <Button
              fullWidth
              medium
              color="blue"
              disabled={walletConnectRequestPending}
              onClick={() => connectToEthereum('OnUserRequest')}
            >
              {connectButtonMessage}
            </Button>
            {walletConnectAlreadyRequestedError && (
              <AlreadyOpen color="var(--c-red-600)">
                <FormattedMessage
                  id="ConnectPrivateWallet.alreadyOpen"
                  defaultMessage="Ethereum wallet popup already open"
                />
              </AlreadyOpen>
            )}
          </>
        );
      }
    }
    return null;
  };

  return renderContent();
};

export default ConnectPrivateWallet;
