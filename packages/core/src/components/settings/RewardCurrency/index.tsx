import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Currency, FiatWalletAccountState } from '__generated__/globalTypes';
import RadioGroup from '@core/atoms/inputs/RadioGroup';
import { Text14, Text16 } from '@core/atoms/typography';
import { NeedsValidatedFiatWalletHelper } from '@core/components/fiatWallet/NeedsValidatedFiatWalletHelper';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';

import SettingsSection from '../SettingsSection';
import useUpdateRewardCurrency from './useUpdateRewardCurrency';

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  padding-right: var(--double-unit);
  width: 100%;
`;

const messages = defineMessages({
  title: {
    id: 'Settings.rewardCurrency.title',
    defaultMessage: 'Competition rewards',
  },
  field: {
    id: 'Settings.rewardCurrency.field',
    defaultMessage: 'Receive rewards in',
  },
});

export const RewardCurrency = () => {
  const {
    currentUser,
    fiatCurrency: { code },
    walletPreferences: { showEthWallet, showFiatWallet },
  } = useCurrentUserContext();
  const { canDepositAndWithdraw } = useFiatBalance();

  const userRewardCurrency = currentUser?.userSettings?.rewardCurrency;

  const { updateRewardCurrency } = useUpdateRewardCurrency();

  const onChange = (value: Currency) => {
    updateRewardCurrency(value);
  };

  if (!currentUser) return null;

  const rewardCurrency = userRewardCurrency || Currency.ETH;

  const options = [
    {
      value: Currency.FIAT,
      label: (
        <Group>
          <Text16 color="var(--c-neutral-1000)">{code}</Text16>
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="settings.rewardCurrency.cash.helper"
              defaultMessage="Rewards will be added to your Cash Wallet"
            />
          </Text14>
        </Group>
      ),
      helper: (
        <NeedsValidatedFiatWalletHelper
          canListAndTradeHelper={
            <FormattedMessage
              id="settings.rewardCurrency.cash.kyc.canListAndTrade"
              defaultMessage="To receive cash rewards you must verify your identity by adding a government ID."
            />
          }
          defaultHelper={
            <FormattedMessage
              id="settings.rewardCurrency.cash.kyc.canNotListAndTrade"
              defaultMessage="To receive cash rewards you must activate your Cash Wallet and verify your identity by adding a government ID."
            />
          }
          statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
          withPadding
        />
      ),
      disabled: !canDepositAndWithdraw,
    },
    {
      value: Currency.ETH,
      label: <Text16 color="var(--c-neutral-1000)">ETH</Text16>,
    },
  ];
  if (!showEthWallet || !showFiatWallet) return null;

  return (
    <SettingsSection title={messages.title}>
      <RadioGroup
        rounded
        withSpacing
        options={options}
        value={rewardCurrency || Currency.ETH}
        name="currency"
        onChange={onChange}
      />
    </SettingsSection>
  );
};
