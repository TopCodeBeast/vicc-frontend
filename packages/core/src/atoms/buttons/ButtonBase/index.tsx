import { ButtonBase as MuiButtonBase } from '@material-ui/core';
import { ButtonBaseProps } from '@material-ui/core/ButtonBase/ButtonBase';
import { ElementType } from 'react';

import useClickHandler from '@sorare/core/src/hooks/useClickHandler';

const ButtonBase = <T extends ElementType<any>>(
  props: ButtonBaseProps<T> & { classes?: never }
) => {
  const { children, onClick, disableDebounce = false, ...rest } = props;
  const clickHandler = useClickHandler(onClick, disableDebounce);

  return (
    <MuiButtonBase onClick={clickHandler} {...rest}>
      {children}
    </MuiButtonBase>
  );
};

export default ButtonBase;
