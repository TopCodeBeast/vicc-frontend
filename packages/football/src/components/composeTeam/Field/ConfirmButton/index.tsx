import { FC } from 'react';

import Button from '@sorare/core/src/atoms/buttons/LoadingButton';

export type Props = FC<
  React.PropsWithChildren<{
    onClick?: () => void;
    loading?: boolean;
    lineupComplete: boolean;
  }>
>;

const ConfirmButton: Props = ({
  onClick,
  loading,
  children,
  lineupComplete,
}) => (
  <Button
    medium
    color="blue"
    fullWidth
    disabled={!onClick || !lineupComplete}
    onClick={onClick}
    loading={!!loading}
  >
    {children}
  </Button>
);

export default ConfirmButton;
