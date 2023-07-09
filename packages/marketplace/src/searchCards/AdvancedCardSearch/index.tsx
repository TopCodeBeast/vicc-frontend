import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import {
  InstantBlockchainCardSearch,
//   InstantCardSearch,
} from '@sorare/core/src/components/search/InstantSearch';
import {
  AnalyticTag,
  Props as InstantCardSearchProps,
} from '@sorare/core/src/components/search/InstantSearch/types';
import SearchCardsContextProvider from '@sorare/core/src/contexts/searchCards/Provider';

import SearchLayout from './SearchLayout';
import { Props } from './types';

export interface FullProps extends Props {
  sport: Sport;
  includeCommonCards?: boolean;
  defaultFilters?: string[];
  analyticsTags: AnalyticTag[];
  distinct?: InstantCardSearchProps['distinct'];
  defaultHitsPerPage?: number;
  editableLists?: boolean;
  alwaysShowFavoriteButton?: boolean;
}

const AdvancedCardSearch = ({
  children,
  sport,
  includeCommonCards,
  analyticsTags,
  defaultFilters,
  defaultSort,
  initialIndexUIState,
  cardFilters,
  advancedCardFilters,
  defaultHitsPerPage,
  editableLists,
  ...rest
}: FullProps) => {
  const index = defaultSort || rest.sorts[0];

  return (
    <>AdvancedCardSearch5</>
    // <SearchCardsContextProvider
    //   includeCommonCards={Boolean(includeCommonCards)}
    //   cardFilters={cardFilters}
    //   advancedCardFilters={advancedCardFilters}
    //   editableLists={editableLists}
    //   galleryOwnerSlug={rest.galleryOwnerSlug}
    // >
    //   <InstantCardSearch
    //     {...(index && { indexes: [index] })}
    //     analyticsTags={analyticsTags}
    //     sport={sport}
    //     defaultFilters={defaultFilters}
    //     urlState
    //     initialIndexUIState={initialIndexUIState}
    //     {...(defaultHitsPerPage && { defaultHitsPerPage })}
    //   >
    //     <SearchLayout
    //       cardFilters={cardFilters}
    //       advancedCardFilters={advancedCardFilters}
    //       {...rest}
    //     >
    //       {children}
    //     </SearchLayout>
    //   </InstantCardSearch>
    // </SearchCardsContextProvider>
  );
};

export default AdvancedCardSearch;

export const AdvancedBlockchainCardSearch = ({
  children,
  sport,
  analyticsTags,
  defaultFilters,
  defaultSort,
  distinct = false,
  initialIndexUIState,
  attributesToRetrieve,
  cardFilters,
  advancedCardFilters,
  defaultHitsPerPage,
  ...rest
}: FullProps) => {
  const index = defaultSort || rest.sorts[0];

  return (
    <SearchCardsContextProvider
      cardFilters={cardFilters}
      advancedCardFilters={advancedCardFilters}
    >
      <InstantBlockchainCardSearch
        {...(index && { indexes: [index] })}
        analyticsTags={analyticsTags}
        sport={sport}
        defaultFilters={defaultFilters}
        urlState
        distinct={distinct}
        initialIndexUIState={initialIndexUIState}
        attributesToRetrieve={attributesToRetrieve}
        {...(defaultHitsPerPage && { defaultHitsPerPage })}
      >
        <SearchLayout
          cardFilters={cardFilters}
          advancedCardFilters={advancedCardFilters}
          {...rest}
        >
          {children}
        </SearchLayout>
      </InstantBlockchainCardSearch>
    </SearchCardsContextProvider>
  );
};
