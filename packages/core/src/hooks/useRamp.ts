import {
  RampInstantEventTypes,
  RampInstantSDK,
} from '@ramp-network/ramp-instant-sdk';
import { useCallback, useEffect, useState } from 'react';

import { FRONTEND_ASSET_HOST } from '@core/constants/assets';
import { RAMP_TRANSACTION_WEBHOOK } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { EventStep } from '@core/contexts/events/types';
import { useSentryContext } from '@core/contexts/sentry';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { Wallet } from '@core/lib/web3';
import { RoundingMode, fromWei } from '@core/lib/wei';

import { RAMP_API_KEY, RAMP_URL } from '../config';
import useDepositEthEvent from './events/useDeposithEthEvent';

const hostAppName = 'Sorare';
const hostLogoUrl = `${FRONTEND_ASSET_HOST}/wallet/logo.png`;

export default () => {
  const trackDepositEthEvent = useDepositEthEvent();
  const { currentUser } = useCurrentUserContext();
  const { sendSafeError } = useSentryContext();
  const { setCurrentTab } = useWalletDrawerContext();
  const swapAsset = 'STARKSORARE_ETH';
  const userAddress = currentUser?.starkKey;
  const available = Boolean(userAddress) && currentUser?.rampSupported;
  const webhookStatusUrl = `${RAMP_TRANSACTION_WEBHOOK}?externalCustomerId=${currentUser?.id}`;

  const generate = useCallback(
    () =>
      new RampInstantSDK({
        variant: 'auto',
        swapAsset,
        hostApiKey: RAMP_API_KEY,
        hostAppName,
        url: RAMP_URL || undefined,
        userAddress: userAddress!,
        userEmailAddress: currentUser?.email,
        hostLogoUrl,
        webhookStatusUrl,
      }),
    [swapAsset, userAddress, webhookStatusUrl, currentUser?.email]
  );
  const [sdk, setSdk] = useState(generate());

  const show = useCallback(() => {
    try {
      sdk.show();
    } catch (e: any) {
      if (
        typeof e.message === 'string' &&
        e.message.match(/already visible/i)
      ) {
        setSdk(generate());
        setTimeout(() => show(), 0);
      }
    }
  }, [generate, sdk]);

  useEffect(() => {
    sdk.on('*', event => {
      switch (event.type) {
        case RampInstantEventTypes.PURCHASE_CREATED: // no more 'PURCHASE_SUCCESSFUL' in 3.x
          trackDepositEthEvent(
            // while it's only `PURCHASE_CREATED` on the Ramp side,
            // it will ultimately get fulfilled (100% of cases) so we can considered this fulfilled
            EventStep.FULFILLED,
            {
              ethAmount: fromWei(
                event.payload.purchase.cryptoAmount,
                4,
                RoundingMode.ROUND_DOWN
              ),
              wallet: Wallet.RAMP,
            }
          );
          // We redirect user to wallet home screen
          setCurrentTab(WalletTab.HOME);
          break;
        case RampInstantEventTypes.WIDGET_CLOSE:
          setSdk(generate());
          break;
        case RampInstantEventTypes.WIDGET_CONFIG_DONE:
          try {
            sdk!.domNodes!.overlay!.style!.zIndex = '2500';
          } catch (err) {
            sendSafeError(err);
          }
          break;
        default:
      }
    });
  }, [sdk, generate, trackDepositEthEvent, sendSafeError, setCurrentTab]);

  return { available, show };
};
