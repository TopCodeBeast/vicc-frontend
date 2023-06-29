import { useIntl } from 'react-intl';

import TextAreaWithCharactersCounts from '@sorare/core/src/components/form/Form/TextAreaWithCharactersCount';

import { FieldWrapper } from '@football/components/userGroup/form/FieldWrapper';

type Props = { defaultValue?: string };
export const DescriptionInput = ({ defaultValue }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <FieldWrapper>
      <TextAreaWithCharactersCounts
        id="newUserGroupDescription"
        name="description"
        placeholder={formatMessage({
          id: 'UserGroups.create.descriptionPlaceholder',
          defaultMessage:
            'Welcome to my Private League. Top the league to prove who knows football best!',
        })}
        maxLength={140}
        label={formatMessage({
          id: 'UserGroups.create.description',
          defaultMessage: 'Description',
        })}
        defaultValue={defaultValue}
      />
    </FieldWrapper>
  );
};

export default DescriptionInput;
