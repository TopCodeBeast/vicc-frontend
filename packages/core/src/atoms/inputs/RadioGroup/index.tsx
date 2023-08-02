import classnames from 'classnames';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import { Title6 } from '@core/atoms/typography';

import { Radio } from '../Radio';

const Root = styled.div<{
  withSpacing: boolean;
  row: boolean;
  flexWrap: boolean;
}>`
  ${({ withSpacing }) =>
    withSpacing &&
    `
    display: flex;
    flex-direction: column;
    gap: var(--unit);
  `}
  ${({ row }) =>
    row &&
    `
    display: flex;
    flex-direction: row;
    gap: var(--double-unit);
    justify-content: space-between;
    & > * {
      flex: 1;
      text-align: center;
    }
  `}
  ${({ flexWrap }) =>
    flexWrap &&
    `
    flex-wrap: wrap;
    row-gap: var(--unit);
  `}
`;

const RadioWrapper = styled.div<{
  checked: boolean;
  rounded: boolean;
}>`
  background: var(--c-neutral-200);
  border-radius: ${({ rounded }) => (rounded ? 'var(--half-unit)' : 0)};
  color: var(--c-neutral-500);
  /* Select inner radio to make the padding clickable */
  > * {
    padding: var(--double-unit);
  }
  &:hover,
  &:focus-within {
    background: var(--c-neutral-300);
  }
  &.checked {
    background: var(--c-neutral-300);
    color: var(--c-brand-600);
  }
  &.ghost {
    color: var(--c-neutral-1000);
    background-color: var(--c-neutral-100);
  }
  &.ghost.checked {
    color: var(--c-neutral-1000);
    background-color: var(--c-brand-600);
  }

  &.border {
    border: 1px solid var(--c-neutral-400);
    border-radius: var(--unit);
    margin-bottom: var(--unit);
  }

  &.modal {
    background: var(--c-neutral-100);
    border: 1px solid var(--c-neutral-400);
    .dark-theme & {
      background: var(--c-neutral-200);
    }
    &.checked {
      background: var(--c-neutral-100);
      border-color: var(--c-brand-600);
      .dark-theme & {
        background: var(--c-neutral-200);
      }
    }
  }
  &.modalSelect {
    background: var(--c-neutral-300);
    .dark-theme & {
      background: var(--c-neutral-300);
    }
    &.checked {
      background: var(--c-neutral-400);
    }
    &:hover {
      background: var(--c-neutral-400);
    }
  }
`;

type Props<T> = {
  options: {
    label: string | ReactNode;
    value: T;
    helper?: ReactNode;
    disabled?: boolean;
  }[];
  name: string;
  value?: T;
  initiallySelectedValue?: T;
  rounded?: boolean;
  onChange: (value: T) => void;
  modal?: boolean;
  withSpacing?: boolean;
  modalSelect?: boolean;
  hideRadio?: boolean;
  border?: boolean;
  row?: boolean;
  ghost?: boolean;
  preventPreselection?: boolean;
  flexWrap?: boolean;
};

export const RadioGroup = <T extends string>({
  options,
  initiallySelectedValue,
  value,
  name,
  rounded = false,
  modal = false,
  withSpacing = false,
  border = false,
  onChange,
  modalSelect,
  hideRadio,
  row = false,
  ghost,
  preventPreselection,
  flexWrap = false,
}: Props<T>) => {
  const isManagedMode = value !== undefined;
  const [selectedValue, setSelectedValue] = useState(
    !preventPreselection
      ? initiallySelectedValue || options[0].value
      : undefined
  );

  return (
    <Root withSpacing={withSpacing} row={row} flexWrap={flexWrap}>
      {options.map(option => {
        const checked = isManagedMode
          ? value === option.value
          : selectedValue === option.value;
        return (
          <RadioWrapper
            className={classnames({
              checked,
              modal,
              modalSelect,
              border,
              ghost,
            })}
            key={option.value}
            checked={checked}
            rounded={rounded}
          >
            <Radio
              hideRadio={hideRadio}
              name={name}
              checked={checked}
              value={option.value}
              onChange={() => {
                if (!isManagedMode) setSelectedValue(option.value);
                onChange(option.value);
              }}
              labelContent={
                typeof option.label === 'string' ? (
                  <Title6>{option.label}</Title6>
                ) : (
                  option.label
                )
              }
              disabled={option.disabled}
            />
            {option.helper}
          </RadioWrapper>
        );
      })}
    </Root>
  );
};

export default RadioGroup;
