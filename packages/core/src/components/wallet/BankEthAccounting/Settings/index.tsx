import { FormControlLabel } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { EnabledWallet } from '__generated__/globalTypes';
import IconButton from '@core/atoms/buttons/IconButton';
import { ChevronRightBold } from '@core/atoms/icons/ChevronRightBold';
import Switch from '@core/atoms/inputs/Switch';
import { Caption, Text14, Text16 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useWalletContext } from '@core/contexts/wallet';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import useToggleHideBalance from '@core/hooks/useToggleHideBalance';
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

export const Settings = () => {
  const {
    flags: { useCashWallet = true },
  } = useFeatureFlags();
  const { prompt, promptDeposit } = useWalletContext();
  const { enableWallets: doEnableWallets, loading } = useEnableWallets();

  const { setCurrentTab, showWallet } = useWalletDrawerContext();
  const {
    currentUser,
    walletPreferences: { showEthWallet },
  } = useCurrentUserContext();

  const {
    hideBalance,
    toggleHideBalance,
    loading: toggleHideBalanceLoading,
  } = useToggleHideBalance();

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
              defaultMessage="ETH wallet"
            />
          </Text14>
          {useCashWallet && (
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
                        defaultMessage="Show ETH Wallet"
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
                      defaultMessage="You can use ETH when buying or selling cards, and receive tournament rewards in ETH. Also, you can use funds in your Cash Wallet."
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
      </Row>
    </Wrapper>
  );
};
