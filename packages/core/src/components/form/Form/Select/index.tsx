import { FormEventHandler } from 'react';

import { Text16 } from '@sorare/core/src/atoms/typography';
import SimpleSelect, {
  SimpleSelectOption,
  Props as SimpleSelectProps,
} from 'components/form/Form/SimpleSelect';

import Field from '../Field';

interface Props extends SimpleSelectProps {
  name: string;
  id: string;
  initialValue?: SimpleSelectOption;
  onChange?: FormEventHandler<HTMLFormElement>;
  darkTheme?: boolean;
  required?: boolean;
}

export const Select = ({
  name,
  label,
  id,
  options,
  initialValue,
  onChange,
  required = false,
  ...rest
}: Props) => {
  if (!options.length) {
    return null;
  }

  return (
    <Field
      name={name}
      defaultValue={initialValue?.value}
      render={({ error, handleChange, value }) => {
        const selectedOption =
          options.find(option => option.value === value) || initialValue;
        return (
          <>
            <SimpleSelect
              name={id || name}
              options={options}
              value={selectedOption?.value}
              label={label}
              required={required}
              {...rest}
              onChange={e => {
                if (onChange) {
                  onChange(e);
                }

                const newValue = (e.target as HTMLInputElement)?.value;
                handleChange(name)({
                  target: { value: newValue },
                });
              }}
            />
            {error && <Text16 color="var(--c-red-600)">{error}</Text16>}
          </>
        );
      }}
    />
  );
};

export default Select;
