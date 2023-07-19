import { gql } from '@apollo/client';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Title4 } from '@sorare/core/src/atoms/typography';
import { InstantBlockchainCardSearch } from '@sorare/core/src/components/search/InstantSearch';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { groupBy } from '@sorare/core/src/lib/arrays';

import useDefaultFilters from '@sorare/marketplace/src/hooks/useDefaultFilters';

import CardRow from '@football/components/card/CardRow';

import {
  CardsOnSaleQuery,
  CardsOnSaleQueryVariables,
  CardsOnSale_user,
} from './__generated__/index.graphql';

interface Props {
  user: CardsOnSale_user;
}

const CARDS_ON_SALE_QUERY = gql`
  query CardsOnSaleQuery($slugs: [String!]!) {
    cards(slugs: $slugs) {
      slug
      assetId
      ...CardRow_card
    }
  }
  ${CardRow.fragments.card}
`;

const Section = styled(Title4)`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const CardsOnSale = () => {
  const { results: searchResults } = useInstantSearch();
  const { data } = useQuery<CardsOnSaleQuery, CardsOnSaleQueryVariables>(
    CARDS_ON_SALE_QUERY,
    {
      variables: { slugs: searchResults?.hits.map(h => h.objectID) },
      skip: searchResults?.hits?.length === 0,
    }
  );

  if (!data || data.cards.length === 0) return null;

  const cardsBySlug = groupBy(c => c!.slug, data.cards);

  return (
    <Section>
      <Title4>
        <FormattedMessage
          id="CardsOnSale.title"
          defaultMessage="Cards on sale"
        />
      </Title4>
      <CardRow
        cards={searchResults?.hits
          .map(h => cardsBySlug[h.objectID] && cardsBySlug[h.objectID][0]!)
          .filter(Boolean)}
      />
    </Section>
  );
};

const InstantCardsOnSale = ({ user }: Props) => {
  const filters = useDefaultFilters({
    secondary: true,
    userId: idFromObject(user.id),
  });

  return (
    <InstantBlockchainCardSearch
      indexes={['Newly Listed']}
      analyticsTags={['CardOnSale']}
      defaultHitsPerPage={5}
      sport={Sport.FOOTBALL}
      defaultFilters={filters}
    >
      <CardsOnSale />
    </InstantBlockchainCardSearch>
  );
};

export default InstantCardsOnSale;

CardsOnSale.fragments = {
  user: gql`
    fragment CardsOnSale_user on PublicUserInfoInterface {
      id
      slug
    }
  `,
};
