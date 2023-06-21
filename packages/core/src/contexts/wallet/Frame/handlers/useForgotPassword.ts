import { RefObject, useContext, useEffect } from 'react';
import type ReCAPTCHA from 'react-google-recaptcha';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import { ForgotPassword, MessagingContext } from '@sorare/wallet-shared';
import { useAuthContext } from '@core/contexts/auth';
import { useConnectionContext } from '@core/contexts/connection';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSentryContext } from '@core/contexts/sentry';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { useWalletContext } from '@core/contexts/wallet';
import { useWalletDrawerContext } from '@core/contexts/walletDrawer';

export default () => {
  const { registerHandler } = useContext(MessagingContext)!;
  const { createResetPasswordRequest } = useAuthContext();
  const { currentUser } = useCurrentUserContext();
  const { showNotification } = useSnackNotificationContext();
  const {
    togglePasswordForgotten,
    passwordForgotten,
    recaptchaRef: connectionRecaptcha,
  } = useConnectionContext();
  const { executeRecaptcha } = useGoogleReCaptcha()!;
  const { logOut } = useWalletContext();
  const {
    hideWallet,
    hideDrawer,
    recaptchaRef: walletDrawerRecaptcha,
  } = useWalletDrawerContext();
  const { sendSafeError } = useSentryContext();

  useEffect(
    () =>
      registerHandler<ForgotPassword>(
        'forgotPassword',
        async ({ email, remainOpened }) => {
          const processRecaptchaRef = async (
            reCAPTCHA: RefObject<ReCAPTCHA>['current']
          ) => {
            reCAPTCHA?.reset();
            const recaptchaToken = await reCAPTCHA?.executeAsync();

            if (!recaptchaToken) return {};

            const result = await createResetPasswordRequest(
              email,
              recaptchaToken
            );

            // The case where it was triggered from the Login Dialog
            if (passwordForgotten) {
              togglePasswordForgotten();
            }

            if (!remainOpened) {
              // If it was triggered from the drawer
              hideWallet();
              hideDrawer();
            }

            if (result.error) {
              showNotification('passwordForgottenError');
              return { error: 'unable to request password reset' };
            }

            showNotification('passwordForgottenSuccess');
            if (currentUser && !remainOpened) {
              await logOut();
            }
            return {};
          };
          if (connectionRecaptcha.current) {
            return processRecaptchaRef(connectionRecaptcha.current);
          }
          if (walletDrawerRecaptcha.current) {
            return processRecaptchaRef(walletDrawerRecaptcha.current);
          }
          sendSafeError(
            'Trying to trigger a password forgotten procedure without a recaptcha context.'
          );
          return processRecaptchaRef(null);
        }
      ),
    [
      createResetPasswordRequest,
      registerHandler,
      showNotification,
      togglePasswordForgotten,
      executeRecaptcha,
      passwordForgotten,
      hideWallet,
      hideDrawer,
      logOut,
      currentUser,
      connectionRecaptcha,
      walletDrawerRecaptcha,
      sendSafeError,
    ]
  );
};
