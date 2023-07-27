import { useIntl } from 'react-intl';

import TextAreaWithCharactersCounts from '@sorare/core/src/components/form/Form/TextAreaWithCharactersCount';

import { FieldWrapper } from '@football/components/userGroup/form/FieldWrapper';

type Props = { defaultValue?: string };
export const NameInput = ({ defaultValue }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <FieldWrapper>
      <TextAreaWithCharactersCounts
        id="newUserGroupName"
        name="displayName"
        label={formatMessage({
          id: 'UserGroups.create.name',
          defaultMessage: 'League name',
        })}
        rows={1}
        maxLength={32}
        placeholder={formatMessage({
          id: 'UserGroups.create.namePlaceholder',
          defaultMessage: 'My league',
        })}
        defaultValue={defaultValue}
        required
        short
      />
    </FieldWrapper>
  );
};

export default NameInput;
