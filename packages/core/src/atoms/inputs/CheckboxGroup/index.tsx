import { ChangeEvent } from 'react';
import styled from 'styled-components';

import Checkbox from '../Checkbox';

const Label = styled.label<{ rounded: boolean }>`
  border-radius: ${({ rounded }) => (rounded ? 'var(--unit)' : 0)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--double-unit);
  white-space: nowrap;
  cursor: pointer;
  font-size: 16px;
  padding: var(--half-unit) var(--unit) var(--half-unit) var(--double-unit);
  &:hover {
    background: var(--c-neutral-300);
  }
`;

type Props<T> = {
  options: { value: T; label: JSX.Element }[];
  selectedValues: T[];
  rounded?: boolean;
  onChange: (values: T[]) => void;
};
const CheckboxGroup = <T extends string>({
  options,
  selectedValues,
  rounded = false,
  onChange,
}: Props<T>) => {
  const onSelectValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value: currentValue } = e.target;
    const newValues = checked
      ? [...selectedValues, currentValue as T]
      : selectedValues.filter(value => value !== currentValue);

    onChange(newValues);
  };

  return (
    <div>
      {options?.map(option => (
        <Label key={option.value} rounded={rounded}>
          {option?.label}
          <Checkbox
            value={option.value}
            checked={!!selectedValues?.find(value => option.value === value)}
            onChange={onSelectValue}
          />
        </Label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
