import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { ViccLogo } from '@core/atoms/icons/SorareLogo';
import Dialog from '@core/atoms/layout/Dialog';
import SmallerStarBall from '@core/atoms/navigation/SmallerStarBall';
import { useWalletContext } from '@core/contexts/wallet';
import { useResetPassword } from '@core/contexts/wallet/Frame/handlers';
import useScreenSize from '@core/hooks/device/useScreenSize';

import { ResetPasswordContent } from './ResetPasswordContent';

type Props = {
  open: boolean;
  onClose: () => void;
};

const ViccTitle = styled.div`
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
        <ViccTitle>
          <SmallerStarBall color="var(--c-neutral-1000)" />
          <ViccLogo variant="var(--c-neutral-1000)" />
        </ViccTitle>
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
