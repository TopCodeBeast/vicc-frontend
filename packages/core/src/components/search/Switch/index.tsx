import { FormControlLabel } from '@material-ui/core';
import classNames from 'classnames';
import { ChangeEvent, ReactNode } from 'react';
import styled from 'styled-components';

import AtomSwitch from '@sorare/core/src/atoms/inputs/Switch';

type Props = {
  checked: boolean;
  label?: string | ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const Label = styled.span`
  font-size: 15px;
  line-height: 22px;
  font-family: apercu-pro, system-ui, sans-serif;
  font-weight: 400;
  font-style: normal;
  color: var(--c-neutral-1000);
  &.checked:not(.Mui-disabled) {
    color: var(--c-neutral-1000);
  }
  &.Mui-disabled {
    color: var(--c-neutral-600);
  }
`;
const Control = styled(FormControlLabel)`
  margin: 0;
  width: 100%;
  justify-content: space-between;
`;

const Switch = ({ checked, disabled, onChange, label }: Props) => {
  return (
    <Control
      className={classNames('FilterWidget', { visible: !disabled })}
      labelPlacement="start"
      control={
        <AtomSwitch checked={checked} disabled={disabled} onChange={onChange} />
      }
      label={<Label className={classNames({ checked })}>{label}</Label>}
    />
  );
};

export default Switch;
