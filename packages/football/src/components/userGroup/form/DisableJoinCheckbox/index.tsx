import { useIntl } from 'react-intl';

import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';

import { FieldWrapper } from '@football/components/userGroup/form/FieldWrapper';

type Props = { checked: boolean; onChange: () => void };
export const DisableJoinCheckbox = ({ checked, onChange }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <FieldWrapper>
      <Checkbox
        name="joinDisabled"
        label={formatMessage({
          id: 'UserGroups.update.joinDisabled',
          defaultMessage: 'Close league for new entrants',
        })}
        checked={checked}
        onChange={onChange}
      />
    </FieldWrapper>
  );
};

export default DisableJoinCheckbox;
