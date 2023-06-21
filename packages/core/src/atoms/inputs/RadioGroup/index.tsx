import classnames from 'classnames';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import { Title6 } from '@core/atoms/typography';

import { Radio } from '../Radio';

const Root = styled.div<{ withSpacing: boolean }>`
  ${({ withSpacing }) =>
    withSpacing &&
    `
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`}
`;
const Helper = styled.div`
  padding: 0 var(--double-unit) var(--double-unit) !important;
`;

const RadioWrapper = styled.div<{
  checked: boolean;
  rounded: boolean;
}>`
  background: var(--c-neutral-200);
  border-radius: ${({ rounded }) => (rounded ? 'var(--unit)' : 0)};
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

  &.modal {
    background: var(--c-neutral-200);
    &:hover,
    &:focus-within {
      background: var(--c-neutral-200);
      .dark-theme & {
        background: var(--c-neutral-200);
      }
    }
    &.checked {
      background: var(--c-neutral-100);
      .dark-theme & {
        background: var(--c-neutral-200);
      }
    }
  }
`;

type Props<T> = {
  options: { label: string | ReactNode; value: T; helper?: ReactNode }[];
  name: string;
  value?: T;
  initiallySelectedValue?: T;
  rounded?: boolean;
  onChange: (value: T) => void;
  forceLightTheme?: boolean;
  modal?: boolean;
  withSpacing?: boolean;
};

export const RadioGroup = <T extends string>({
  options,
  initiallySelectedValue,
  value,
  name,
  rounded = false,
  modal = false,
  withSpacing = false,
  onChange,
}: Props<T>) => {
  const isManagedMode = value !== undefined;
  const [selectedValue, setSelectedValue] = useState(
    initiallySelectedValue || options[0].value
  );

  return (
    <Root withSpacing={withSpacing}>
      {options.map(option => {
        const checked = isManagedMode
          ? value === option.value
          : selectedValue === option.value;
        return (
          <RadioWrapper
            className={classnames({ checked, modal })}
            key={option.value}
            checked={checked}
            rounded={rounded}
          >
            <Radio
              name={name}
              checked={checked}
              value={option.value}
              onChange={() => {
                if (!isManagedMode) setSelectedValue(option.value);
                onChange(option.value);
              }}
              labelContent={
                typeof option.label === 'string' ? (
                  <Title6
                    color={
                      checked ? 'var(--c-neutral-1000)' : 'var(--c-neutral-600)'
                    }
                  >
                    {option.label}
                  </Title6>
                ) : (
                  option.label
                )
              }
            />
            {option?.helper && <Helper>{option.helper}</Helper>}
          </RadioWrapper>
        );
      })}
    </Root>
  );
};

export default RadioGroup;
