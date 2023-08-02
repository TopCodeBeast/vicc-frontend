import { FormattedMessage, defineMessages } from 'react-intl';

import { FiatWalletAccountState } from '__generated__/globalTypes';
import RadioGroup from '@core/atoms/inputs/RadioGroup';
import { Text16 } from '@core/atoms/typography';
import { NeedsValidatedFiatWalletHelper } from '@core/components/fiatWallet/NeedsValidatedFiatWalletHelper';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import {
  AcceptedCurrenciesValue,
  useAcceptedCurrencies,
} from '@core/hooks/useAcceptedCurrencies';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';

import SettingsSection from '../SettingsSection';

const messages = defineMessages({
  title: {
    id: 'Settings.receivedPaymentCurrency.title',
    defaultMessage: 'How you’ll get paid',
  },
  description: {
    id: 'Settings.receivedPaymentCurrency.description',
    defaultMessage:
      'Decide how you’ll be paid for cards listed on the Marketplace as well as from direct offers from other Managers. <bold>This will only apply to future listings (current listings will follow previous payment settings)</bold>.',
  },
});

const Helper = () => (
  <NeedsValidatedFiatWalletHelper
    withPadding
    statusTarget={FiatWalletAccountState.OWNER}
    defaultHelper={
      <FormattedMessage
        id="Settings.receivedPaymentCurrencies.cashAndEthHelper"
        defaultMessage="You’ll need to activate your Cash Wallet to receive payments in cash."
      />
    }
  />
);

export const AcceptedCurrencies = () => {
  const { canListAndTrade } = useFiatBalance();
  const {
    walletPreferences: { showEthWallet, showFiatWallet },
  } = useCurrentUserContext();
  const { acceptedCurrencies, updateAcceptedCurrencies } =
    useAcceptedCurrencies();

  const onChange = (value: AcceptedCurrenciesValue) => {
    updateAcceptedCurrencies(value);
  };

  const options = [
    {
      value: AcceptedCurrenciesValue.BOTH,
      label: (
        <Text16 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="Settings.receivedPaymentCurrencies.cashAndEth"
            defaultMessage="Cash and ETH"
          />
        </Text16>
      ),
      helper: <Helper />,
      disabled: !canListAndTrade,
    },
    {
      value: AcceptedCurrenciesValue.FIAT,
      label: (
        <Text16 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="Settings.receivedPaymentCurrencies.fiat"
            defaultMessage="Cash only"
          />
        </Text16>
      ),
      helper: <Helper />,
      disabled: !canListAndTrade,
    },
    {
      value: AcceptedCurrenciesValue.ETH,
      label: (
        <Text16 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="Settings.receivedPaymentCurrencies.eth"
            defaultMessage="ETH only"
          />
        </Text16>
      ),
    },
  ];
  if (!showEthWallet || !showFiatWallet) return null;

  return (
    <SettingsSection title={messages.title} description={messages.description}>
      <RadioGroup
        rounded
        withSpacing
        options={options}
        value={acceptedCurrencies || AcceptedCurrenciesValue.ETH}
        name="currency"
        onChange={onChange}
      />
    </SettingsSection>
  );
};
