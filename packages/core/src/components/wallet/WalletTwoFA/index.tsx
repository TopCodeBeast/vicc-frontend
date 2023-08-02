import { useCallback, useEffect, useState } from 'react';

import { EncryptedPrivateKey, Verify2FA } from '@sorare/wallet-shared';
import TwoFADialog from '@core/components/TwoFA/TwoFADialog';
import { GraphQLResult } from '@core/components/form/Form';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useMessagingContext } from '@core/contexts/wallet';
import { useFetchEncryptedPrivateKeyMutation } from '@core/hooks/auth/useFetchEncryptedPrivateKeyMutation';
import useFeatureFlags from '@core/hooks/useFeatureFlags';

type FetchEncryptedKeyData = {
  fetchEncryptedPrivateKey: {
    sorarePrivateKey: EncryptedPrivateKey;
  };
};

export const Wallet2FA = () => {
  const { currentUser } = useCurrentUserContext();
  const [fetchEncryptedPrivateKey] = useFetchEncryptedPrivateKeyMutation();
  const { registerHandler } = useMessagingContext();
  const { flags } = useFeatureFlags();

  const use2FA = flags['2FaWallet'] ?? true;

  const [open2FA, setOpen2FA] = useState<boolean>(false);
  const [twoFACallback, setTwoFACallback] = useState<{
    resolve: (params: FetchEncryptedKeyData) => void;
    reject: () => void;
  } | null>(null);

  const verify2FA = useCallback(async (): Promise<{
    result?: { userPrivateKey: EncryptedPrivateKey | undefined };
    error?: 'invalid-otp';
  }> => {
    if (!use2FA || !currentUser?.otpRequiredForLogin) return {};
    let abort = false;
    const data = await new Promise<FetchEncryptedKeyData>((resolve, reject) => {
      setTwoFACallback({ resolve, reject });
      setOpen2FA(true);
      return null;
    }).catch(() => {
      abort = true;
    });
    if (abort) {
      return {
        error: 'invalid-otp',
      };
    }
    return {
      result: {
        userPrivateKey:
          data?.fetchEncryptedPrivateKey.sorarePrivateKey || undefined,
      },
    };
  }, [use2FA, currentUser?.otpRequiredForLogin]);

  useEffect(
    () =>
      registerHandler<Verify2FA>('verify2FA', async () => {
        return verify2FA();
      }),
    [registerHandler, verify2FA]
  );

  const onSubmit = async (
    values: { otpAttempt: string },
    onResult: (result: GraphQLResult & { data?: any }) => void
  ) => {
    const { otpAttempt } = values;

    const response = await fetchEncryptedPrivateKey({
      variables: {
        input: {
          otpAttempt,
        },
      },
    });

    onResult(response!);
  };

  if (!currentUser) return null;
  if (!currentUser.otpRequiredForLogin) return null;

  return (
    <TwoFADialog
      onSubmit={(values, onResult) => {
        onSubmit(values, onResult);
      }}
      onSuccess={(
        res: GraphQLResult & {
          data?: FetchEncryptedKeyData;
        }
      ) => {
        if (res.data) {
          twoFACallback?.resolve(res.data);
          setOpen2FA(false);
        }
      }}
      onClose={() => {
        setOpen2FA(false);
      }}
      onCancel={() => {
        twoFACallback?.reject();
      }}
      open={open2FA}
      reason="walletUnlock"
    />
  );
};

export default Wallet2FA;
