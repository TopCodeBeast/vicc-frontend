/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { Color } from '@sorare/core/src/style/types';

import SimpleRadio from '../SimpleRadio';

const Label = styled.label<{ reverse: boolean; disabled: boolean }>`
  color: currentColor;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--double-unit);
  cursor: pointer;
  ${({ disabled }) =>
    disabled
      ? css`
          opacity: 0.5;
          filter: grayscale(0.5);
        `
      : ''}

  ${({ reverse }) =>
    reverse
      ? css`
          flex-direction: row-reverse;
          justify-content: flex-end;
        `
      : ''}
`;

const HideRadio = styled.div<{ enable: boolean }>`
  ${({ enable }) =>
    enable
      ? css`
          display: none;
        `
      : ''}
`;

export type Props = {
  labelContent: string | ReactNode;
  value: string;
  name: string;
  checked: boolean;
  reverse?: boolean;
  disabled?: boolean;
  hideRadio?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  checkedColor?: Color;
};

export const Radio = (props: Props) => {
  const {
    reverse = false,
    labelContent,
    hideRadio = false,
    disabled = false,
    ...rest
  } = props;
  return (
    <Label reverse={reverse} disabled={disabled}>
      {labelContent}
      <HideRadio enable={hideRadio}>
        <SimpleRadio {...rest} disabled={disabled} />
      </HideRadio>
    </Label>
  );
};

export default Radio;
