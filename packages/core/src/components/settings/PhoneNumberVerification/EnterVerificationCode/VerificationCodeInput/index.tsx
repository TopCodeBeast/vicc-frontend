import styled from 'styled-components';

export interface Props {
  value: string;
  onChange: (value: string) => void;
  size?: number;
}

const Root = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: var(--unit) var(--unit) 0;
  gap: var(--unit);
`;

const Label = styled.label<{ size: number }>`
  --cellSize: 20px;
  --gap: 5px;
  --total: ${({ size }) => size};
  --cellGap: calc(var(--gap) * (var(--total) - 1));
  display: block;
  width: calc(var(--cellSize) * var(--total) + var(--cellGap));
  border: 2px solid var(--c-neutral-300);
  border-radius: 16px;
`;

const Input = styled.input`
  height: 60px;
  width: 100%;
  padding: 0;
  border: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  font-family: monospace;
  background: transparent;
  &:focus {
    outline: none;
  }

  /* Autofill prefix are only supported by autoprefixer@10.4 */
  /* https://github.com/postcss/autoprefixer/issues/626#issuecomment-953722168 */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    background-clip: text;
  }
  &:autofill,
  &:autofill:hover,
  &:autofill:focus {
    background-clip: text;
  }
`;

const VerificationCodeInput = ({ value, onChange, size = 4 }: Props) => {
  return (
    <Root>
      <Label size={size}>
        <Input
          maxLength={size}
          value={value}
          autoComplete="one-time-code"
          pattern="[0-9]*"
          inputMode="numeric"
          onChange={e => {
            const { value: inputValue } = e.target;
            const strippedValue = inputValue.replace(/\D/g, '');
            onChange(strippedValue);
          }}
        />
      </Label>
    </Root>
  );
};

export default VerificationCodeInput;
