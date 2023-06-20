import { useCallback } from 'react';

import { useEventsContext } from 'contexts/events';
import { ETH_WITHDRAWN_TRAIT } from 'contexts/events/Provider';
import { EventStep } from 'contexts/events/types';
import { EventsType } from '@sorare/core/src/lib/events/EventsType';
import useEvents from '@sorare/core/src/lib/events/useEvents';

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
