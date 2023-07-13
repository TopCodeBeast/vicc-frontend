import styled from 'styled-components';

import Switch from '@core/atoms/inputs/Switch';
import { Caption, Text16 } from '@core/atoms/typography';
import FormLabel from '@core/components/form/FormLabel';

import Field from '../Field';

export interface Props {
  name: string;
  defaultValue: boolean;
  label: string;
  helperText?: string;
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SwitchField = ({
  name,
  defaultValue,
  label,
  helperText,
}: Props) => {
  return (
    <Field
      name={name}
      defaultValue={defaultValue ? SwitchField.ON : SwitchField.OFF}
      render={({ error, handleChange, value }) => {
        return (
          <>
            <Row>
              <div>
                <FormLabel id={name}>{label}</FormLabel>
                {helperText && (
                  <Caption color="var(--c-neutral-600)">{helperText}</Caption>
                )}
              </div>
              <Switch
                checked={value === SwitchField.ON}
                onChange={e => {
                  handleChange(name)({
                    target: {
                      value: e.target.checked
                        ? SwitchField.ON
                        : SwitchField.OFF,
                    },
                  });
                }}
              />
            </Row>

            {error && <Text16 color="var(--c-red-600)">{error}</Text16>}
          </>
        );
      }}
    />
  );
};

// The Field component is dealing with strings only, so we introduce 2 string values
// to deal with the boolean state of the switch
SwitchField.ON = 'on';
SwitchField.OFF = 'off';

export default SwitchField;
