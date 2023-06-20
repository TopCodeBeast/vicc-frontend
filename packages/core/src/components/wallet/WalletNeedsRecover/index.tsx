import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { WalletTab } from '@sorare/core/src/contexts/walletDrawer';
import { messages as walletMessages } from '@sorare/core/src/lib/wallet';

import ChooseRestoreMethod from './ChooseRestoreMethod';
import RestoreWallet from './RestoreWallet';

const NoPrivateKey = styled.div`
  padding-bottom: var(--double-unit);
`;

type Props = {
  walletTab: WalletTab;
};

export const WalletNeedsRecover = ({ walletTab }: Props) => {
  if (walletTab === WalletTab.RESTORE_WALLET) return <RestoreWallet />;

  if (walletTab === WalletTab.HOME) return <ChooseRestoreMethod />;

  return (
    <NoPrivateKey>
      <Text16>
        <FormattedMessage {...walletMessages.noPrivateKey} />
      </Text16>
    </NoPrivateKey>
  );
};
