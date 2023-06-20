import { gql } from '@apollo/client';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';

import AdvancedCardSearch, {
  AdvancedBlockchainCardSearch,
  FullProps,
} from '@sorare/marketplace/src/searchCards/AdvancedCardSearch';
import { SearchTopic } from '@sorare/marketplace/src/searchCards/AdvancedCardSearch/types';

import CardResultsFromGraphQL from '@sorare/football/src/components/searchCards/CardResultsFromGraphQL';

export const CardSearch = (
  props: Omit<FullProps, 'CardResultsComponent' | 'sport'> & {
    isBlockchain?: boolean;
    topic?: SearchTopic;
    distinct?: number | boolean;
    editableLists?: boolean;
  }
) => {
  const { isBlockchain, distinct, editableLists, ...rest } = props;
  return isBlockchain ? (
    <AdvancedBlockchainCardSearch
      CardResultsComponent={CardResultsFromGraphQL}
      sport={Sport.FOOTBALL}
      distinct={distinct}
      editableLists={editableLists}
      {...rest}
    />
  ) : (
    <AdvancedCardSearch
      CardResultsComponent={CardResultsFromGraphQL}
      sport={Sport.FOOTBALL}
      distinct={distinct}
      editableLists={editableLists}
      {...rest}
    />
  );
};

CardSearch.fragments = {
  card: gql`
    fragment AdvancedCardSearch_card on Card {
      slug
      assetId
      ...CardResultsFromGraphQL_card
    }
    ${CardResultsFromGraphQL.fragments.card}
  `,
};

export default CardSearch;
