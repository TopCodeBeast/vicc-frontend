import { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import Dialog from '@core/atoms/layout/Dialog';
import { GraphQLResult } from '@core/components/form/Form';
import { LANDING } from '@core/constants/routes';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useEvents from '@core/lib/events/useEvents';
import { theme } from '@core/style/theme';

import {
  PromptTermsCallback,
  PromptTermsOptions,
  useConnectionContext,
} from '..';
import OneMoreStep, { Title as OneMoreStepTitle } from './OneMoreStep';
import ReadThroughForm, {
  Title as TermsAndConditionsTitle,
} from './ReadThroughForm';
import { AcceptTermsMutation } from './__generated__/useAcceptTerms.graphql';
import useAcceptTerms, { AcceptTermsArgs } from './useAcceptTerms';

type AcceptTermsMutation_acceptTerms = NonNullable<
  AcceptTermsMutation['acceptTerms']
>;

type Props = {
  open: boolean;
  onAccept: PromptTermsCallback | null;
  onClose: () => void;
  options: PromptTermsOptions;
  isMobileWebviewSignUp?: boolean;
};

const Content = styled.div`
  --dialog-header-height: 61px;
  display: flex;
  flex-direction: row;
  max-height: calc(100vh - var(--dialog-header-height));
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    max-height: calc(100vh - var(--dialog-header-height) - 40px);
  }
`;

export const PromptTermsDialog = ({
  open,
  onAccept,
  onClose,
  options,
  isMobileWebviewSignUp,
}: Props) => {
  const {
    closable,
    withoutAcceptTermsMutation,
    tcuToken,
    initialTermsDisplay,
  } = options;
  const [acceptTermsMutation] = useAcceptTerms();
  const track = useEvents();
  const { up: isLaptop } = useScreenSize('laptop');
  const { up: isTablet } = useScreenSize('tablet');
  const { showNotification } = useSnackNotificationContext();
  const { signIn } = useConnectionContext();

  const acceptTerms = useMemo<
    (args: AcceptTermsArgs) => Promise<GraphQLResult>
  >(() => {
    if (withoutAcceptTermsMutation) {
      return async () => {
        return {};
      };
    }
    return async (newTermsInputs: AcceptTermsArgs) => {
      return (
        (await acceptTermsMutation({
          ...newTermsInputs,
          tcuToken,
        })) || {}
      );
    };
  }, [tcuToken, withoutAcceptTermsMutation, acceptTermsMutation]);

  const onFormSuccess = useCallback(
    (newTermsInputs: AcceptTermsArgs, result: GraphQLResult) => {
      if (onAccept) onAccept.resolve(newTermsInputs);
      const res = result as AcceptTermsMutation_acceptTerms;
      // we only show the snack notification if the user has accepted the terms
      // after the grace period (sign in blocked)

      if (tcuToken && !res.currentUser) {
        track('View Please Sign In');
        showNotification('termsAccepted');
        signIn();
      } else if (res.currentUser) {
        // refetching the config query breaks the wallet window
        // as a temporary fix, we reload the page, which does not have the same behavior
        // navigate(LANDING, { replace: true });
        window.location.href = LANDING;
      }
      onClose();
    },
    [onAccept, onClose, showNotification, signIn, tcuToken, track]
  );

  const handleClose = useCallback(() => {
    if (onAccept) onAccept.reject('rejected');
    onClose();
  }, [onAccept, onClose]);

  useEffect(() => {
    track('See TCU Modal', {
      mobile: !isLaptop,
    });
    return () => {};
  }, [track, isLaptop]);

  const doUseNewSignUp = initialTermsDisplay && !isMobileWebviewSignUp;

  const effectiveOnClose = useMemo(() => {
    if (doUseNewSignUp) {
      if (!closable) {
        return undefined;
      }
      return handleClose;
    }
    if (closable) {
      return handleClose;
    }
    return () => false;
  }, [doUseNewSignUp, closable, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={effectiveOnClose}
      hideCloseButton={!closable}
      noHeader={isMobileWebviewSignUp}
      title={
        doUseNewSignUp ? <OneMoreStepTitle /> : <TermsAndConditionsTitle />
      }
      noMargin
      fullScreen={!isTablet}
      scroll="body"
    >
      <Content>
        {doUseNewSignUp ? (
          <OneMoreStep
            onFormSuccess={onFormSuccess}
            acceptTerms={acceptTerms}
          />
        ) : (
          <ReadThroughForm
            onFormSuccess={onFormSuccess}
            acceptTerms={acceptTerms}
          />
        )}
      </Content>
    </Dialog>
  );
};

export default PromptTermsDialog;
