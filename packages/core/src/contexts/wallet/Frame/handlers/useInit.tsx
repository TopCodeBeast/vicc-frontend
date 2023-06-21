import { useContext, useEffect, useMemo, useState } from 'react';

import { Dict, Init, LogOut, MessagingContext } from '@sorare/wallet-shared';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import useCurrencyConverters from '@core/hooks/useCurrencyConverters';
import useFeatureFlags from '@core/hooks/useFeatureFlags';

import { messages } from '../../messages';

const selectedFlags = ['lastTermsOfServiceUpdatedAt'];

type SelectedFlagType = (typeof selectedFlags)[number];

const defaultsForSelectedFlags: { [key in SelectedFlagType]?: any } = {};

export default () => {
  const { sendRequest, registerHandler } = useContext(MessagingContext)!;
  const { currentUser, fiatCurrency } = useCurrentUserContext();
  const { convertFromEth } = useCurrencyConverters();
  const { formatMessage, dir } = useIntlContext();

  const { flags } = useFeatureFlags();
  const [, setInitializedAs] = useState<string>();

  const dict = useMemo(
    () =>
      Object.entries(messages).reduce<Dict>((sum, cur) => {
        const key = cur[0] as keyof Dict;
        sum[key] = formatMessage(cur[1]);
        return sum;
      }, {} as any),
    [formatMessage]
  );

  const featureFlags = useMemo(
    () => ({
      ...defaultsForSelectedFlags,
      ...Object.fromEntries(
        Object.entries(flags).filter(([key]) => selectedFlags.includes(key))
      ),
    }),
    [flags]
  );
  useEffect(() => {
    setInitializedAs(prevState => {
      if (!prevState) {
        return prevState;
      }
      if (currentUser?.id !== prevState) {
        sendRequest<LogOut>('logOut', {
          flushMessagingQueue: true,
        });
        return undefined;
      }
      return prevState;
    });
  }, [currentUser?.id, sendRequest]);

  useEffect(
    () =>
      registerHandler<Init>('init', async () => {
        const result = {
          dict,
          featureFlags,
          currency: fiatCurrency,
          langDir: dir,
          ethRate: convertFromEth('1', fiatCurrency.code),
        };

        if (!currentUser) {
          setInitializedAs(undefined);
          return { result };
        }

        const {
          id,
          email,
          nickname,
          sorareAddress,
          starkKey,
          sorarePrivateKey,
        } = currentUser;

        setInitializedAs(id);

        return {
          result: {
            ...result,
            user: {
              email,
              nickname,
              address: sorareAddress || undefined,
              userPrivateKey: sorarePrivateKey || undefined,
              starkKey: starkKey || undefined,
            },
          },
        };
      }),
    [
      convertFromEth,
      fiatCurrency,
      currentUser,
      dict,
      registerHandler,
      dir,
      featureFlags,
    ]
  );
};
