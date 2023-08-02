import { SelectHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

const CARET_SVG = `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M 2 4 L 6 8 L 10 4' stroke-linecap='round' stroke='%238B8F96' stroke-width='2' /%3E%3C/svg%3E"`;

const Select = styled.select<{ $fullWidth?: boolean; $filled?: boolean }>`
  appearance: none;
  height: 40px;
  border-radius: 40px;
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  font-size: 16px;
  color: var(--c-neutral-600);
  ${({ $filled }) =>
    $filled &&
    css`
      font-weight: bold;
      color: var(--c-neutral-1000);
    `}
  border: 1px solid;
  border-color: var(--c-neutral-300);
  .dark-theme & {
    border-color: var(--c-neutral-400);
  }
  background-color: transparent;
  background-image: url(${CARET_SVG});
  background-repeat: no-repeat;
  background-position: right var(--unit) center;
  background-size: var(--double-unit);
  padding: 0 var(--quadruple-unit) 0 var(--intermediate-unit);

  cursor: pointer;

  &:hover {
    background-color: var(--c-neutral-200);
  }
`;

type Props = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange' | 'value'
> & {
  values: Array<{ value: string; label: string }>;
  placeholder?: string;
  fullWidth?: boolean;
  name?: string;
  value: string;
  onChange: (newValue: string) => void;
};

export const NativeSelect = ({
  values,
  value: selectValue,
  name,
  fullWidth,
  placeholder,
  onChange,
}: Props) => (
  <Select
    $fullWidth={fullWidth}
    $filled={Boolean(selectValue)}
    value={selectValue}
    name={name}
    aria-label={placeholder}
    onChange={e => onChange(e.target.value)}
  >
    <option value="" disabled>
      {placeholder}
    </option>
    {values.map(({ value, label }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </Select>
);
