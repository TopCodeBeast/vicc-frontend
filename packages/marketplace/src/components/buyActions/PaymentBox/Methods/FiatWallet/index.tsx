import { FormattedMessage } from 'react-intl';

import { Text14 } from '@sorare/core/src/atoms/typography';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { getFaCurrencySymbol } from '@sorare/core/src/lib/fiat';
import { payment } from '@sorare/core/src/lib/glossary';

import SorareWallet from '../SorareWallet';

type Props = {
  withoutBalance?: boolean;
};

export const FiatWallet = ({ withoutBalance }: Props) => {
  const { fiatCurrency, availableBalanceWithCurrencySymbol } = useFiatBalance();
  return (
    <SorareWallet
      icon={getFaCurrencySymbol(fiatCurrency)}
      color="var(--c-green-600)"
      label={<FormattedMessage {...payment.sorareCashWallet} />}
      balance={
        <Text14 color="var(--c-neutral-1000)">
          {availableBalanceWithCurrencySymbol}
        </Text14>
      }
      withoutBalance={withoutBalance}
    />
  );
};

export default FiatWallet;
