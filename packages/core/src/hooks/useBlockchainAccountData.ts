import { useEffect, useState } from 'react';

// import { AccountData, useBlockchainContext } from '@core/contexts/blockchain';
type AccountData = any;

export default () => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  // const { getAccountData } = useBlockchainContext();

  useEffect(() => {
    const fetchAccountData = async () => {
      // const data = await getAccountData();

      // setAccountData(data);
    };

    fetchAccountData().catch(() => {
      setAccountData(null);
    });
  }, [/*getAccountData*/]);

  return accountData;
};
