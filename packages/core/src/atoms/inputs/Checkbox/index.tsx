import { FormControlLabel, Checkbox as MUICheckbox } from '@material-ui/core';
import { CheckboxProps } from '@material-ui/core/Checkbox';
import classNames from 'classnames';
import { ChangeEvent, ReactNode } from 'react';
import styled from 'styled-components';

export interface Props extends Omit<CheckboxProps, 'classes'> {
  currentColor?: boolean;
  checked: boolean;
  label?: string | ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  noPadding?: boolean;
}

const CheckboxRoot = styled(MUICheckbox)`
  && .MuiIconButton-label:after {
    background-color: transparent;
  }
  &.noPadding {
    padding: 0;
  }
  &.currentColor {
    color: currentColor;
  }
`;
const Root = styled(FormControlLabel)`
  &.currentColor {
    color: currentColor;
  }

  & .MuiFormControlLabel-label {
    font-family: apercu-pro, system-ui, sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 15px;
    line-height: 22px;
    color: var(--c-neutral-600);
  }

  &.checked .MuiFormControlLabel-label {
    &:not(.Mui-disabled) {
      color: var(--c-brand-600);
    }
    &.Mui-disabled {
      color: var(--c-neutral-600);
    }
  }
`;

export const Checkbox = (props: Props) => {
  const {
    checked,
    label,
    onChange,
    currentColor,
    noPadding,
    className,
    ...otherProps
  } = props;

  const checkedIcon = (
    <svg width="24" height="24">
      <path
        d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3z"
        fill={currentColor ? 'currentColor' : 'var(--c-brand-600)'}
      />
      <path
        d="M18.179 9.012l-7.846 7.845-4.511-4.512 2.357-2.357 2.154 2.155 5.489-5.488 2.357 2.357z"
        fill="var(--c-static-neutral-100)"
      />
    </svg>
  );

  const checkbox = (
    <CheckboxRoot
      checked={checked}
      onChange={onChange}
      checkedIcon={checkedIcon}
      className={classNames(className, { currentColor, noPadding })}
      {...otherProps}
    />
  );

  if (!label) return checkbox;

  return (
    <Root
      control={checkbox}
      label={label}
      className={classNames({ currentColor, checked })}
    />
  );
};

export default Checkbox;
