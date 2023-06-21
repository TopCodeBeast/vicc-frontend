import classnames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';

import {
  BackFromSignUpAdditionalScreen,
  SetMode,
  SignUpAdditionalScreen,
} from '@sorare/wallet-shared';
import Dialog from '@core/atoms/layout/Dialog';
import { Title5 } from '@core/atoms/typography';
import OAuthForm from '@core/components/user/OAuthForm';
import { useMessagingContext, useWalletContext } from '@core/contexts/wallet';
import WalletPlaceholder from '@core/contexts/wallet/Placeholder';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import useEvents from '@core/lib/events/useEvents';
import { glossary } from '@core/lib/glossary';
import { mustAcceptTermsOfServiceFlag } from '@core/lib/mustAcceptTermsOfServiceFlag';
import * as events from '@core/protos/events/so5/web/events';
import { theme } from '@core/style/theme';

import { PopMode } from '..';

const modes = ['signin', 'signup'] as const;
type Mode = (typeof modes)[number];

export const isConnectionDialogMode = (action: string | null): action is Mode =>
  Boolean(action) && modes.includes(action as Mode);

interface Props {
  open: boolean;
  isMobileWebviewSignUp: boolean;
  mode: Mode;
  onClose: () => void;
  setMode: (mode: Mode) => void;
  popMode: PopMode | null;
}

const ConnectionOAuthToolbarV2 = ({ mode }: { mode: Mode }) => {
  const googleOAuth2Ref = useRef<HTMLFormElement>(null);
  const facebookOauth2Ref = useRef<HTMLFormElement>(null);
  const track = useEvents();
  const { registerOAuthHandler } = useWalletContext();
  useEffect(() => {
    const refsPerPlatform = {
      facebook: facebookOauth2Ref,
      google: googleOAuth2Ref,
    };
    return registerOAuthHandler(platform => {
      if (mode === 'signup') {
        track('Click Oauth Sign Up', {
          method: events.clickOauthSignUp_MethodFromJSON(
            platform.toUpperCase()
          ),
        });
      }

      const formElement = refsPerPlatform[platform].current;
      if (formElement) {
        formElement.submit();
      }
    });
  }, [mode, registerOAuthHandler, track]);
  return (
    <>
      <OAuthForm provider="google_oauth2" ref={googleOAuth2Ref} />
      <OAuthForm provider="facebook" ref={facebookOauth2Ref} />
    </>
  );
};

const StyledPopMode = styled(Dialog)<{ $popMode: PopMode | null }>`
  ${({ $popMode }) =>
    $popMode
      ? css`
          visibility: hidden;
        `
      : null}
`;
const Frame = styled(WalletPlaceholder)`
  position: relative;
  top: 0;
  margin: 10px;
  width: calc(100% - var(--double-and-a-half-unit));
  max-height: 100%;
  &.signin {
    height: 210px;
  }
  &.signup {
    height: 392px;
  }
  &.lastTermsOfServiceUpdatedAt {
    height: 270px;
  }
  &.newSignup {
    height: 486px;
    margin: 0;
    width: calc(100%);
  }
  &.signup.newSignup {
    height: 711px;
  }
  &.signup.noOAuth {
    height: 100%;
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      height: 685px;
      min-height: 685px;
    }
  }
  &.isMobileWebviewSignUp.newSignup {
    height: 100%;
    max-height: unset;
  }
`;

export const ConnectionDialog = ({
  open,
  mode,
  isMobileWebviewSignUp = false,
  onClose,
  setMode,
  popMode,
}: Props) => {
  const {
    signIn,
    signUp,
    signUpMobileView,
    setOnWalletResizeRequest,
    walletNode,
  } = useWalletContext();
  const track = useEvents();
  const { registerHandler, sendRequest } = useMessagingContext();
  const [placeHolderStyle, setPlaceHolderStyle] = useState<
    { height: number } | undefined
  >();
  const [isSignUpAdditionalScreen, setIsSignUpAdditionalScreen] =
    useState<boolean>(false);
  const {
    flags: { lastTermsOfServiceUpdatedAt = '' },
  } = useFeatureFlags();
  const { up: isTablet } = useScreenSize('tablet');

  const mustAcceptTermsFlag = mustAcceptTermsOfServiceFlag(
    lastTermsOfServiceUpdatedAt
  );

  useEffect(() => {
    if (mode === 'signup') {
      track('View Sign Up Modal', {});
    }
  }, [mode, track]);

  useEffect(() => {
    if (mode === 'signin') {
      signIn();
    } else if (mode === 'signup') {
      if (isMobileWebviewSignUp) {
        signUpMobileView();
      } else {
        signUp();
      }
    }
  }, [mode, signIn, signUp, signUpMobileView, isMobileWebviewSignUp]);

  useEffect(
    () =>
      setOnWalletResizeRequest(dimensions => {
        if (isMobileWebviewSignUp || !walletNode || !dimensions) {
          return;
        }
        const currentDimensions = walletNode.getBoundingClientRect();
        if (dimensions.height !== currentDimensions.height) {
          setPlaceHolderStyle(prevState => {
            if (!prevState) {
              // Fix height resizing when switching signin/singup: use currentDimensions instead of dimensions. Cause dimensions have prev form value after switching.
              return { height: currentDimensions.height };
            }
            // if less height was actually requested, increment it
            if (!prevState.height || prevState.height !== dimensions.height) {
              return {
                ...prevState,
                height: dimensions.height,
              };
            }
            return prevState;
          });
        }
      }),
    [setOnWalletResizeRequest, walletNode, isMobileWebviewSignUp]
  );

  useEffect(
    () =>
      registerHandler<SetMode>('setMode', async ({ mode: inputMode }) => {
        setMode(inputMode);
        return {};
      }),
    [registerHandler, setMode]
  );

  useEffect(
    () =>
      registerHandler<SignUpAdditionalScreen>(
        'signUpAdditionalScreen',
        async () => {
          setIsSignUpAdditionalScreen(true);
          return {};
        }
      ),
    [registerHandler, setMode]
  );

  const backToSignUp = async () => {
    await sendRequest<BackFromSignUpAdditionalScreen>(
      'backFromSignUpAdditionalScreen',
      {}
    );
    setIsSignUpAdditionalScreen(false);
  };

  const onCloseFromAdditionalScreen = () => {
    backToSignUp();
    onClose();
  };

  const fullScreen = isMobileWebviewSignUp || !isTablet;
  const scroll = popMode ? 'body' : 'paper';
  const integrateOAuthForms = mode === 'signin';

  return (
    <StyledPopMode
      // Set a data-attribute we can look for on connection dialog
      data-dialog="ConnectionDialog"
      open={open}
      $popMode={popMode}
      noMargin
      title={
        <Title5 as="div">
          <FormattedMessage {...glossary[mode]} />
        </Title5>
      }
      onBack={(isSignUpAdditionalScreen && backToSignUp) || undefined}
      onClose={isSignUpAdditionalScreen ? onCloseFromAdditionalScreen : onClose}
      headerCentered
      noHeader={isMobileWebviewSignUp}
      fullScreen={fullScreen}
      scroll={scroll}
      // As there is no transition on iframe appearance, we do not want the dialog to fade in
      transitionDuration={0}
    >
      {!popMode && (
        <Frame
          key={mode}
          className={classnames(
            mode,
            mustAcceptTermsFlag && {
              lastTermsOfServiceUpdatedAt,
            },
            {
              newSignup: true,
            },
            {
              noOAuth: true,
            },
            {
              isMobileWebviewSignUp,
            }
          )}
          withoutHeader={isMobileWebviewSignUp}
          style={placeHolderStyle}
        />
      )}
      {integrateOAuthForms && <ConnectionOAuthToolbarV2 mode={mode} />}
    </StyledPopMode>
  );
};

export default ConnectionDialog;
