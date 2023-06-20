import { defineMessages } from 'react-intl';

import SettingsSection from '@sorare/core/src/components/settings/SettingsSection';

import DepositCardButton from 'components/wallet/DepositCard';

const messages = defineMessages({
  title: {
    id: 'Settings.depositCard.title',
    defaultMessage: 'Deposit Card',
  },
  description: {
    id: 'Settings.depositCard.description',
    defaultMessage:
      'Add Sorare Cards that are currently held in an external wallet.  This will allow you to use the Cards for Sorare fantasy games and list them on the marketplace.',
  },
});

const DepositCard = () => {
  return (
    <SettingsSection {...messages}>
      <div>
        <DepositCardButton />
      </div>
    </SettingsSection>
  );
};

export default DepositCard;
