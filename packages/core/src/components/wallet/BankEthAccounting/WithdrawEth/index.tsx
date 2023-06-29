import ConnectPrivateWallet from '@core/components/wallet/ConnectPrivateWallet';
import { useBlockchainContext } from '@core/contexts/blockchain';
import useBlockchainAccountData from '@core/hooks/useBlockchainAccountData';

import WithdrawEthForm from '../WithdrawEthForm';

const WithdrawEth = () => {
  const accountData = useBlockchainAccountData();
  const { promptEthereumAccount } = useBlockchainContext()!;

  return (
    <div>
      {promptEthereumAccount && <ConnectPrivateWallet />}
      {accountData && <WithdrawEthForm />}
    </div>
  );
};

export default WithdrawEth;
