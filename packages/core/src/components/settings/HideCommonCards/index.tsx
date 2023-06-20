import { defineMessages } from 'react-intl';

import Switch from '@sorare/core/src/atoms/inputs/Switch';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { GraphQLError, formatGqlErrors } from '@sorare/core/src/lib/gql';

import SettingsSection from '../SettingsSection';
import useToggleHideCommonCards from './useToggleHideCommonCards';

const messages = defineMessages({
  title: {
    id: 'Settings.hideCommonCard.title',
    defaultMessage: 'Common Cards',
  },
  description: {
    id: 'Settings.hideCommonCard.description',
    defaultMessage: 'Always hide Commons in galleries',
  },
});

const HideCommonCards = () => {
  const { currentUser } = useCurrentUserContext();
  const toggleHideCommonCards = useToggleHideCommonCards();
  const { showNotification } = useSnackNotificationContext();

  const switchHideCommonCards = async () => {
    const result = await toggleHideCommonCards();

    if (result?.errors?.length) {
      showNotification('errors', {
        errors: formatGqlErrors(result.errors as GraphQLError[]),
      });
    }
  };

  if (!currentUser) return null;

  return (
    <SettingsSection
      title={messages.title}
      description={messages.description}
      toggleButton={
        <Switch
          checked={currentUser?.userSettings?.hideCommonCards}
          onChange={() => {
            switchHideCommonCards();
          }}
        />
      }
    />
  );
};

export default HideCommonCards;
