import { useCallback, useContext, useEffect } from 'react';

import {
  EncryptedPrivateKey,
  GenerateKey,
  MessagingContext,
  SignIn,
} from '@sorare/wallet-shared';
import { useAuthContext } from '@core/contexts/auth';
import {
  AcceptTermsInfo,
  SignedInInfo,
  useConnectionContext,
} from '@core/contexts/connection';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { nullAddress } from '@core/lib/ethereum';
import useEvents from '@core/lib/events/useEvents';
import { mustAcceptTermsOfServiceFlag } from '@core/lib/mustAcceptTermsOfServiceFlag';

const RATE_LIMIT_STATUS_CODE = 429;

export default () => {
  const { registerHandler, sendRequest } = useContext(MessagingContext)!;
  const track = useEvents();
  const { updateUser } = useAuthContext();
  const { prompt2fa, promptNewDeviceConfirmation, promptTerms } =
    useConnectionContext();
  const { signIn } = useCurrentUserContext();
  const {
    flags: { lastTermsOfServiceUpdatedAt = '' },
  } = useFeatureFlags();

  const mustAcceptTermsFlag = mustAcceptTermsOfServiceFlag(
    lastTermsOfServiceUpdatedAt
  );

  const onSignedIn = useCallback(
    async (
      {
        email,
        sorareAddress,
        sorarePrivateKey,
        error,
        mustAcceptTcus,
        ...rest
      }: SignedInInfo,
      passwordHash: string
    ) => {
      let address = sorareAddress;
      let userPrivateKey = sorarePrivateKey;

      if (!sorareAddress || sorareAddress === nullAddress) {
        const { result } = await sendRequest<GenerateKey>('generateKey', {
          email,
        });

        if (result) {
          const { wallet } = result;
          const {
            ethereumAddress,
            passwordEncryptedPrivateKey: { iv, salt, payload },
          } = wallet;

          address = ethereumAddress;
          userPrivateKey = {
            iv,
            salt,
            encryptedPrivateKey: payload,
          };

          await updateUser({
            currentPasswordHash: passwordHash,
            ...wallet,
          });
        }
      }
      if (mustAcceptTcus && mustAcceptTermsFlag) {
        promptTerms({
          closable: true,
        });
      }

      return {
        result: {
          ...rest,
          address: address as string,
          userPrivateKey: userPrivateKey as EncryptedPrivateKey,
          email,
        },
        error,
      };
    },
    [sendRequest, updateUser, promptTerms, mustAcceptTermsFlag]
  );

  useEffect(
    () =>
      registerHandler<SignIn>('signIn', async ({ email, passwordHash }) => {
        try {
          const response = await signIn({
            email,
            passwordHash,
          });
          if (!response) return { error: 'Unexpected' };

          const { otpSessionChallenge, currentUser, errors, tcuToken } =
            response;

          if (
            errors.length > 0 &&
            errors[0].message === 'authenticate_from_new_device'
          ) {
            promptNewDeviceConfirmation();
            return {};
          }

          if (errors.length > 0 && errors[0].message === 'must_accept_tcus') {
            await new Promise<AcceptTermsInfo>((resolve, reject) => {
              return promptTerms(
                {
                  closable: false,
                  tcuToken,
                },
                { resolve, reject }
              );
            });
            return {};
          }

          if (errors.length > 0 && errors[0].message === 'unconfirmed') {
            track('View Unconfirmed Email Error On SignUp');
          }

          if (otpSessionChallenge) {
            // get challenge reason
            const reason = errors.length === 1 ? errors[0].message : undefined;

            const res = await new Promise<SignedInInfo>((resolve, reject) => {
              return prompt2fa(
                { resolve, reject },
                otpSessionChallenge,
                reason
              );
            });
            return onSignedIn(res, passwordHash);
          }

          if (errors.length)
            return { error: errors.map(e => e.message).join(', ') };
          if (!currentUser) return { error: 'Unexpected' };

          return onSignedIn(currentUser as any, passwordHash);
        } catch (error: any) {
          if (error === 'has_accepted_tcus_after_2FA') return {};
          if (error.networkError?.statusCode === RATE_LIMIT_STATUS_CODE)
            return { error: 'rate-limit' };
          return { error };
        }
      }),
    [
      registerHandler,
      signIn,
      track,
      onSignedIn,
      prompt2fa,
      promptNewDeviceConfirmation,
      promptTerms,
    ]
  );
};
