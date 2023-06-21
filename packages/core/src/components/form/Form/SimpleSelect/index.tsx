import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { FormEventHandler, ReactNode } from 'react';
import styled from 'styled-components';

import Dropdown, { DropdownOptionLabel } from '@core/atoms/dropdowns/Dropdown';
import { Text16 } from '@core/atoms/typography';
import FormLabel from '@core/components/form/FormLabel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectedLabel = styled(Text16)`
  flex: 1;
  text-align: left;
`;

const Button = styled(Text16).attrs({
  as: 'button',
  type: 'button',
})<{ isDisabled?: boolean }>`
  display: flex;
  flex: 1;
  gap: var(--unit);
  align-items: center;
  justify-content: flex-start;
  pointer-events: ${props => (props.isDisabled ? 'none' : 'auto')};
  border: 1px solid var(--c-neutral-300);
  padding: 0 var(--double-unit);
  height: 48px;
  border-radius: var(--double-unit);
  color: var(--c-neutral-1000);
  background: var(--c-neutral-300);
  &.disabled {
    cursor: initial;
    pointer-events: none;
    background: var(--c-neutral-200);
    & > * {
      opacity: 0.5;
    }
  }
`;

export type SimpleSelectOption = {
  label: string | ReactNode;
  value: string;
};
export interface Props {
  options: SimpleSelectOption[];
  value?: string;
  onChange?: FormEventHandler<HTMLFormElement>;
  label?: ReactNode | string;
  isDisabled?: boolean;
  name: string;
  darkTheme?: boolean;
  required?: boolean;
}
const SimpleSelect = ({
  name,
  options,
  value,
  onChange,
  label,
  isDisabled,
  darkTheme,
  required = false,
}: Props) => {
  const getLabel = () => {
    if (!label) {
      return null;
    }
    if (typeof label === 'string') {
      return (
        <FormLabel id={name} required={required}>
          {label}
        </FormLabel>
      );
    }
    return label;
  };
  return (
    <Container>
      {getLabel()}
      <Dropdown
        darkTheme={darkTheme}
        closeOnChange
        label={
          <Button
            className={classNames({
              disabled: isDisabled,
            })}
          >
            <SelectedLabel>
              {
                (options.find(option => option.value === value) || options[0])
                  ?.label
              }
            </SelectedLabel>
            <FontAwesomeIcon icon={faAngleDown} className="dropdown-icon" />
          </Button>
        }
        onChange={onChange}
      >
        <>
          {options.map(option => {
            return (
              <DropdownOptionLabel
                key={option.value}
                className={classNames({
                  selected: value === option.value,
                })}
              >
                {option.label}
                <input
                  name={name}
                  type="radio"
                  value={option.value}
                  defaultChecked={value === option.value}
                  className="sr-only"
                />
              </DropdownOptionLabel>
            );
          })}
        </>
      </Dropdown>
    </Container>
  );
};

export default SimpleSelect;
