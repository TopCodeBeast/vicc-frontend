import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import generateUseEvents from '@sorare/core/src/lib/events/generateUseEvents';

import { TokenTransferValidatorProps } from '@marketplace/components/token/TokenTransferValidator/types';

type MarketplaceEventTypes = {
  '[Client] Listed after too low warning': {
    ethAmount: number;
  };
  '[Client] Warning Listing too low': {
    ethAmount: number;
  };
  'Click List Card': {
    cardSlug: string;
    hasWarnings: boolean;
  };
  'Click Submit List Card': {
    cardSlug: string;
    hasWarnings: boolean;
  };
  'Click Submit Trade': void;
  'Starter Bundles Payment successful': void;
  'Starter Bundles Dialog Open': {
    sport: Sport;
  };
  'Starter Bundles Click Use Your Cards': {
    sport: Sport;
  };
  'Toggle Transfer Consent Message': {
    value: boolean;
    transferContext: TokenTransferValidatorProps['transferContext'];
  };
};

export const useMarketplaceEvents = generateUseEvents<MarketplaceEventTypes>();
