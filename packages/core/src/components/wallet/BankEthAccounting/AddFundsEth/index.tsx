import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title4 } from '@core/atoms/typography';
import ConnectPrivateWallet from '@core/components/wallet/ConnectPrivateWallet';
import useBlockchainAccountData from '@core/hooks/useBlockchainAccountData';

import DepositEthForm from '../DepositEthForm';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const AddFundsEth = () => {
  const accountData = useBlockchainAccountData();
  return (
    <Content>
      {accountData ? (
        <DepositEthForm />
      ) : (
        <>
          <Title4>
            <FormattedMessage
              id="NewDepositEth.externalWalletTitle"
              defaultMessage="Choose a wallet you would like to connect"
            />
          </Title4>
          <Text16>
            <FormattedMessage
              id="NewDepositEth.externalWalletContent"
              defaultMessage="Connecting your preferred Ethereum wallet is the fastest method to deposit and withdraw funds."
            />
          </Text16>
          <ConnectPrivateWallet />
        </>
      )}
    </Content>
  );
};

export default AddFundsEth;
