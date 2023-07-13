import { useCallback } from 'react';

// import { useEventsContext } from '@core/contexts/events';
// import { ETH_DEPOSITED_TRAIT } from '@core/contexts/events/Provider';
import { EventStep } from '@core/contexts/events/types';
import { EventsType } from '@core/lib/events/EventsType';
import useEvents from '@core/lib/events/useEvents';

const useDepositEthEvent = () => {
  // const { identify } = useEventsContext();
  // const track = useEvents();
  const trackDepositEthEvent = useCallback(
    (step: EventStep, eventProps: EventsType['[Client] Deposit ETH']) => {
      // const { ethAmount, wallet } = eventProps;
      // identify('', {
      //   traits: {
      //     [ETH_DEPOSITED_TRAIT]: ethAmount,
      //   },
      // });
      // track(
      //   step === EventStep.FULFILLED
      //     ? '[Client] Deposit ETH'
      //     : '[Client] Start Deposit ETH',
      //   {
      //     wallet,
      //     ethAmount,
      //   }
      // );
    },
    []//[identify, track]
  );

  return trackDepositEthEvent;
};

export default useDepositEthEvent;
