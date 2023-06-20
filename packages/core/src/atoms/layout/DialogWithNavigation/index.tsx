import { ReactNode } from 'react';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';

import Dialog, { Props as DialogProps } from '../Dialog';
import DialogContentWithNavigation from '../DialogContentWithNavigation';

type Props = DialogProps & {
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  onBackButton?: () => void;
};

export const DialogWithNavigation = (props: Props) => {
  const { children, onBackButton, title, right, onClose, ...dialogProps } =
    props;
  return (
    <Dialog {...dialogProps} noMargin hideCloseButton>
      <DialogContentWithNavigation
        title={title}
        onBackButton={onBackButton}
        right={onClose ? <CloseButton onClose={onClose} /> : undefined}
      >
        {children}
      </DialogContentWithNavigation>
    </Dialog>
  );
};

export default DialogWithNavigation;
