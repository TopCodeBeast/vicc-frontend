import { ReactNode, createContext, useCallback, useContext } from 'react';

import { Sport } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useLocalStorage from '@core/hooks/useLocalStorage';
import { local as localStorage } from '@core/lib/storage';

import { useLocalStorageKey } from './useLocalStorageKey';

type CardOption = {
  player: {
    id: string;
    slug: string;
    displayName: string;
  };
  commonCardImageUrl: string;
};

type OnboardingState = {
  step: number;
  cardOption?: CardOption;
};

const OnboardingContext = createContext<
  | (OnboardingState & {
      sport: Sport;
      nextStep: () => void;
      setCardOption: (cardOption: CardOption) => void;
      clearOnboardingState: () => void;
    })
  | null
>(null);

type Props = {
  sport: Sport;
  nbSteps: number;
};
export const useOnboardingState = ({ sport, nbSteps }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const KEY = useLocalStorageKey(sport, currentUser!.id);
  const [onboardingState, setOnboardingState] =
    useLocalStorage<OnboardingState>(KEY, { step: 0, cardOption: undefined });

  const clearOnboardingState = useCallback(() => {
    setOnboardingState({ step: 0 });
    localStorage.removeItem(KEY);
  }, [KEY, setOnboardingState]);

  const nextStep = useCallback(() => {
    if (!onboardingState) return;
    if (onboardingState.step! >= nbSteps - 1) {
      clearOnboardingState();
      return;
    }
    setOnboardingState(previousState => {
      return {
        ...previousState,
        step: previousState.step! + 1,
      };
    });
  }, [clearOnboardingState, nbSteps, onboardingState, setOnboardingState]);

  const setCardOption = useCallback(
    (cardOption: CardOption) => {
      setOnboardingState(previousState => {
        return {
          ...previousState,
          cardOption,
        };
      });
    },
    [setOnboardingState]
  );

  return {
    ...onboardingState,
    sport,
    nextStep,
    nbSteps,
    setCardOption,
    clearOnboardingState,
  };
};

export const useOnboardingContext = () => useContext(OnboardingContext)!;

export const OnboardingContextProvider = ({
  sport,
  nbSteps,
  children,
}: {
  sport: Sport;
  nbSteps: number;
  children: ReactNode;
}) => {
  return (
    <OnboardingContext.Provider value={useOnboardingState({ sport, nbSteps })}>
      {children}
    </OnboardingContext.Provider>
  );
};
