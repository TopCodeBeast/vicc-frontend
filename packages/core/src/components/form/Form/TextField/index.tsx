import { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { Caption } from '@core/atoms/typography';
import FormLabel from '@core/components/form/FormLabel';

import Field from '../Field';

const materialUIOpacity = 0.42; // value used by material-ui. Using the same for consistency until the library is dropped.

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;
const Wrapper = styled.div`
  border: 1px solid var(--c-neutral-300);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  position: relative;
  padding: var(--unit) var(--unit);
  color: var(--c-neutral-1000);
  background: var(--c-neutral-300);
  width: 100%;
  &:focus-within {
    & p {
      opacity: 1;
    }
  }
`;
const TextInput = styled.input`
  resize: none;
  width: 100%;
  font: inherit;
  color: currentColor;
  border: none;
  letter-spacing: inherit;
  background: var(--c-neutral-300);
  &::placeholder {
    color: currentColor;
    opacity: ${materialUIOpacity};
  }
`;

type Props = {
  id?: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  label?: ReactNode;
  required?: boolean;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  helperText?: string;
  endAdornment?: ReactNode;
} & Partial<InputHTMLAttributes<HTMLInputElement>>;

const LabelText = ({
  label,
  error,
  required,
}: {
  label: ReactNode;
  error: string | null;
  required?: boolean;
}) => (
  <>
    {label} {required && '* '}
    {error && <span className="error">{error || null}</span>}
  </>
);

const TextField = ({
  id,
  defaultValue = '',
  onChange = () => {},
  name,
  label,
  placeholder,
  type,
  required,
  className,
  helperText,
  endAdornment,
  ...rest
}: Props) => (
  <Field
    defaultValue={defaultValue}
    name={name}
    render={({ error, handleChange, value }) => {
      return (
        <Root>
          {label && (
            <FormLabel id={id || name}>
              <LabelText label={label} error={error} required={required} />
            </FormLabel>
          )}
          <Wrapper className={className}>
            <TextInput
              id={id || name}
              placeholder={
                placeholder
                  ? `${placeholder}${required && !label ? ' *' : ''}`
                  : undefined
              }
              type={type}
              value={value}
              required={required}
              onChange={e => {
                onChange?.(e);
                handleChange(name)(e);
              }}
              {...rest}
            />
            {endAdornment}
          </Wrapper>
          {helperText && (
            <Caption color="var(--c-neutral-600)">{helperText}</Caption>
          )}
        </Root>
      );
    }}
  />
);

export default TextField;
