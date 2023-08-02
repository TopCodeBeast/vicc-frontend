import { PrizesBlock } from '@core/components/landing/PrizesBlock';
import { JulioRodriguezPrize } from '@core/components/landing/PrizesBlock/JulioRodriguezPrize';

import { ACMilanPrize } from './ACMilanPrize';
import { GlobalEthPrize } from './GlobalEthPrize';
import { SevillaDerbyPrize } from './SevillaDerbyPrize';

export const Prizes = () => {
  return (
    <PrizesBlock>
      <ACMilanPrize />
      <GlobalEthPrize />
      <SevillaDerbyPrize />
      <JulioRodriguezPrize />
    </PrizesBlock>
  );
};
