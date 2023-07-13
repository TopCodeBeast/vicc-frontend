import { ElementType, ReactNode, forwardRef } from 'react';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import Button, { Props as ButtonProps } from '@core/atoms/buttons/Button';
import ButtonBase from '@core/atoms/buttons/ButtonBase';
import useToggle from '@core/hooks/useToggle';

import ConfirmDialog from '../ConfirmDialog';

type ConfirmationProps = {
  children: ReactNode;
  onConfirm: () => void;
  message?: ReactNode;
  disabled?: boolean;
  cta?: string;
};
type ButtonConfirmationProps = ConfirmationProps &
  Omit<ButtonProps, 'onClick' | 'children'> & {
    component?: ElementType;
  };

export const ButtonBaseWithConfirmDialog = ({
  children,
  message,
  onConfirm,
  disabled,
  cta,
}: ConfirmationProps) => {
  const [open, toggleOpen] = useToggle(false);

  return (
    <>
      <ButtonBase onClick={toggleOpen} disabled={disabled}>
        {children}
      </ButtonBase>
      <ConfirmDialog
        open={open}
        onClose={toggleOpen}
        cta={cta}
        message={message}
        onConfirm={onConfirm}
      />
    </>
  );
};

export const ButtonWithConfirmDialog = forwardRef<
  HTMLElement,
  ButtonConfirmationProps
>(function ButtonWithConfirmDialog(props, ref) {
  const {
    children,
    message,
    onConfirm,
    disabled,
    cta,
    component: Component = Button,
    ...rest
  } = props;

  const [open, toggleOpen] = useToggle(false);

  return (
    <>
      <Component onClick={toggleOpen} disabled={disabled} {...rest} ref={ref}>
        {children}
      </Component>
      <ConfirmDialog
        open={open}
        onClose={toggleOpen}
        cta={cta}
        message={message}
        onConfirm={onConfirm}
      />
    </>
  );
});

export default ButtonWithConfirmDialog;
