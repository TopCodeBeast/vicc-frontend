import {
  InstantBlockchainCardSearch,
} from '@sorare/core/src/components/search/InstantSearch';
import SearchCardsContextProvider from '@sorare/core/src/contexts/searchCards/Provider';

import SearchLayout from './SearchLayout';
import { Props } from './types';

export interface FullProps extends Props {

}

export const AdvancedBlockchainCardSearch = ({ children, ...rest }: FullProps) => {
  return (
    <SearchCardsContextProvider>
      <InstantBlockchainCardSearch>
        <SearchLayout {...rest}>
          {children}
        </SearchLayout>
      </InstantBlockchainCardSearch>
    </SearchCardsContextProvider>
  );
};
