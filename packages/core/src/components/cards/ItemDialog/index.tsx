import { Dialog as MuiDialog } from '@material-ui/core';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from 'styled-components';

import CloseButton from '@core/atoms/buttons/CloseButton';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { laptopAndAbove } from '@core/style/mediaQuery';
import { OverrideClasses } from '@core/style/utils';

type Props = {
  children: ReactNode;
};

const [StyledDialog, classes] = OverrideClasses(MuiDialog, null, {
  root: css`
    overflow: scroll;
  `,
  scrollPaper: css`
    height: unset;
  `,
  paper: css`
    width: 1300px;
    background: var(--c-neutral-100);

    @media ${laptopAndAbove} {
      max-width: min(1920px, 100vw - calc(6 * var(--unit)));
      border-radius: var(--double-unit);
      /* clip does not create a new formatting context and this allows descendant to be sticky to the top of the dialog.
        clip is not well supported on older browsers (older Safari for example), but it should be ok on desktop.
      */
      overflow: clip;
    }
  `,
});

const ItemDialog = ({ children }: Props) => {
  const { up: isLaptop } = useScreenSize('laptop');
  const navigate = useNavigate();
  const closeItem = () => navigate(-1);

  return (
    <StyledDialog
      classes={classes}
      fullScreen={!isLaptop}
      maxWidth="xl"
      open
      onClose={closeItem}
    >
      <CloseButton fixed menu transparent onClose={closeItem} />
      {children}
    </StyledDialog>
  );
};

export default ItemDialog;
