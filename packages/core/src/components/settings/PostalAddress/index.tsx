import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import LoadingButton from '@core/atoms/buttons/LoadingButton';
import PostalAddressFormDumb from '@core/components/settings/PostalAddressForm';
import SettingsSection from '@core/components/settings/SettingsSection';
import { glossary } from '@core/lib/glossary';

import useDeleteUserPostalAddress from './useDeleteUserPostalAddress';
import useUpdateUserPostalAddress from './useUpdateUserPostalAddress';

const ButtonWrapper = styled.div`
  display: flex;
  gap: var(--unit);
  justify-content: flex-end;
`;
const messages = defineMessages({
  title: {
    id: 'Settings.PostalAddress.title',
    defaultMessage: 'Postal address',
  },
});

const PostalAddress = () => {
  const { deleteUserPostalAddress, loading } = useDeleteUserPostalAddress();
  const updateUserPostalAddress = useUpdateUserPostalAddress();
  return (
    <SettingsSection title={messages.title}>
      <PostalAddressFormDumb
        onSubmit={(attributes, onResult, onCancel) => {
          updateUserPostalAddress(attributes).then(onResult).catch(onCancel);
        }}
        onSuccess={() => {}}
        button={SubmitButton => (
          <ButtonWrapper>
            <LoadingButton
              loading={loading}
              color="red"
              medium
              onClick={() => {
                deleteUserPostalAddress();
              }}
            >
              <FormattedMessage {...glossary.delete} />
            </LoadingButton>
            <SubmitButton medium>
              <FormattedMessage {...glossary.update} />
            </SubmitButton>
          </ButtonWrapper>
        )}
      />
    </SettingsSection>
  );
};

export default PostalAddress;
