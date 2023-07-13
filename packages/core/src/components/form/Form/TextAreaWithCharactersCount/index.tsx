import { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import FormLabel from '@core/components/form/FormLabel';

import Field from '../Field';

const materialUIOpacity = 0.42; // value used by material-ui. Using the same for consistency until the library is dropped.

const HelperText = styled(Text16)<{ $error?: boolean }>`
  position: absolute;
  bottom: var(--unit);
  right: var(--unit);
  margin: 0;
  opacity: ${materialUIOpacity};
  color: ${({ $error }) =>
    $error ? 'rgba(var(--c-rgb-red-600), 0.25)' : 'var(--c-neutral-600)'};
`;

const Wrapper = styled.div<{ short: boolean }>`
  border: 1px solid var(--c-neutral-300);
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  position: relative;
  padding: ${({ short }) =>
    short
      ? `var(--double-unit)`
      : `var(--double-unit) var(--double-unit) var(--quadruple-unit)`};
  color: var(--c-neutral-1000);
  background: var(--c-neutral-300);
  &:focus-within {
    & p {
      opacity: 1;
    }
  }
`;

const TextArea = styled.textarea`
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
  name: string;
  id: string;
  minLength?: number;
  maxLength: number;
  placeholder?: string;
  className?: string;
  rows?: number;
  label: string;
  required?: boolean;
  short?: boolean;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
} & Partial<InputHTMLAttributes<HTMLTextAreaElement>>;

const getLabelText = (
  label: string,
  required: boolean,
  error: string | null
) => {
  let result = label;
  if (required) {
    result = `${result} *`;
  }
  if (error) {
    result = `${result} ${error}`;
  }
  return result;
};

export const TextAreaWithCharactersCount = ({
  name,
  id,
  minLength,
  maxLength,
  placeholder = '',
  className,
  rows = 3,
  label,
  required = false,
  short = false,
  defaultValue,
  onChange,
  ...rest
}: Props) => {
  return (
    <Field
      name={name}
      defaultValue={defaultValue}
      render={({ error, handleChange, value }) => {
        const labelText = getLabelText(label, required, error);
        const { length } = value;
        const maxLengthError = length > maxLength;
        const minLengthError = minLength !== undefined && length < minLength;
        return (
          <>
            <FormLabel id={id} error={!!error}>
              {labelText}
            </FormLabel>
            <Wrapper short={short} className={className}>
              <TextArea
                id={id}
                minLength={minLength}
                maxLength={maxLength}
                placeholder={placeholder}
                rows={rows}
                onChange={e => {
                  onChange?.(e);
                  handleChange(name)(e);
                }}
                aria-describedby={`${id}-helper`}
                value={value}
                required={required}
                {...rest}
              />
              <HelperText
                id={`${id}-helper`}
                $error={maxLengthError || minLengthError}
              >
                <FormattedMessage
                  id="TextAreaWithCharactersCount.HelperText"
                  defaultMessage="{typed} of {limit}"
                  values={{ typed: length, limit: maxLength }}
                />
              </HelperText>
            </Wrapper>
          </>
        );
      }}
    />
  );
};

export default TextAreaWithCharactersCount;
