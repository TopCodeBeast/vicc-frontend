import { Dialog as MuiDialog } from '@material-ui/core';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { OverrideClasses } from '@sorare/core/src/style/utils';

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
