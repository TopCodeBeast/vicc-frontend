import {
  AdvancedBlockchainCardSearch,
  FullProps,
} from '@sorare/marketplace/src/searchCards/AdvancedCardSearch';

import CardResultsFromGraphQL from '@sorare/football/src/components/searchCards/CardResultsFromGraphQL';

export const CardSearch = (
  props: Omit<FullProps, 'CardResultsComponent' | 'sport'> & {}
) => {
  const { ...rest } = props;
  return (
    <AdvancedBlockchainCardSearch
      CardResultsComponent={CardResultsFromGraphQL}
      {...rest}
    />
  );
};

export default CardSearch;
