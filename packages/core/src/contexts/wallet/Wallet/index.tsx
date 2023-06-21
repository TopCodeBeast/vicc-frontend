import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  ApproveAuthorizationRequests,
  ApproveMigrator,
  CreateWalletRecovery,
  Deal,
  LogOut,
  Password,
  PasswordForgotten,
  PrivateKeyRecoveryPayload,
  Prompt,
  PromptDeposit,
  PromptRestoreWallet,
  RequestOAuth2,
  RequestResize,
  SettleDealSignatureType,
  SignEthMigration,
  SignLimitOrders,
  SignLimitOrdersErrorCodes,
  SignMigration,
  SignPaymentIntent,
  SignSettleDeal,
  SignTransfer,
  SignWalletChallenge,
} from '@sorare/wallet-shared';
import { AuthorizationRequest } from '@sorare/wallet-shared/src/contexts/messaging/authorizations';
import useCheckPhoneNumberVerificationCode from '@core/components/user/VerifyPhoneNumber/useCheckPhoneNumberVerificationCode';
import { SIGNUP_WORKFLOW_VERSION_QUERY_PARAMETER } from '@core/constants/mobile';
import {
  UpdateUserAttributes,
  UpdateUserEmailAttributes,
  useAuthContext,
} from '@core/contexts/auth';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSentryContext } from '@core/contexts/sentry';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useLogOut from '@core/hooks/auth/useLogOut';
import { RecoveryOption } from '@core/hooks/recovery/useRecoveryOptions';
import useQueryString from '@core/hooks/useQueryString';
import { Side } from '@core/lib/deal';
import useEvents from '@core/lib/events/useEvents';

import WalletContextProvider, {
  LimitOrder,
  OAuth2RequestHandler,
  Transfer,
  WalletPlaceHolderRequestedSize,
  WalletPlaceHolderResizeHandler,
  useMessagingContext,
} from '..';
import WalletAccessError from '../../../errors/walletAccess';
import usePromptResetPassword from './usePromptResetPassword';
import useUpdateUserEmail from './useUpdateUserEmail';

interface Props {
  children: ReactNode;
  setWindow: (window: Window | undefined) => void;
}

const Wallet = ({ children, setWindow }: Props) => {
  const { sendRequest, registerHandler } = useMessagingContext();
  const track = useEvents();
  const { formatMessage } = useIntl();
  const [latestPromptDimensions, updateLatestPromptDimensions] = useState<
    { promptType: string; size?: WalletPlaceHolderRequestedSize } | undefined
  >();
  const [dimensionsHandlers, updateDimensionsListener] = useState<
    WalletPlaceHolderResizeHandler[]
  >(() => []);
  const oauthHandlers = useRef<OAuth2RequestHandler[]>([]);
  const { updateUser } = useAuthContext();
  const logOutApp = useLogOut();
  const action = useQueryString('action');
  const mobileWorkflowVersion = useQueryString(
    SIGNUP_WORKFLOW_VERSION_QUERY_PARAMETER
  );
  const [walletNode, setWalletNode] = useState<Element | null>(null);
  const [selectedRecoveryOption, setSelectedRecoveryOption] =
    useState<RecoveryOption | null>(null);
  const { showWallet, setCurrentTab, closeWalletAndDrawer, hideWallet } =
    useWalletDrawerContext();
  const { currentUser, refetch } = useCurrentUserContext();
  const { showNotification } = useSnackNotificationContext();
  const { sendSafeError } = useSentryContext();
  const updateUserEmail = useUpdateUserEmail();
  const checkPhoneNumberVerificationCode =
    useCheckPhoneNumberVerificationCode();

  const prompt = useCallback(
    async (
      type: Prompt['request']['args']['type'],
      version?: Prompt['request']['args']['version']
    ) => {
      updateLatestPromptDimensions(prevValue => {
        // clear previously stored value if changing the prompt type
        if (prevValue?.promptType !== type) {
          return {
            promptType: type,
          };
        }
        return prevValue;
      });
      await sendRequest<Prompt>('prompt', { type, version });
    },
    [sendRequest]
  );

  const promptDeposit = useCallback(
    async id => {
      if (currentUser?.sorarePrivateKey) {
        await sendRequest<PromptDeposit>('promptDeposit', { id });
        showWallet();
      }
    },
    [currentUser?.sorarePrivateKey, sendRequest, showWallet]
  );

  const signIn = useCallback(async () => prompt('signIn'), [prompt]);
  const signUp = useCallback(async () => prompt('signUp'), [prompt]);
  const signUpMobileView = useCallback(
    async () => prompt('signUpMobileView', mobileWorkflowVersion),
    [prompt, mobileWorkflowVersion]
  );

  const passwordForgotten = useCallback(async () => {
    track('Click Password Forgotten');
    return prompt('passwordForgotten');
  }, [prompt, track]);
  const promptResetPassword = usePromptResetPassword();

  const logOut = useCallback(async () => {
    await sendRequest<LogOut>('logOut', {
      flushMessagingQueue: true,
    });
    logOutApp();
  }, [logOutApp, sendRequest]);

  const getPassword = useCallback(
    async (error?: boolean) => {
      showWallet();
      setCurrentTab(WalletTab.GET_PASSWORD);

      const {
        result: { passwordHash },
      } = await sendRequest<Password>('password', { error });

      closeWalletAndDrawer();
      return passwordHash;
    },
    [closeWalletAndDrawer, sendRequest, showWallet, setCurrentTab]
  );

  const promptRestoreWallet = useCallback(
    async (
      privateKeyRecoveryPayloads: PrivateKeyRecoveryPayload[],
      recoveryOption?: RecoveryOption
    ) => {
      setCurrentTab(WalletTab.RESTORE_WALLET);
      setSelectedRecoveryOption(recoveryOption || null);
      showWallet();

      await sendRequest<PromptRestoreWallet>('promptRestoreWallet', {
        privateKeyRecoveryPayloads,
        privateKeyRecoveryPayload: privateKeyRecoveryPayloads[0],
      });
    },
    [sendRequest, showWallet, setCurrentTab]
  );

  const handleWalletSuccessullyRecovered = useCallback(async () => {
    await refetch();
    setCurrentTab(WalletTab.HOME);
    setSelectedRecoveryOption(null);
    showNotification('walletSuccessfullyRecovered');
    hideWallet();
  }, [refetch, setCurrentTab, showNotification, hideWallet]);

  const checkUserPhoneNumberVerificationCodeWithRecovery = useCallback(
    async (code: string): Promise<{ message: string }[] | null> => {
      if (!currentUser) throw new Error('Missing current user');
      if (!currentUser.unverifiedPhoneNumber)
        throw new Error('No pending phone verification');

      const { result } = await sendRequest<CreateWalletRecovery>(
        'createWalletRecovery',
        {
          recoveryMethod: 'phone',
          recoveryDestination: currentUser.unverifiedPhoneNumber,
        }
      );

      if (!result) {
        return [
          {
            message: formatMessage({
              id: 'updateUserEmailWithPassword.privateKeyGenerationError',
              defaultMessage: 'Unable to generate recovery key.',
            }),
          },
        ];
      }

      closeWalletAndDrawer();

      return checkPhoneNumberVerificationCode(code, result.privateKeyRecovery);
    },
    [
      formatMessage,
      sendRequest,
      checkPhoneNumberVerificationCode,
      currentUser,
      closeWalletAndDrawer,
    ]
  );

  const updateUserEmailWithPassword = useCallback(
    async (attributes: UpdateUserEmailAttributes) => {
      if (!currentUser) throw new Error('Missing current user');

      if (!attributes.email || attributes.email === currentUser.email) {
        return {};
      }

      const { result } = await sendRequest<CreateWalletRecovery>(
        'createWalletRecovery',
        { recoveryMethod: 'email', recoveryDestination: attributes.email }
      );

      if (!result) {
        return {
          errors: [
            formatMessage({
              id: 'updateUserEmailWithPassword.privateKeyGenerationError',
              defaultMessage: 'Unable to generate recovery key.',
            }),
          ],
        };
      }

      closeWalletAndDrawer();

      attributes.privateKeyRecovery = result.privateKeyRecovery;
      return updateUserEmail({ ...attributes });
    },
    [
      formatMessage,
      updateUserEmail,
      sendRequest,
      currentUser,
      closeWalletAndDrawer,
    ]
  );

  const updateUserWithPassword = useCallback(
    async (attributes: UpdateUserAttributes) => {
      if (!currentUser) throw new Error('Missing current user');
      const currentPasswordHash = await getPassword();
      if (currentPasswordHash) {
        return updateUser({ ...attributes, currentPasswordHash });
      }

      return {
        errors: [
          formatMessage({
            id: 'updateUserWithPassword.walletNotUnlocked',
            defaultMessage: 'You must first unlock your wallet.',
          }),
        ],
      };
    },
    [currentUser, getPassword, formatMessage, updateUser]
  );

  const signSettleDeal = useCallback(
    async (
      deal: Deal,
      actionType: SettleDealSignatureType,
      receiveAmountInWei?: string
    ) => {
      const { result } = await sendRequest<SignSettleDeal>('signSettleDeal', {
        deal,
        action: actionType,
        receiveAmountInWei,
      });

      closeWalletAndDrawer();
      if (!result) {
        throw new WalletAccessError();
      }
      return result.signature;
    },
    [closeWalletAndDrawer, sendRequest]
  );

  const signInternalTokensForDeal = useCallback(
    async (deal: Deal, side: Side) => {
      return signSettleDeal(
        deal,
        side === 'sender'
          ? SettleDealSignatureType.SendInternalTokens
          : SettleDealSignatureType.ReceiveInternalTokens
      );
    },
    [signSettleDeal]
  );

  const approveMigrator = useCallback(
    async (nonce: string | number) => {
      if (!currentUser?.sorarePrivateKey) {
        showWallet();
        return undefined;
      }
      const { result } = await sendRequest<ApproveMigrator>('approveMigrator', {
        nonce,
      });

      closeWalletAndDrawer();
      return result;
    },
    [
      sendRequest,
      closeWalletAndDrawer,
      showWallet,
      currentUser?.sorarePrivateKey,
    ]
  );

  const signMigration = useCallback(
    async (cardIds: string[], expirationBlock: number | string) => {
      if (!currentUser?.sorarePrivateKey) {
        showWallet();
        return undefined;
      }
      const { result } = await sendRequest<SignMigration>('signMigration', {
        cardIds,
        expirationBlock,
      });

      closeWalletAndDrawer();
      return result?.signature;
    },
    [
      sendRequest,
      closeWalletAndDrawer,
      showWallet,
      currentUser?.sorarePrivateKey,
    ]
  );

  const signEthMigration = useCallback(
    async (nonce: string, amount: string) => {
      if (!currentUser?.sorarePrivateKey) {
        showWallet();
        return undefined;
      }
      const { result } = await sendRequest<SignEthMigration>(
        'signEthMigration',
        {
          dealId: nonce,
          sendAmountInWei: amount,
        }
      );

      closeWalletAndDrawer();
      return result?.signature;
    },
    [
      sendRequest,
      closeWalletAndDrawer,
      showWallet,
      currentUser?.sorarePrivateKey,
    ]
  );

  const signLimitOrders = useCallback(
    async (limitOrders: LimitOrder[]) => {
      if (!currentUser?.sorarePrivateKey) {
        showWallet();
        return { signatures: undefined, starkKey: undefined };
      }
      const { result, error } = await sendRequest<SignLimitOrders>(
        'signLimitOrders',
        {
          limitOrders,
        }
      );

      closeWalletAndDrawer();
      if (error) {
        if (error.code !== SignLimitOrdersErrorCodes.PROMPT_CANCELED) {
          sendSafeError(error.message);
        }
        return {
          signatures: undefined,
          starkKey: undefined,
        };
      }
      return {
        signatures: result?.signatures.map(s => JSON.stringify(s)),
        starkKey: result?.starkKey,
      };
    },
    [
      sendSafeError,
      sendRequest,
      closeWalletAndDrawer,
      showWallet,
      currentUser?.sorarePrivateKey,
    ]
  );

  const signTransfer = useCallback(
    async (transfer: Transfer) => {
      if (!currentUser?.sorarePrivateKey) {
        showWallet();
        return null;
      }
      const { result } = await sendRequest<SignTransfer>('signTransfer', {
        transfer,
      });

      closeWalletAndDrawer();
      return result?.signature ? JSON.stringify(result.signature) : null;
    },
    [
      sendRequest,
      closeWalletAndDrawer,
      showWallet,
      currentUser?.sorarePrivateKey,
    ]
  );

  const approveAuthorizationRequests = useCallback(
    async (authorizationRequests: AuthorizationRequest[]) => {
      if (!currentUser?.sorarePrivateKey) {
        showWallet();
        return {
          approvals: undefined,
          starkKey: undefined,
        };
      }
      const { result, error } = await sendRequest<ApproveAuthorizationRequests>(
        'approveAuthorizationRequests',
        {
          authorizationRequests,
        }
      );

      closeWalletAndDrawer();
      if (error) {
        if (error.code !== SignLimitOrdersErrorCodes.PROMPT_CANCELED) {
          sendSafeError(error.message);
        }
        return {
          approvals: undefined,
          starkKey: undefined,
        };
      }
      return {
        authorizationApprovals: result?.authorizationApprovals,
        starkKey: result?.starkKey,
      };
    },
    [
      closeWalletAndDrawer,
      currentUser?.sorarePrivateKey,
      sendRequest,
      sendSafeError,
      showWallet,
    ]
  );

  const signPaymentIntent = useCallback(
    async (id: string, amount: string) => {
      if (!currentUser?.sorarePrivateKey) {
        showWallet();
        return null;
      }
      const { result } = await sendRequest<SignPaymentIntent>(
        'signPaymentIntent',
        {
          id,
          amount,
        }
      );

      closeWalletAndDrawer();
      return result?.signature ? JSON.stringify(result.signature) : null;
    },
    [
      sendRequest,
      closeWalletAndDrawer,
      showWallet,
      currentUser?.sorarePrivateKey,
    ]
  );

  const signWalletChallenge = useCallback(
    async (challenge: string) => {
      if (!currentUser?.sorarePrivateKey) {
        showWallet();
        return null;
      }
      const { result } = await sendRequest<SignWalletChallenge>(
        'signWalletChallenge',
        { challenge }
      );

      closeWalletAndDrawer();
      return result?.signature || null;
    },
    [
      sendRequest,
      closeWalletAndDrawer,
      showWallet,
      currentUser?.sorarePrivateKey,
    ]
  );

  useEffect(() => {
    if (action === 'signup') {
      signUp();
    } else if (action === 'signin') {
      signIn();
    }
  }, [action, signIn, signUp]);

  useEffect(
    () =>
      registerHandler<RequestResize>(
        'requestPlaceholderResize',
        async dimensions => {
          updateLatestPromptDimensions(prevValue => {
            if (prevValue) {
              return {
                ...prevValue,
                size: dimensions,
              };
            }
            return prevValue;
          });
          return {};
        }
      ),
    [registerHandler]
  );

  useEffect(
    () =>
      registerHandler<RequestOAuth2>('requestOAuth', async ({ platform }) => {
        oauthHandlers.current.forEach(handler => handler(platform));
        return {};
      }),
    [registerHandler]
  );

  const registerOnWalletResizeRequestHandler = useCallback(callback => {
    updateDimensionsListener(listeners => {
      return [...listeners, callback];
    });
    return () => {
      updateDimensionsListener(listeners => {
        const index = listeners.indexOf(callback);
        if (index >= 0) {
          return [...listeners].splice(index, 1);
        }
        return listeners;
      });
    };
  }, []);

  const registerOAuthHandler = useCallback(callback => {
    oauthHandlers.current.push(callback);
    return () => {
      const index = oauthHandlers.current.indexOf(callback);
      if (index >= 0) {
        oauthHandlers.current.slice(index, 1);
      }
    };
  }, []);

  useEffect(() => {
    const size = latestPromptDimensions?.size;
    if (size) {
      dimensionsHandlers.forEach(handler => handler(size));
    }
  }, [latestPromptDimensions, dimensionsHandlers]);

  useEffect(
    () =>
      registerHandler<PasswordForgotten>('passwordForgotten', async () => {
        return passwordForgotten().then(() => ({}));
      }),
    [registerHandler, passwordForgotten]
  );

  return (
    <WalletContextProvider
      value={{
        approveAuthorizationRequests,
        setWindow,
        signIn,
        signUp,
        signUpMobileView,
        passwordForgotten,
        promptResetPassword,
        logOut,
        prompt,
        promptDeposit,
        promptRestoreWallet,
        selectedRecoveryOption,
        handleWalletSuccessullyRecovered,
        getPassword,
        checkUserPhoneNumberVerificationCodeWithRecovery,
        updateUserEmailWithPassword,
        updateUserWithPassword,
        signSettleDeal,
        signInternalTokensForDeal,
        approveMigrator,
        signMigration,
        signEthMigration,
        signLimitOrders,
        signTransfer,
        signPaymentIntent,
        signWalletChallenge,
        walletNode,
        setWalletNode,
        setOnWalletResizeRequest: registerOnWalletResizeRequestHandler,
        registerOAuthHandler,
      }}
    >
      {children}
    </WalletContextProvider>
  );
};

export default Wallet;
