import {
  faExclamationCircle,
  faTag,
  faTrophy,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { EnabledWallet } from '__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Text14, Text16, Title3 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import Dots from '@sorare/core/src/atoms/ui/Dots';
import EthBalance from 'components/wallet/EthBalance';
import FiatBalance from 'components/wallet/FiatBalance';
import { useCurrentUserContext } from 'contexts/currentUser';
import { WalletTab, useWalletDrawerContext } from 'contexts/walletDrawer';
import useEnableWallets from '@sorare/core/src/hooks/wallets/useEnableWallets';
import { fromWei } from '@sorare/core/src/lib/wei';

import ReinsuranceItem from '../ReinsuranceItem';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled(Column)`
  gap: var(--quadruple-unit);
`;

const Title = styled(Column)`
  gap: var(--unit);
  text-align: center;
`;
const Balance = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: var(--double-unit);
  > * {
    flex: 1;
    max-width: 50%;
  }
`;
const SelectWallets = styled.div`
  display: flex;
  width: 100%;
  gap: var(--double-unit);
  padding: var(--half-unit);
  border-radius: var(--triple-unit);
  border: 1px solid var(--c-neutral-1000);
`;
const StyledButton = styled(Button)`
  flex: 1;
`;

const Warning = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  padding: var(--unit);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-400);
`;

type Props = {
  onClose: () => void;
};

export const Setup = ({ onClose }: Props) => {
  const { setCurrentTab, showDrawer } = useWalletDrawerContext();
  const { currentUser } = useCurrentUserContext();
  const { enableWallets, loading } = useEnableWallets();
  const { availableBalance } = currentUser || {};
  const [selectedWallets, setSelectedWallets] = useState<EnabledWallet[]>([
    EnabledWallet.ETH,
    EnabledWallet.FIAT,
  ]);

  const hasChoosenBothWallet = selectedWallets.includes(EnabledWallet.ETH);

  const handleSubmit = async () => {
    await enableWallets(selectedWallets);
    onClose();
    showDrawer();
    setCurrentTab(WalletTab.HOME);
  };

  const displayedAvailableBalance = currentUser?.userSettings.hideBalance ? (
    <Dots count={7} size="small" />
  ) : (
    fromWei(availableBalance || '0')
  );

  return (
    <Wrapper>
      <Title>
        <Title3 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="walletSetup.setup.title"
            defaultMessage="Which balances would you like to see in your wallet?"
          />
        </Title3>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="walletSetup.setup.subtitle"
            defaultMessage="You can change it later in your wallet settings."
          />
        </Text16>
      </Title>
      <Balance>
        <FiatBalance />
        {hasChoosenBothWallet && <EthBalance ethFirst hideExponent />}
      </Balance>
      <SelectWallets>
        <StyledButton
          small
          color={hasChoosenBothWallet ? 'black' : 'transparent'}
          onClick={() =>
            setSelectedWallets([EnabledWallet.ETH, EnabledWallet.FIAT])
          }
        >
          <FormattedMessage
            id="walletSetup.setup.selectWallet.both"
            defaultMessage="Both"
          />
        </StyledButton>
        <StyledButton
          small
          color={!hasChoosenBothWallet ? 'black' : 'transparent'}
          onClick={() => setSelectedWallets([EnabledWallet.FIAT])}
        >
          <FormattedMessage
            id="walletSetup.setup.selectWallet.cash"
            defaultMessage="Cash"
          />
        </StyledButton>
      </SelectWallets>
      {hasChoosenBothWallet ? (
        <>
          <ReinsuranceItem
            icon={faTag}
            desc={
              <FormattedMessage
                id="walletSetup.setup.both.trade"
                defaultMessage="You’ll be able to accept ETH or FIAT currency as payment when you sell a card."
              />
            }
          />
          <ReinsuranceItem
            icon={faTrophy}
            desc={
              <FormattedMessage
                id="walletSetup.setup.both.reward"
                defaultMessage="You’ll be able to choose to receive ETH or FIAT currency as tournament rewards."
              />
            }
          />
        </>
      ) : (
        <>
          {availableBalance && (
            <Warning>
              <FontAwesomeIcon
                icon={faExclamationCircle}
                color="var(--c-yellow-600)"
              />
              <Text14 color="var(--c-yellow-600)">
                <FormattedMessage
                  id="walletSetup.setup.cash.warning"
                  defaultMessage="Your <b>{ availableBalance } ETH</b>  balance will remain in your Sorare wallet, it will just be hidden."
                  values={{
                    b: Bold,
                    availableBalance: displayedAvailableBalance,
                  }}
                />
              </Text14>
            </Warning>
          )}
          <ReinsuranceItem
            icon={faTag}
            desc={
              <FormattedMessage
                id="walletSetup.setup.cash.trade"
                defaultMessage="Only accept FIAT currency as payment when you sell a player card."
              />
            }
          />
          <ReinsuranceItem
            icon={faTrophy}
            desc={
              <FormattedMessage
                id="walletSetup.setup.cash.reward"
                defaultMessage="Only receive FIAT currency as tournament rewards."
              />
            }
          />
        </>
      )}
      <LoadingButton
        color="blue"
        medium
        fullWidth
        loading={loading}
        onClick={() => {
          handleSubmit();
        }}
      >
        <FormattedMessage
          id="walletSetup.setup.submit"
          defaultMessage="Confirm and go to my wallet"
        />
      </LoadingButton>
    </Wrapper>
  );
};
