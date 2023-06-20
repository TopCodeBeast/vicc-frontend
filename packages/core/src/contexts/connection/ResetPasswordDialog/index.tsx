import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { SorareLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import SmallerStarBall from '@sorare/core/src/atoms/navigation/SmallerStarBall';
import { useWalletContext } from 'contexts/wallet';
import { useResetPassword } from 'contexts/wallet/Frame/handlers';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';

import { ResetPasswordContent } from './ResetPasswordContent';

type Props = {
  open: boolean;
  onClose: () => void;
};

const SorareTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--unit);
`;

export const ResetPasswordDialog = ({ open, onClose: doOnclose }: Props) => {
  const { promptResetPassword } = useWalletContext();
  const { up: isTablet } = useScreenSize('tablet');
  const [, setSearchParams] = useSearchParams();
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const onSuccess = useCallback(() => setHasSubmitted(true), []);

  useResetPassword({ onSuccess });

  useEffect(() => {
    if (open) promptResetPassword();
  }, [open, promptResetPassword]);

  const onClose = () => {
    setSearchParams({});
    doOnclose();
  };

  return (
    <Dialog
      open={open}
      title={
        <SorareTitle>
          <SmallerStarBall color="var(--c-neutral-1000)" />
          <SorareLogo variant="var(--c-neutral-1000)" />
        </SorareTitle>
      }
      headerCentered
      onClose={onClose}
      scroll="body"
      fullScreen={!isTablet}
    >
      <ResetPasswordContent hasSubmitted={hasSubmitted} />
    </Dialog>
  );
};

export default ResetPasswordDialog;
