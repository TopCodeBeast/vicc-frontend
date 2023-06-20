import { useCallback } from 'react';

import { useEventsContext } from '@sorare/core/src/contexts/events';
import { ETH_DEPOSITED_TRAIT } from '@sorare/core/src/contexts/events/Provider';
import { EventStep } from '@sorare/core/src/contexts/events/types';
import { EventsType } from '@sorare/core/src/lib/events/EventsType';
import useEvents from '@sorare/core/src/lib/events/useEvents';

const useDepositEthEvent = () => {
  const { identify } = useEventsContext();
  const track = useEvents();
  const trackDepositEthEvent = useCallback(
    (step: EventStep, eventProps: EventsType['[Client] Deposit ETH']) => {
      const { ethAmount, wallet } = eventProps;
      identify('', {
        traits: {
          [ETH_DEPOSITED_TRAIT]: ethAmount,
        },
      });
      track(
        step === EventStep.FULFILLED
          ? '[Client] Deposit ETH'
          : '[Client] Start Deposit ETH',
        {
          wallet,
          ethAmount,
        }
      );
    },
    [identify, track]
  );

  return trackDepositEthEvent;
};

export default useDepositEthEvent;
