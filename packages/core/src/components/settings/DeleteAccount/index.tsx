import { FormattedMessage, defineMessages } from 'react-intl';

import { Text14, Title4, Title5 } from '@sorare/core/src/atoms/typography';
import { GraphQLResult, GraphqlForm } from 'components/form/Form';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';

import SettingsSection from '../SettingsSection';
import useDestroyAccount from './useDestroyAccount';

const messages = defineMessages({
  title: {
    id: 'Settings.deleteAccount.title',
    defaultMessage: 'Delete Account',
  },
  description: {
    id: 'Settings.deleteAccount.description',
    defaultMessage:
      'Permanently destroy your Sorare account and history of account data. This cannot be undone.',
  },
  cta: {
    id: 'Settings.deleteAccount.cta',
    defaultMessage: 'Delete Account',
  },
  dialogTitle: {
    id: 'Settings.deleteAccount.dialogTitle',
    defaultMessage: 'Delete Account',
  },
  dialogSubtitle: {
    id: 'Settings.deleteAccount.dialogSubtitle',
    defaultMessage: 'Are you sure you want to delete your account?',
  },
  dialogDescription: {
    id: 'Settings.deleteAccount.dialogDescription',
    defaultMessage:
      'The deletion of your account will result in the irreversible deletion of all User data associated with the account within 30 days. You must save any Collectibles and Cryptocurrencies stored on the Wallet to an external wallet before any deletion request. Any Collectibles and/or Cryptocurrency stored on your Wallet that have not been transferred out of your account at the date of deletion will be permanently irretrievable. Sorare will not be responsible for the permanent loss of any Collectibles and/or Cryptocurrency that was not saved prior to a deletion request.',
  },
  dialogCta: {
    id: 'Settings.deleteAccount.dialogCta',
    defaultMessage: 'Delete Account',
  },
});

const DeleteAccount = () => {
  const destroyAccount = useDestroyAccount();
  const { getPassword, logOut } = useWalletContext();

  const submitDeleteAccount = async (
    attributes: any,
    doOnResult: (result: GraphQLResult) => void
  ) => {
    const currentPasswordHash = await getPassword();
    if (!currentPasswordHash) return;

    const { data } = await destroyAccount({ password: currentPasswordHash });

    if (data) {
      doOnResult(data.destroyAccount!);
      // make sure we clean up any leftovers from the user
      window.location.reload();
    }
  };
  return (
    <GraphqlForm
      onSubmit={(attributes, doOnResult) => {
        submitDeleteAccount(attributes, doOnResult);
      }}
      onSuccess={() => {
        logOut();
      }}
      askForConfirmation
      dialogTitle={
        <Title4>
          <FormattedMessage {...messages.dialogTitle} />
        </Title4>
      }
      dialogSubtitle={
        <Title5>
          <FormattedMessage {...messages.dialogSubtitle} />
        </Title5>
      }
      confirmationMessage={
        <Text14>
          <FormattedMessage {...messages.dialogDescription} />
        </Text14>
      }
      dialogCta={<FormattedMessage {...messages.dialogCta} />}
      dialogCtaProps={{ stroke: true, color: 'red' }}
      render={(Error, SubmitButton) => (
        <SettingsSection {...messages}>
          <Error code />
          <div>
            <SubmitButton stroke medium={false} small color="red">
              <FormattedMessage {...messages.cta} />
            </SubmitButton>
          </div>
        </SettingsSection>
      )}
    />
  );
};

export default DeleteAccount;
