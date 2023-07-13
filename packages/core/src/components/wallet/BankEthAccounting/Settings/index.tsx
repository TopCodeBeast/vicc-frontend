import { FormControlLabel } from '@material-ui/core';
import { ReactNode, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Currency as CurrencyType,
  EnabledWallet,
} from '__generated__/globalTypes';
import IconButton from '@core/atoms/buttons/IconButton';
import { ChevronRightBold } from '@core/atoms/icons/ChevronRightBold';
import RadioGroup from '@core/atoms/inputs/RadioGroup';
import Switch from '@core/atoms/inputs/Switch';
import { Caption, Text14, Text16 } from '@core/atoms/typography';
import FilterInDropdown from '@core/components/FilterInDropdown';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useWalletContext } from '@core/contexts/wallet';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import useToggleHideBalance from '@core/hooks/useToggleHideBalance';
import useUpdateCurrency from '@core/hooks/useUpdateCurrency';
import useEnableWallets from '@core/hooks/wallets/useEnableWallets';
import { fromWei } from '@core/lib/wei';

const Wrapper = styled.div``;
const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Field = styled(FormControlLabel)<{ $flexStart?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: ${({ $flexStart }) => ($flexStart ? 'flex-start' : 'center')};
  cursor: pointer;
  margin-left: 0;
  margin-right: 0;
  padding: var(--double-unit) 0;
  border-bottom: 1px solid var(--c-neutral-300);
`;

const Label = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const ItemRoot = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

enum WalletsForReward {
  CASH = 'cash',
  ETH = 'eth',
}

type ItemProps = {
  title: ReactNode;
  desc: ReactNode;
};

const Item = ({ title, desc }: ItemProps) => (
  <ItemRoot>
    <Text16 bold color="var(--c-neutral-1000)">
      {title}
    </Text16>
    <Text14 as="span" color="var(--c-neutral-600)">
      {desc}
    </Text14>
  </ItemRoot>
);

const messages = defineMessages({
  [WalletsForReward.CASH]: {
    id: 'walletsForReward.cash.label',
    defaultMessage: 'Cash',
  },
  [WalletsForReward.ETH]: {
    id: 'walletsForReward.eth.label',
    defaultMessage: 'Ethereum',
  },
});
const walletsForReward = [
  {
    title: (
      <Text16 bold color="var(--c-neutral-1000)">
        <FormattedMessage {...messages[WalletsForReward.CASH]} />
      </Text16>
    ),
    label: (
      <Item
        title={<FormattedMessage {...messages[WalletsForReward.CASH]} />}
        desc={
          <FormattedMessage
            id="walletsForReward.cash.helper"
            defaultMessage="Rewards will appear in your cash balance"
          />
        }
      />
    ),
    value: WalletsForReward.CASH,
  },
  {
    title: (
      <Text16 bold color="var(--c-neutral-1000)">
        <FormattedMessage {...messages[WalletsForReward.ETH]} />
      </Text16>
    ),
    label: (
      <Item
        title={<FormattedMessage {...messages[WalletsForReward.ETH]} />}
        desc={
          <FormattedMessage
            id="walletsForReward.eth.helper"
            defaultMessage="Rewards will appear in your ETH balance"
          />
        }
      />
    ),
    value: WalletsForReward.ETH,
  },
];

const currenciesHelper = {
  [CurrencyType.ETH]: 'Ethereum',
  [CurrencyType.FIAT]: 'FIAT currency (USD, EUR, GBP)',
};

export const Settings = () => {
  const {
    flags: { useNewWallet = true },
  } = useFeatureFlags();
  const { prompt, promptDeposit } = useWalletContext();
  const { enableWallets: doEnableWallets, loading } = useEnableWallets();
  const [selectedWalletForReward, setSelectedWalletForReward] = useState(
    walletsForReward[0]
  );
  const { setCurrentTab, showWallet } = useWalletDrawerContext();
  const {
    currency,
    currentUser,
    walletPreferences: { showEthWallet, showFiatWallet },
  } = useCurrentUserContext();

  const { updateCurrency } = useUpdateCurrency();
  const updateConversionCurrency = updateCurrency('currency');

  const {
    hideBalance,
    toggleHideBalance,
    loading: toggleHideBalanceLoading,
  } = useToggleHideBalance();

  const currencies = Object.values(CurrencyType).map(v => ({
    label: <Item title={v.toString()} desc={currenciesHelper[v]} />,
    value: v,
    title: v.toString(),
  }));
  const selectedCurrency = currencies.find(c => c.value === currency)!;

  const doPromptPrivateKeyExport = () => {
    prompt(WalletTab.PRIVATE_KEY_EXPORT);
    showWallet();
    setCurrentTab(WalletTab.PRIVATE_KEY_EXPORT);
  };

  const doPromptDeposit = () => {
    promptDeposit();
    setCurrentTab(WalletTab.DEPOSIT);
  };

  if (!currentUser) return null;

  const { availableBalance } = currentUser;

  const enableWallets = async (bothWallets: boolean) => {
    await doEnableWallets(
      bothWallets
        ? [EnabledWallet.ETH, EnabledWallet.FIAT]
        : [EnabledWallet.FIAT]
    );
  };

  return (
    <Wrapper>
      <Row>
        <Section>
          <Text14 bold color="var(--c-neutral-1000)">
            <FormattedMessage
              id="bankEthAccounting.settings.display.title"
              defaultMessage="Display"
            />
          </Text14>
          <Field
            control={
              <Switch
                disabled={toggleHideBalanceLoading}
                checked={hideBalance}
                onChange={toggleHideBalance}
              />
            }
            label={
              <Text16 color="var(--c-neutral-1000)">
                <FormattedMessage
                  id="bankEthAccounting.settings.hideBalance"
                  defaultMessage="Hide balance"
                />
              </Text16>
            }
            labelPlacement="start"
          />
        </Section>
        <Section>
          <Text14 bold color="var(--c-neutral-1000)">
            <FormattedMessage
              id="bankEthAccounting.settings.ethereumWallet.title"
              defaultMessage="Ethereum wallet"
            />
          </Text14>
          {useNewWallet && (
            <Field
              $flexStart
              control={
                <Switch
                  checked={showEthWallet}
                  onChange={() => {
                    enableWallets(!showEthWallet);
                  }}
                  disabled={loading}
                />
              }
              label={
                <Label>
                  <div>
                    <Text16 color="var(--c-neutral-1000)">
                      <FormattedMessage
                        id="bankEthAccounting.settings.ethereumWallet.label"
                        defaultMessage="Enable Ethereum wallet"
                      />
                    </Text16>
                    <Text14 color="var(--c-neutral-600)">
                      <FormattedMessage
                        id="bankEthAccounting.settings.ethereumWallet.balance"
                        defaultMessage="Current balance: {balance} ETH"
                        values={{
                          balance: fromWei(availableBalance, 4),
                        }}
                      />
                    </Text14>
                  </div>
                  <Caption color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="bankEthAccounting.settings.ethereumWallet.helper"
                      defaultMessage="Allows you to sell a card for ETH and receive tournament rewards in ETH."
                    />
                  </Caption>
                </Label>
              }
              labelPlacement="start"
            />
          )}
          {showEthWallet && (
            <>
              <Field
                control={
                  <FilterInDropdown buttonLabel={selectedCurrency?.title}>
                    {({ closeDropdown }) => (
                      <RadioGroup
                        options={currencies}
                        value={selectedCurrency?.value}
                        name="update-conversion-currency"
                        onChange={(value: string) => {
                          updateConversionCurrency(
                            currencies.find(c => c.value === value)!
                          );
                          closeDropdown();
                        }}
                      />
                    )}
                  </FilterInDropdown>
                }
                label={
                  <Text16 color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="bankEthAccounting.settings.currency"
                      defaultMessage="Eth wallet currency"
                    />
                  </Text16>
                }
                labelPlacement="start"
              />
              <Field
                control={
                  <IconButton onClick={doPromptPrivateKeyExport}>
                    <ChevronRightBold color="var(--c-neutral-1000)" />
                  </IconButton>
                }
                label={
                  <Text16 color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="bankEthAccounting.settings.privateKey"
                      defaultMessage="Export your ETH wallet private key"
                    />
                  </Text16>
                }
                labelPlacement="start"
              />
              <Field
                control={
                  <IconButton onClick={doPromptDeposit}>
                    <ChevronRightBold color="var(--c-neutral-1000)" />
                  </IconButton>
                }
                label={
                  <Text16 color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="NewWalletDrawer.deposit"
                      defaultMessage="Deposit available funds"
                    />
                  </Text16>
                }
                labelPlacement="start"
              />
            </>
          )}
        </Section>
        {useNewWallet && showEthWallet && showFiatWallet && (
          <Section>
            <Text14 bold color="var(--c-neutral-1000)">
              <FormattedMessage
                id="bankEthAccounting.settings.rewards.title"
                defaultMessage="Tournament rewards"
              />
            </Text14>
            <Field
              control={
                <FilterInDropdown buttonLabel={selectedWalletForReward?.title}>
                  {({ closeDropdown }) => (
                    <RadioGroup
                      options={walletsForReward}
                      value={selectedWalletForReward?.value}
                      name="select-wallet-for-reward"
                      onChange={(value: string) => {
                        setSelectedWalletForReward(
                          walletsForReward.find(w => w.value === value)!
                        );
                        closeDropdown();
                      }}
                    />
                  )}
                </FilterInDropdown>
              }
              label={
                <Text16 color="var(--c-neutral-1000)">
                  <FormattedMessage
                    id="bankEthAccounting.settings.rewardsCurrency"
                    defaultMessage="Receive rewards in"
                  />
                </Text16>
              }
              labelPlacement="start"
            />
          </Section>
        )}
      </Row>
    </Wrapper>
  );
};
