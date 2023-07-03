import { Switch as MUISwitch } from '@material-ui/core';
import { SwitchProps } from '@material-ui/core/Switch';
import classNames from 'classnames';
import { ChangeEvent } from 'react';
import styled from 'styled-components';

interface Props extends Omit<SwitchProps, 'classes'> {
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  forceLightTheme?: boolean;
}

const StyledSwitch = styled(MUISwitch)`
  width: calc(5 * var(--unit));
  height: calc(3 * var(--unit));
  margin: 0;

  & .MuiSwitch-thumb {
    width: 20px;
    height: 20px;
  }

  .dark-theme &:not(.light-theme) .Mui-checked .MuiSwitch-thumb {
    background-color: var(--c-neutral-1000);
  }
`;

const Switch = ({
  checked,
  onChange,
  forceLightTheme = false,
  className,
  ...checkboxProps
}: Props) => {
  return (
    <StyledSwitch
      className={classNames({ 'light-theme': forceLightTheme })}
      checked={checked}
      onChange={onChange}
      {...checkboxProps}
    />
  );
};

export default Switch;
