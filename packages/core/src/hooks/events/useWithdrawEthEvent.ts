import { useCallback } from 'react';

import { useEventsContext } from '@core/contexts/events';
import { ETH_WITHDRAWN_TRAIT } from '@core/contexts/events/Provider';
import { EventStep } from '@core/contexts/events/types';
import { EventsType } from '@core/lib/events/EventsType';
import useEvents from '@core/lib/events/useEvents';

const useWithdrawEthEvent = () => {
  const { identify } = useEventsContext();
  const track = useEvents();
  const trackWithdrawEthEvent = useCallback(
    (step: EventStep, eventProps: EventsType['[Client] Withdraw ETH']) => {
      const { ethAmount, wallet } = eventProps;
      identify('', {
        traits: {
          [ETH_WITHDRAWN_TRAIT]: ethAmount,
        },
      });
      track(
        step === EventStep.FULFILLED
          ? '[Client] Withdraw ETH'
          : '[Client] Start Withdraw ETH',
        {
          wallet,
          ethAmount,
        }
      );
    },
    [identify, track]
  );

  return trackWithdrawEthEvent;
};

export default useWithdrawEthEvent;
