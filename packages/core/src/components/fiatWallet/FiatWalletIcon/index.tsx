import { FiatCurrency } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

import eurImg from './assets/eur.png';
import gpbImg from './assets/gpb.png';
import usdImg from './assets/usd.png';

export const FiatWalletIcon = () => {
  const {
    fiatCurrency: { code },
  } = useCurrentUserContext();
  switch (code) {
    case FiatCurrency.USD:
      return <img src={usdImg} alt="usd" />;
    case FiatCurrency.GBP:
      return <img src={gpbImg} alt="gbp" />;
    default:
      return <img src={eurImg} alt="usd" />;
  }
};
