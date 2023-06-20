import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { faCircleXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment, TextField } from '@material-ui/core';
import classnames from 'classnames';
import { ChangeEvent, KeyboardEvent, ReactNode, forwardRef } from 'react';
import styled, { css } from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { theme } from '@sorare/core/src/style/theme';

export type Props = {
  rounded?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  fullWidth?: boolean;
  withIcon?: boolean;
  withClearIcon?: boolean;
  doNotHideClearIcon?: boolean;
  onClear?: () => void;
  largeFont?: boolean;
  inputRef?: any;
  autoFocus?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  endAdornment?: ReactNode;
  small?: boolean;
  name?: string;
};

const AdornmentRoot = styled(InputAdornment)`
  display: flex;
  margin-right: 0;
  padding-right: 0;
`;

const SearchIcon = () => {
  return (
    <AdornmentRoot position="start">
      <FontAwesomeIcon icon={faSearch} />
    </AdornmentRoot>
  );
};

type ClearIconProps = {
  hidden: boolean;
  onClear: () => void;
};
const MaybeHidden = styled(InputAdornment)<{ $hidden: boolean }>`
  ${({ $hidden }) =>
    $hidden &&
    css`
      opacity: 0;
    `}
`;
const StyledClearIcon = styled(FontAwesomeIcon)`
  color: var(--c-neutral-500);
  .dark-theme & {
    color: var(--c-neutral-1000);
  }
`;
const ClearIcon = ({ hidden, onClear }: ClearIconProps) => {
  return (
    <MaybeHidden position="end" $hidden={hidden}>
      <Button medium disableRipple onClick={onClear}>
        <StyledClearIcon icon={faCircleXmark} />
      </Button>
    </MaybeHidden>
  );
};

const Root = styled(TextField)<{
  $rounded?: boolean;
  $largeFont: boolean;
  $paddingLeft?: boolean;
  $noPaddingRight: boolean;
}>`
  border-radius: 8px;
  height: 40px;
  &.small {
    height: var(--quadruple-unit);
  }

  .MuiOutlinedInput-root {
    font-family: apercu-pro, system-ui, sans-serif;
    font-weight: 400;
    font-style: normal;
    /* https://thingsthemselves.com/no-input-zoom-in-safari-on-iphone-the-pixel-perfect-way/ */
    font-size: 16px;
    @media (min-width: ${theme.breakpoints.values.laptop}px) {
      font-size: 15px;
    }
    line-height: 22px;
    box-shadow: none;
    height: 100%;
    width: 100%;
    color: var(--c-neutral-1000);
    display: flex;
    align-items: center;
    border-radius: 8px;
    ${({ $rounded }) =>
      $rounded &&
      css`
        && {
          border-radius: 40px;
          &.small {
            border-radius: var(--quadruple-unit);
          }
        }
      `};

    ${({ $paddingLeft }) =>
      $paddingLeft &&
      css`
        && {
          padding-left: 8px;
        }
      `};

    ${({ $largeFont }) =>
      $largeFont &&
      css`
        && {
          font-size: 16px;
        }
      `};

    ${({ $noPaddingRight }) =>
      $noPaddingRight &&
      css`
        && {
          padding-right: 0;
        }
      `};

    .dark-theme & {
      background: var(--c-neutral-300);
      color: var(--c-neutral-1000);
      border-radius: 2em;
      border: unset;
      padding-left: 14px;
    }
    .light-theme & {
      background: var(--c-neutral-100);
      border-radius: 8px;
      border: 1px solid var(--c-neutral-300);
    }
  }

  .MuiOutlinedInput-input {
    padding: 5px;
  }
`;

export const SearchInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    onChange,
    value,
    placeholder,
    fullWidth = false,
    withIcon = false,
    rounded,
    withClearIcon = false,
    doNotHideClearIcon = false,
    onClear = () => {},
    largeFont = false,
    inputRef,
    endAdornment,
    small = false,
    ...inputProps
  } = props;
  return (
    <Root
      placeholder={placeholder}
      fullWidth={fullWidth}
      variant="outlined"
      onChange={onChange}
      value={value}
      className={classnames({ small })}
      ref={ref}
      inputRef={inputRef}
      autoCorrect="off"
      autoComplete="off"
      $rounded={rounded}
      $largeFont={largeFont}
      $paddingLeft={rounded && !withIcon}
      $noPaddingRight={withClearIcon}
      InputProps={{
        startAdornment: withIcon ? <SearchIcon /> : null,
        endAdornment: withClearIcon ? (
          <ClearIcon hidden={!doNotHideClearIcon && !value} onClear={onClear} />
        ) : (
          endAdornment
        ),
        inputProps,
      }}
    />
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
