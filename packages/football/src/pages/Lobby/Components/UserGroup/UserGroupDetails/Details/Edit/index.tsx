import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  GraphQLResult,
  GraphqlForm,
} from '@sorare/core/src/components/form/Form';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import useToggle from '@sorare/core/src/hooks/useToggle';

import AvatarInput from '@football/components/userGroup/form/AvatarInput';
import DescriptionInput from '@football/components/userGroup/form/DescriptionInput';
import DisableJoinCheckbox from '@football/components/userGroup/form/DisableJoinCheckbox';
import NameInput from '@football/components/userGroup/form/NameInput';

import useUpdateSo5UserGroup from './useUpdateSo5UserGroup';

const StyledGraphqlForm = styled(GraphqlForm)`
  margin: 0;
  text-align: left;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-content: start;
  justify-content: flex-start;
  gap: var(--double-unit);
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const AvatarWrapper = styled.div`
  align-self: start;
`;

type Props = {
  UserGroupId: string;
  displayName: string;
  description: string;
  pictureUrl: string;
  joinDisabled: boolean;
  Scoring: ReactNode;
};
const Edit = ({
  UserGroupId,
  displayName,
  description,
  pictureUrl,
  joinDisabled,
  Scoring,
}: Props) => {
  const { showNotification } = useSnackNotificationContext();
  const updateSo5UserGroup = useUpdateSo5UserGroup();
  const [logoId, setLogoId] = useState<string>();
  const [joinDisabledValue, toggleJoinDisabled] = useToggle(joinDisabled);

  const onSelectNewSkin = (skinId: string) => setLogoId(skinId);

  type updateUserGroupProps = {
    displayName: string;
    description: string;
  };
  const updateUserGroup = async (
    props: updateUserGroupProps,
    onResult: (result: GraphQLResult) => void
  ) => {
    onResult(
      await updateSo5UserGroup({
        so5UserGroupId: UserGroupId,
        displayName: props.displayName,
        description: props.description,
        joinDisabled: joinDisabledValue,
        logoId,
      })
    );
  };

  const onSuccess = () => {
    showNotification('so5UserGroupUpdated');
  };

  return (
    <StyledGraphqlForm
      onSubmit={(props, onResult) => {
        updateUserGroup(props, onResult);
      }}
      onSuccess={onSuccess}
      render={(Error, SubmitButton) => (
        <FormWrapper>
          <AvatarWrapper>
            <AvatarInput
              onSelectNewSkin={onSelectNewSkin}
              defaultValue={pictureUrl}
              id="updateUserGroupInput"
            />
          </AvatarWrapper>
          <NameInput defaultValue={displayName} />
          <DescriptionInput defaultValue={description} />
          {Scoring}
          <DisableJoinCheckbox
            checked={joinDisabledValue}
            onChange={toggleJoinDisabled}
          />
          <Error />
          <ButtonWrapper>
            <SubmitButton color="black">
              <FormattedMessage
                id="UserGroups.update.cta"
                defaultMessage="Update"
              />
            </SubmitButton>
          </ButtonWrapper>
        </FormWrapper>
      )}
    />
  );
};

export default Edit;
