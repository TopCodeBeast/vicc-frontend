import { ChangeEvent } from 'react';
import styled from 'styled-components';

import { Radio } from '@sorare/core/src/atoms/icons/Radio';
import { Color } from '@sorare/core/src/style/types';

const Wrapper = styled.span`
  position: relative;
`;

const HiddenInput = styled.input`
  position: absolute;
  inset: 0;
  width: var(--double-and-a-half-unit);
  margin: 0;
  opacity: 0;
  cursor: pointer;
`;

type Props = {
  name: string;
  checked: boolean;
  width?: number;
  value?: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  checkedColor?: Color;
};

export const SimpleRadio = ({
  name,
  checked = false,
  value,
  width,
  disabled = false,
  onChange = () => {},
  checkedColor = undefined,
}: Props) => {
  return (
    <Wrapper>
      <Radio checked={checked} width={width} fillColor={checkedColor} />
      <HiddenInput
        type="radio"
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        checked={checked}
      />
    </Wrapper>
  );
};

export default SimpleRadio;
