import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Text18 } from '@sorare/core/src/atoms/typography';
import SettingsSection from 'components/settings/SettingsSection';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import { AddEthereumAccountForm } from './AddEthereumAccountForm';

const messages = defineMessages({
  title: {
    id: 'Settings.ethereumAccounts.title',
    defaultMessage: 'Ethereum account(s)',
  },
  description: {
    id: 'Settings.ethereumAccounts.description',
    defaultMessage: 'Link external Ethereum accounts to your Sorare account',
  },
  addEthereumAccount: {
    id: 'Settings.ethereumAccounts.linkEthereumAccount',
    defaultMessage: 'Link an Ethereum account',
  },
});

const header = { title: messages.title, description: messages.description };

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const EthereumAccounts = () => {
  const [showAddEthereumAccount, setShowAddEthereumAccount] =
    useState<boolean>(false);
  const { currentUser } = useCurrentUserContext();
  const { up: isTablet } = useScreenSize('tablet');
  const {
    flags: { useLinkEthereumAccount = false },
  } = useFeatureFlags();

  if (!currentUser) return null;
  if (!useLinkEthereumAccount) return null;

  const onClose = () => setShowAddEthereumAccount(false);

  const addresses = currentUser.accounts
    .map(a =>
      a.accountable.__typename === 'EthereumAccount' && !a.sorareManaged
        ? a.accountable.address
        : null
    )
    .filter(Boolean);

  return (
    <>
      <SettingsSection {...header}>
        {addresses.length > 0 && (
          <List>
            {addresses.map(address => (
              <li key={address}>
                <Text18>{address}</Text18>
              </li>
            ))}
          </List>
        )}
        <div>
          <Button
            small
            color="blue"
            onClick={() => setShowAddEthereumAccount(true)}
          >
            <FormattedMessage {...messages.addEthereumAccount} />
          </Button>
        </div>
      </SettingsSection>
      <Dialog
        open={showAddEthereumAccount}
        onClose={onClose}
        fullScreen={!isTablet}
        hideCloseButton
      >
        <AddEthereumAccountForm onSuccess={onClose} />
      </Dialog>
    </>
  );
};

export default EthereumAccounts;
