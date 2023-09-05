import classnames from 'classnames';
import { stringify } from 'qs';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Keys, Salt } from '@sorare/wallet-shared';
import { useConfigContext } from '@core/contexts/config';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useFetchEncryptedPrivateKeyMutation } from '@core/hooks/auth/useFetchEncryptedPrivateKeyMutation';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { getSalt } from '@core/lib/password';
import { theme } from '@core/style/theme';

import { useMessagingContext, useWalletContext } from '..';
import { WALLET_URL } from '../../../config';
import {
  useChangePassword,
  useForgotPassword,
  useInit,
  useOAuthSignIn,
  usePrepareEthDeposit,
  usePromptAddFundsEth,
  usePromptRecoverKey,
  usePromptRestoreWallet,
  useRecoverKey,
  useResetPrivateKey,
  useSignIn,
  useSignUp,
  useTransaction,
} from './handlers';
import { useErrorEvent } from './handlers/useErrorEvent';

const key = 'wallet';
const MISSING_OTP_CODE = 1000;

type FrameStyle = Pick<CSSProperties, 'width' | 'height' | 'top' | 'left'> & {
  '--header-size'?: string;
};

const defaultStyle: FrameStyle = {
  width: '0px',
  height: '0px',
  top: 0,
  left: 0,
};

type ListenerSpec = {
  eventSource: (walletNode: Element) => EventTarget | null;
  eventName: string;
};

type RegistrationHandle = {
  unregister: () => void;
};

const listenerSpecs: readonly ListenerSpec[] = [
  {
    // https://tkte.ch/articles/2019/09/23/iOS-VisualViewport.html
    eventSource: () => window.visualViewport || window,
    eventName: 'resize',
  },
  {
    eventSource: () => window,
    eventName: 'scroll',
  },
  {
    eventSource: walletNode => walletNode,
    eventName: 'styleChanged',
  },
  // If the iframe is in a dialog, the scroll event is
  // on the parent presentation, not the body
  {
    eventSource: walletNode => walletNode.closest('[role~="presentation"]'),
    eventName: 'scroll',
  },
] as const;

const plugListeners = (
  walletNode: Element,
  eventListenersTargetSpec: readonly ListenerSpec[],
  eventListener: EventListener
): RegistrationHandle[] => {
  return listenerSpecs.reduce<RegistrationHandle[]>(
    (
      listeners: RegistrationHandle[],
      { eventName, eventSource }: ListenerSpec
    ) => {
      const target = eventSource(walletNode);
      if (target) {
        target.addEventListener(eventName, eventListener);
        listeners.push({
          unregister: () =>
            target.removeEventListener(eventName, eventListener),
        });
      }
      return listeners;
    },
    []
  );
};

const unregisterRegistrationHandles = (registrations: RegistrationHandle[]) => {
  registrations.forEach(({ unregister }) => {
    unregister();
  });
};

const Root = styled.iframe`
  --header-size: 60;
  position: absolute;
  border: none;
  width: 100%;
  max-height: calc(100% - var(--header-size) * 1px);
  border-radius: 8px;
  z-index: ${theme.zIndex.modal + 1};
  &.hideFrame {
    display: none !important;
  }
`;

/**
 * This wraps the wallet iframe. It is added only once to the page so that the iframe is only loaded once.
 * It is not possible to move an iframe in the DOM without triggering a reloading so it prevents us from using a Portal to display the iframe where it is needed. Using the shadow DOM does not work either for the same reasons.
 * The iframe is positioned absolutely and displayed wherever it is needed by using the WalletPlaceholder Component and mimicking its size and position.
 */
export const Frame = () => {
  const { registerHandler } = useMessagingContext();
  const { viccEncryptionKey } = useConfigContext();
  const { currentUser } = useCurrentUserContext();
  const iFrame = useRef<HTMLIFrameElement | null>(null);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>(defaultStyle);
  const [fetchEncryptedPrivateKey] = useFetchEncryptedPrivateKeyMutation();

  const { setWindow, walletNode } = useWalletContext();
  const { flags } = useFeatureFlags();
  const use2FA = flags['2FaWallet'] ?? true;

  useInit();
  useErrorEvent();
  useSignIn();
  useSignUp();
  useChangePassword();
  useForgotPassword();
  useResetPrivateKey();
  usePrepareEthDeposit();
  usePromptRecoverKey();
  usePromptRestoreWallet();
  useRecoverKey();
  usePromptAddFundsEth();
  useTransaction();
  useOAuthSignIn();

  useEffect(() => {
    const window = iFrame.current
      ? iFrame.current.contentWindow || undefined
      : undefined;

    setWindow(window);
  }, [setWindow]);

  useEffect(
    () =>
      registerHandler<Salt>('salt', async ({ email }) => {
        const salt = await getSalt(email);
        return { result: { salt } };
      }),
    [registerHandler]
  );

  useEffect(
    () =>
      registerHandler<Keys>('keys', async () => {
        if (!currentUser) return { result: { viccEncryptionKey } };
        const { viccPrivateKey, otpRequiredForLogin } = currentUser;
        if (use2FA && otpRequiredForLogin) {
          const result = await fetchEncryptedPrivateKey({
            variables: { input: {} },
          });
          if (
            result?.data?.fetchEncryptedPrivateKey?.errors.some(
              error => error.code === MISSING_OTP_CODE
            )
          )
            return {
              result: {
                userPrivateKey: undefined,
                viccEncryptionKey,
              },
              error: 'invalid-otp',
            };
          return {
            result: {
              userPrivateKey:
                result.data?.fetchEncryptedPrivateKey?.viccPrivateKey ||
                undefined,
              viccEncryptionKey,
            },
          };
        }
        return {
          result: {
            userPrivateKey: viccPrivateKey || undefined,
            viccEncryptionKey,
          },
        };
      }),
    [
      currentUser,
      use2FA,
      registerHandler,
      fetchEncryptedPrivateKey,
      viccEncryptionKey,
    ]
  );

  const forcedEnv =
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('forcedEnv')
      : undefined;

  const computeFrameStyles = useCallback(() => {
    if (walletNode) {
      const computedStyles = getComputedStyle(walletNode);
      const headerSize = computedStyles.getPropertyValue('--header-size');
      const rect = walletNode.getBoundingClientRect();
      setFrameStyle({
        '--header-size': headerSize,
        width: computedStyles.width,
        height:
          computedStyles.height === '0px' ? '100%' : computedStyles.height,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    } else {
      setFrameStyle(defaultStyle);
    }
  }, [walletNode]);

  // WORK AROUND TO ENSURE THE IFRAME STICK TO THE PLACEHOLDER
  useEffect(() => {
    const timer = setInterval(() => {
      computeFrameStyles();
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, [computeFrameStyles]);
  // END OF WORK AROUND

  useEffect(() => {
    if (walletNode) {
      const registrationHandles = plugListeners(
        walletNode,
        listenerSpecs,
        computeFrameStyles
      );

      computeFrameStyles();
      return () => {
        unregisterRegistrationHandles(registrationHandles);
      };
    }

    return () => {};
  }, [computeFrameStyles, walletNode]);

  return (
    <Root
      ref={iFrame}
      title={key}
      key={key}
      src={`${WALLET_URL}?${stringify({
        allowedOrigin: window.location.origin,
        forcedEnv,
      })}`}
      id={key}
      className={classnames({
        hideFrame: !walletNode,
      })}
      style={frameStyle}
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
    />
  );
};

export default Frame;
