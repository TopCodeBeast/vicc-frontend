import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import { WalletTab } from '@core/contexts/walletDrawer';
import { messages as walletMessages } from '@core/lib/wallet';

import SendDeviceConfirmation from './SendDeviceConfirmation';

const UnconfirmedDevice = styled.div`
  padding-bottom: var(--double-unit);
`;

type Props = {
  walletTab: WalletTab;
};

export const DeviceNeedsConfirming = ({ walletTab }: Props) => {
  if (walletTab === WalletTab.HOME) {
    return <SendDeviceConfirmation />;
  }

  return (
    <UnconfirmedDevice>
      <Text16>
        <FormattedMessage {...walletMessages.unconfirmedDevice} />
      </Text16>
    </UnconfirmedDevice>
  );
};
