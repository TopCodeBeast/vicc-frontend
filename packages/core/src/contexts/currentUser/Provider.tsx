import { useSubscription } from '@apollo/client';
import Big from 'bignumber.js';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { Currency } from '__generated__/globalTypes';
import createLink from '@core/atoms/typography/Link';
import { SETTINGS_SECURITY } from '@core/constants/routes';
import { isType } from '@core/gql';
import idFromObject from '@core/gql/idFromObject';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { currencies } from '@core/lib/fiat';
import { asObject } from '@core/lib/json';

import { VERSION } from '../../config';
import { useConfigContext } from '../config';
import { useDeviceFingerprintContext } from '../deviceFingerprint';
import { useEventsContext } from '../events';
import { useSentryContext } from '../sentry';
import { useSessionContext } from '../session';
import { useSnackNotificationContext } from '../snackNotification';
import CurrentUserContextProvider, { SignInArgs } from './index';
import { subscription } from './queries';
import useRedirectAfterSignIn from './useRedirectAfterSignIn';
import useSignIn from './useSignIn';

interface Props {
  children: ReactNode;
}

/**
 * Provides the current logged in user.
 */
export const CurrentUserProvider = ({ children }: Props) => {
  const { setSessionId, setApiKey } = useSessionContext();
  const { identify: identifyAnalytics } = useEventsContext();
  const { identifyUser: identifySentryUser } = useSentryContext();
  const { currentUser, refetch, updateQuery, defaultFiatCurrency } =
    useConfigContext();
  const { showNotification } = useSnackNotificationContext();
  const [currentDeviceFingerPrint, setCurrentDeviceFingerPrint] =
    useState<string>();
  const [shouldResubscribe, setShouldResubscribe] = useState(false);
  const { flags, identify: identifyFeatureFlagsUser } = useFeatureFlags();
  const { deviceFingerprint } = useDeviceFingerprintContext();
  const [signInMutation] = useSignIn();
  const redirectUser = useRedirectAfterSignIn();

  useEffect(() => {
    deviceFingerprint()
      .then(v => setCurrentDeviceFingerPrint(v))
      .then(() => setShouldResubscribe(true));
  }, [deviceFingerprint]);

  useSubscription(subscription, {
    skip: !currentUser,
    shouldResubscribe,
    onComplete: () => {
      setShouldResubscribe(false);
    },
    context: {
      headers: {
        DEVICE_FINGERPRINT: currentDeviceFingerPrint,
      },
    },
  });

  const signIn = useCallback(
    async (args: SignInArgs) => {
      const result = await signInMutation(args);

      if (result?.currentUser) {
        // update the currentConfigQuery with the signed in user
        updateQuery(result.currentUser);
        redirectUser(result.currentUser);
      }
      return result;
    },
    [signInMutation, updateQuery, redirectUser]
  );

  const blockchainCardsCount = currentUser
    ? currentUser.cardCounts.limited +
      currentUser.cardCounts.rare +
      currentUser.cardCounts.superRare +
      currentUser.cardCounts.unique
    : 0;

  useEffect(() => {
    if (currentUser?.id && identifyFeatureFlagsUser) {
      identifyFeatureFlagsUser({
        key: currentUser.id,
        custom: {
          ...asObject(currentUser.featureFlagCustomAttributes),
          webVersion: +VERSION,
        },
      });
    }
  }, [
    identifyFeatureFlagsUser,
    currentUser?.id,
    currentUser?.featureFlagCustomAttributes,
  ]);

  useEffect(() => {
    if (identifySentryUser) {
      identifySentryUser(
        currentUser
          ? {
              id: idFromObject(currentUser?.id),
              username: currentUser?.slug,
            }
          : null
      );
    }
  }, [currentUser, identifySentryUser]);

  useEffect(() => {
    setSessionId(currentUser?.id);
  }, [currentUser?.id, setSessionId]);

  useEffect(() => {
    setApiKey(currentUser?.apiKey);
  }, [currentUser?.apiKey, setApiKey]);

  useEffect(() => {
    if (currentUser?.id) {
      identifyAnalytics(idFromObject(currentUser.id)!, {
        created: currentUser?.createdAt,
        mlbOnboarded: currentUser?.baseballProfile?.onboarded,
        feature_flags: flags,
      });
    }
  }, [
    currentUser?.id,
    currentUser?.createdAt,
    identifyAnalytics,
    flags,
    currentUser?.baseballProfile?.onboarded,
  ]);

  const availableBalanceForWithdrawalPositive = currentUser
    ? new Big(currentUser.availableBalanceForWithdrawal).gt(0)
    : false;

  useEffect(() => {
    if (
      !currentUser?.otpRequiredForLogin &&
      currentUser?.confirmed &&
      (blockchainCardsCount > 0 || availableBalanceForWithdrawalPositive)
    ) {
      showNotification('secondFactorRecommendation', {
        link: createLink(SETTINGS_SECURITY),
      });
    }
  }, [
    currentUser?.id,
    currentUser?.otpRequiredForLogin,
    currentUser?.confirmed,
    availableBalanceForWithdrawalPositive,
    blockchainCardsCount,
    showNotification,
  ]);

  const fiatWalletAccountable = useMemo(() => {
    if (!currentUser) return null;
    return currentUser.accounts
      .map(a =>
        isType(a.accountable, 'FiatWalletAccount') ? a.accountable : null
      )
      .filter(Boolean)?.[0];
  }, [currentUser]);

  const fiatCurrency = useMemo(() => {
    if (fiatWalletAccountable) {
      return currencies[fiatWalletAccountable.currency.toLowerCase()];
    }
    return (
      currencies[
        currentUser?.userSettings.fiatCurrency?.toLowerCase() as keyof typeof currencies
      ] || defaultFiatCurrency
    );
  }, [
    currentUser?.userSettings.fiatCurrency,
    defaultFiatCurrency,
    fiatWalletAccountable,
  ]);

  const currency = useMemo(
    () => currentUser?.userSettings.currency || Currency.FIAT,
    [currentUser]
  );

  const displayEth = useMemo(
    () =>
      Boolean(
        currentUser?.depositedEth ||
          (currentUser?.availableBalanceForWithdrawal &&
            new Big(currentUser?.availableBalanceForWithdrawal).gt(0))
      ),
    [currentUser]
  );

  return (
    <CurrentUserContextProvider
      value={{
        currentUser,
        currency,
        fiatCurrency,
        fiatWalletAccountable,
        displayEth,
        refetch,
        signIn,
        blockchainCardsCount,
      }}
    >
      {children}
    </CurrentUserContextProvider>
  );
};

export default CurrentUserProvider;
