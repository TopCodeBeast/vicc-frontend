import { FiatCurrency } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import useFeatureFlags from './useFeatureFlags';

const useMangopayCreditCardsEnabled = () => {
  const {
    flags: { useMangopayCreditCards = false },
  } = useFeatureFlags();
  const { currentUser } = useCurrentUserContext();

  return (
    useMangopayCreditCards &&
    currentUser?.userSettings?.fiatCurrency !== FiatCurrency.USD
  );
};

export default useMangopayCreditCardsEnabled;
