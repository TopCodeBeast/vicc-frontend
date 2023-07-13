import classNames from 'classnames';
import { ReactElement } from 'react';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';

const Root = styled.div`
  display: flex;
  align-items: center;
  background: var(--c-neutral-300);
  border-radius: var(--quadruple-unit);
  padding: var(--half-unit);
`;
const Option = styled(Text16)<{ activeBackgroundColor?: string }>`
  flex: 1 1 0;
  cursor: pointer;
  padding: var(--half-unit) var(--double-unit);
  border-radius: var(--quadruple-unit);
  text-align: center;
  color: var(--c-neutral-800);
  &.active {
    background: ${({ activeBackgroundColor = 'var(--c-neutral-100)' }) =>
      activeBackgroundColor};
    color: var(--c-neutral-1000);
  }
`;

interface Props<T> {
  options: {
    value: T;
    label: string | ReactElement;
  }[];
  value: T;
  handleChange: (t: T) => void;
  activeBackgroundColor?: string;
  backgroundColor?: string;
  color?: string;
}

export const RadioButtons = <T extends string>({
  options,
  value,
  handleChange,
  activeBackgroundColor,
  backgroundColor,
  color,
}: Props<T>) => {
  return (
    <Root style={{ backgroundColor, color }}>
      {options.map(option => (
        <Option
          key={option.value}
          onClick={() => handleChange(option.value)}
          className={classNames({ active: option.value === value })}
          activeBackgroundColor={activeBackgroundColor}
        >
          {option.label}
        </Option>
      ))}
    </Root>
  );
};
export default RadioButtons;
