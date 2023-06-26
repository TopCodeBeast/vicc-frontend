import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { FormControlLabel } from '@material-ui/core';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Currency as CurrencyType,
  FiatCurrency,
} from '__generated__/globalTypes';
import Select from '@core/atoms/inputs/Select';
import { Text16 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useUpdateCurrency from '@core/hooks/useUpdateCurrency';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { useWalletPreferences } from '@core/hooks/wallets/useWalletPreferences';
import { userAttributes } from '@core/lib/glossary';

import SettingsSection from '../SettingsSection';

const StyledFormControlLabel = styled(FormControlLabel)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0;
`;

const Label = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  padding-right: var(--double-unit);
`;

const messages = defineMessages({
  title: {
    id: 'Settings.currency.title',
    defaultMessage: 'Currency',
  },
  currencyDetails: {
    id: 'Settings.currency.currencyDetails',
    defaultMessage:
      'Choose the conversion that you would like to see displayed across Sorare, including your wallet and the marketplace.',
  },
  fiatCurrencyDetails: {
    id: 'Settings.currency.fiatCurrencyDetails',
    defaultMessage:
      'Choose the currency that you would like to see displayed across Sorare, including your wallet and the marketplace.',
  },
});

const Currency = () => {
  const { updateCurrency, loading } = useUpdateCurrency();
  const { currentUser } = useCurrentUserContext();
  const { hasActiveFiatBalance } = useFiatBalance();
  const { showEthWallet } = useWalletPreferences();
  if (!currentUser) return null;
  const { userSettings } = currentUser;

  const { currency, fiatCurrency } = userSettings;

  const currencies = Object.values(CurrencyType).map(v => ({
    label: v.toString(),
    value: v,
  }));

  const selectedCurrency = currencies.find(c => c.value === currency);
  const fiatCurrencies = Object.values(FiatCurrency).map(v => ({
    label: v.toString(),
    value: v,
  }));

  const selectedFiatCurrency = fiatCurrencies.find(
    c => c.value === fiatCurrency
  );

  if (!showEthWallet && hasActiveFiatBalance) return null;

  return (
    <SettingsSection title={messages.title}>
      {showEthWallet && (
        <StyledFormControlLabel
          control={
            <Select
              menuLateralAlignment="right"
              icon={faChevronDown}
              value={selectedCurrency}
              onChange={updateCurrency('currency')}
              options={currencies}
              isDisabled={loading}
            />
          }
          label={
            <Label>
              <Text16 color="var(--c-neutral-1000)">
                <FormattedMessage {...userAttributes.currency} />
              </Text16>
              <Text16 color="var(--c-neutral-600)">
                <FormattedMessage {...messages.currencyDetails} />
              </Text16>
            </Label>
          }
          labelPlacement="start"
        />
      )}
      {!hasActiveFiatBalance && (
        <StyledFormControlLabel
          control={
            <Select
              menuLateralAlignment="right"
              icon={faChevronDown}
              value={selectedFiatCurrency}
              onChange={updateCurrency('fiatCurrency')}
              options={fiatCurrencies}
              isDisabled={loading}
            />
          }
          label={
            <Label>
              <Text16 color="var(--c-neutral-1000)">
                <FormattedMessage {...userAttributes.fiatCurrency} />
              </Text16>
              <Text16 color="var(--c-neutral-600)">
                <FormattedMessage {...messages.fiatCurrencyDetails} />
              </Text16>
            </Label>
          }
          labelPlacement="start"
        />
      )}
    </SettingsSection>
  );
};

export default Currency;
