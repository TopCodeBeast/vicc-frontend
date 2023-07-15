import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { FormattedMessage } from 'react-intl';

import UserBalance from '@sorare/core/src/components/wallet/UserBalance';
import { payment } from '@sorare/core/src/lib/glossary';

import SorareWallet from '../SorareWallet';

type Props = {
  withoutBalance?: boolean;
};

export const EthWallet = ({ withoutBalance }: Props) => {
  return (
    <SorareWallet
      color="var(--c-brand-600)"
      icon={faEthereum}
      label={<FormattedMessage {...payment.sorareEthWallet} />}
      balance={<UserBalance inline disableToggle />}
      withoutBalance={withoutBalance}
    />
  );
};

export default EthWallet;
