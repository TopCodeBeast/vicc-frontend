import { stringify } from 'qs';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { OnBackForgotPassword } from '@sorare/wallet-shared';
import { TermsAndConditionsStatus } from '__generated__/globalTypes';
import { GoogleReCAPTCHA, ReCAPTCHA } from '@core/components/recaptcha';
import { TERMS } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useMessagingContext, useWalletContext } from '@core/contexts/wallet';
import useQueryString from '@core/hooks/useQueryString';
import useToggle from '@core/hooks/useToggle';

import ConnectionContextProvider, {
  AcceptTermsInfo,
  Mode,
  PopMode,
  Prompt2faCallback,
  PromptTermsCallback,
  PromptTermsOptions,
  isConnectionMode,
} from '.';
import ConnectionDialog, { isConnectionDialogMode } from './ConnectionDialog';
import NewDeviceDialog from './NewDeviceDialog';
import PasswordForgottenDialog from './PasswordForgottenDialog';
import PromptTermsDialog from './PromptTermsDialog';
import PromptTwoFactAuthDialog from './PromptTwoFactAuthDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import SignUpSuccessMobileViewDialog from './SignUpSuccessMobileViewDialog';

interface Props {
  children: ReactNode;
}

const INITIAL_TERMS_STATUS = TermsAndConditionsStatus.INITIAL.toLowerCase();

const ConnectionProvider = ({ children }: Props) => {
  const action = useQueryString('action');
  const id = useQueryString('id');
  const [mode, setMode] = useState<Mode | null>(null);
  const [popMode, setPopMode] = useState<PopMode | null>(null);
  const [isMobileWebviewSignUp, setIsMobileWebviewSignUp] =
    useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | undefined>();
  const challengeFromQuery = useQueryString('otp_session_challenge');
  const [otpSessionChallenge, setOtpSessionChallenge] =
    useState(challengeFromQuery);
  const tcuToken = useQueryString('tcuToken');
  const termStatus = useQueryString('termsStatus');

  const navigate = useNavigate();

  const { currentUser } = useCurrentUserContext();
  const [passwordForgotten, togglePasswordForgotten, setPasswordForgotten] =
    useToggle(false);
  const [prompt2faCallback, setPrompt2faCallback] =
    useState<Prompt2faCallback | null>(null);
  const [promptTermsCallback, setPromptTermsCallback] =
    useState<PromptTermsCallback | null>(null);
  const [reasonFor2Fa, setReasonFor2FA] = useState<string | undefined>();
  const [promptTermsOptions, setPromptTermsOptions] =
    useState<PromptTermsOptions>({});
  const [acceptedTerms, setAcceptedTerms] = useState<AcceptTermsInfo | null>(
    null
  );
  const { passwordForgotten: promptPasswordForgotten } = useWalletContext();

  const recaptchaRef = useRef<GoogleReCAPTCHA>(null);

  const { registerHandler } = useMessagingContext();

  const signIn = useCallback(() => {
    setAcceptedTerms(null);
    return setMode('signin');
  }, []);
  const signUp = useCallback(() => {
    setAcceptedTerms(null);
    return setMode('signup');
  }, []);
  const showMobileWebviewSignUp = useCallback(() => {
    setAcceptedTerms(null);
    setIsMobileWebviewSignUp(true);
    setMode('signup');
  }, []);
  const showMobileSignUpConfirmation = useCallback(() => {
    setIsMobileWebviewSignUp(true);
    setMode('signUpSuccessMobileView');
    if (currentUser?.email) {
      setRegisteredEmail(currentUser?.email);
    }
  }, [currentUser]);
  const toggleResetPassword = useCallback(() => {
    setMode('signin');
  }, []);

  const handleClose = useCallback(() => setMode('dismissed'), []);
  const handleTermsClose = useCallback(() => setPopMode(null), [setPopMode]);

  const closeConnectionDialog = useCallback(
    (email: string) => {
      if (isMobileWebviewSignUp) {
        setMode('signUpSuccessMobileView');
        setRegisteredEmail(email);
      } else {
        setMode(null);
      }
      setPopMode(null);
    },
    [isMobileWebviewSignUp]
  );

  const prompt2fa = useCallback(
    (cb: Prompt2faCallback, challenge: string, reason?: string) => {
      setMode('2fa');
      setPrompt2faCallback(cb);
      setOtpSessionChallenge(challenge);
      setReasonFor2FA(reason);
    },
    [setOtpSessionChallenge]
  );

  const promptTerms = useCallback(
    (options: PromptTermsOptions, cb?: PromptTermsCallback) => {
      setPopMode('mustAcceptTerms');
      setPromptTermsOptions(options);
      if (cb) setPromptTermsCallback(cb);
    },
    []
  );

  const promptNewDeviceConfirmation = useCallback(
    () => setMode('newDevice'),
    []
  );

  useEffect(() => {
    if (!mode && action && isConnectionMode(action)) {
      setMode(action);
    }
  }, [action, mode]);

  // store the initial value of mustAcceptTcus to
  // avoid the redirection to `TERMS` once accepted
  const mustAcceptTCU = useRef<boolean>(!!currentUser?.mustAcceptTcus);
  const initialTCUAcceptance = useRef<boolean>(
    termStatus === INITIAL_TERMS_STATUS
  );

  useEffect(() => {
    if (mode === 'showTerms' && !mustAcceptTCU.current) {
      setMode(null);
      navigate(TERMS, { replace: true });
    }
  }, [mode, setMode, mustAcceptTCU, navigate]);

  useEffect(() => {
    if (passwordForgotten) promptPasswordForgotten();
    registerHandler<OnBackForgotPassword>('onBackForgotPassword', async () => {
      setPasswordForgotten(false);
      return {};
    });
  }, [
    passwordForgotten,
    promptPasswordForgotten,
    registerHandler,
    setPasswordForgotten,
  ]);

  if (
    mode &&
    ['recoverKey', 'restoreWallet', 'addFundsEth', 'kyc'].includes(mode) &&
    !currentUser
  ) {
    const afterLoggedInTarget = `?${stringify({ action: mode, id })}`;

    setMode('signin');
    navigate('', {
      state: {
        afterLoggedInTarget,
      },
    });
  }

  if (mode === 'forgotPassword') {
    if (!currentUser) {
      setMode('signin');
      togglePasswordForgotten();
    }
  }

  return (
    <ConnectionContextProvider
      value={{
        signIn,
        signUp,
        showMobileWebviewSignUp,
        showMobileSignUpConfirmation,
        togglePasswordForgotten,
        toggleResetPassword,
        prompt2fa,
        promptTerms,
        passwordForgotten,
        promptNewDeviceConfirmation,
        acceptedTerms,
        closeConnectionDialog,
        recaptchaRef,
      }}
    >
      {isConnectionDialogMode(mode) && !passwordForgotten && !currentUser && (
        <ConnectionDialog
          open
          isMobileWebviewSignUp={isMobileWebviewSignUp}
          mode={mode as 'signin' | 'signup'}
          popMode={popMode}
          setMode={setMode}
          onClose={handleClose}
        />
      )}
      {mode === 'signUpSuccessMobileView' && (
        <SignUpSuccessMobileViewDialog email={registeredEmail} />
      )}
      {passwordForgotten && (
        <PasswordForgottenDialog
          open
          onBack={() => setPasswordForgotten(false)}
        />
      )}
      {mode === 'resetPassword' && (
        <ResetPasswordDialog open onClose={handleClose} />
      )}
      {mode === 'newDevice' && <NewDeviceDialog onClose={handleClose} />}
      {mode === '2fa' && otpSessionChallenge && (
        <PromptTwoFactAuthDialog
          open
          otpSessionChallenge={otpSessionChallenge}
          onSignedIn={prompt2faCallback}
          onClose={handleClose}
          reason={reasonFor2Fa}
        />
      )}
      {/* OAUTH GRACE PERIOD */}
      {mode === 'showTerms' && mustAcceptTCU.current && (
        <PromptTermsDialog
          open
          onClose={handleClose}
          options={{
            closable: true,
            initialTermsDisplay: initialTCUAcceptance.current,
          }}
          onAccept={null}
          isMobileWebviewSignUp={isMobileWebviewSignUp}
        />
      )}

      {/* OAUTH AFTER GRACE PERIOD */}
      {mode === 'acceptTerms' && tcuToken && (
        <PromptTermsDialog
          open
          onClose={handleClose}
          options={{
            closable: false,
            tcuToken,
            initialTermsDisplay: initialTCUAcceptance.current,
          }}
          onAccept={promptTermsCallback}
          isMobileWebviewSignUp={isMobileWebviewSignUp}
        />
      )}
      {/* ALL THE REST  */}
      {popMode === 'mustAcceptTerms' && (
        <PromptTermsDialog
          open
          onAccept={promptTermsCallback}
          onClose={handleTermsClose}
          options={promptTermsOptions}
          isMobileWebviewSignUp={isMobileWebviewSignUp}
        />
      )}
      {/* {(mode === 'signup' || mode === 'signin') && (
        <ReCAPTCHA ref={recaptchaRef} />
      )} */}
      {children}
    </ConnectionContextProvider>
  );
};

export default ConnectionProvider;
