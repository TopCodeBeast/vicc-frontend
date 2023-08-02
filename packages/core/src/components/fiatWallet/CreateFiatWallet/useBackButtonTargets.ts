import { useMemo } from 'react';

import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';

import { CreateFiatWalletSteps } from './type';

const staticBackTargets: Record<
  CreateFiatWalletSteps,
  CreateFiatWalletSteps | undefined
> = {
  [CreateFiatWalletSteps.WHATS_NEW]: undefined,
  [CreateFiatWalletSteps.HANDLE_ID_REVIEW_ERROR]: undefined,
  [CreateFiatWalletSteps.INTRO]: undefined,
  [CreateFiatWalletSteps.TELL_US_ABOUT_YOU]: CreateFiatWalletSteps.INTRO,
  [CreateFiatWalletSteps.CHOOSE_CURRENCY]:
    CreateFiatWalletSteps.TELL_US_ABOUT_YOU,
  [CreateFiatWalletSteps.CHOOSE_DOCUMENT]:
    CreateFiatWalletSteps.ACTIVATION_SUCCESS,
  [CreateFiatWalletSteps.UPLOAD]: CreateFiatWalletSteps.CHOOSE_DOCUMENT,
  [CreateFiatWalletSteps.REVIEW_INFO_BEFORE_ADDING_ID]:
    CreateFiatWalletSteps.INTRO,
  [CreateFiatWalletSteps.DOCUMENT_UNDER_REVIEW]: undefined,
  [CreateFiatWalletSteps.ACTIVATION_SUCCESS]: undefined,
};

type Props = {
  initialStep?: CreateFiatWalletSteps;
};
export const useBackButtonTargets = ({ initialStep }: Props) => {
  const { canListAndTrade } = useFiatBalance();
  const backTargets = useMemo(
    () => ({
      ...staticBackTargets,
      ...(initialStep === CreateFiatWalletSteps.WHATS_NEW && {
        [CreateFiatWalletSteps.INTRO]: initialStep,
      }),
      ...(initialStep === CreateFiatWalletSteps.HANDLE_ID_REVIEW_ERROR && {
        [CreateFiatWalletSteps.CHOOSE_DOCUMENT]: initialStep,
      }),
    }),
    [initialStep]
  );

  return useMemo(() => {
    if (
      canListAndTrade &&
      initialStep !== CreateFiatWalletSteps.HANDLE_ID_REVIEW_ERROR
    ) {
      return {
        ...backTargets,
        [CreateFiatWalletSteps.CHOOSE_DOCUMENT]: CreateFiatWalletSteps.INTRO,
      };
    }
    return backTargets;
  }, [canListAndTrade, initialStep, backTargets]);
};
