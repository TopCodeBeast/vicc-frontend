import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import {
  ListCustomDeckQuery,
  ListCustomDeckQueryVariables,
} from './__generated__/useCustomDeck.graphql';

const LIST_CUSTOM_DECK_QUERY = gql`
  query ListCustomDeckQuery($name: String, $first: Int) {
    customDeck(name: $name) {
      slug
      name
      cardsCount
      cards(first: $first) {
        nodes {
          assetId
          slug
          id
        }
      }
    }
  }
`;

type Props = {
  name?: string;
  cardsToFetch?: number;
  skip?: boolean;
};
const useCustomDeckQuery = ({ name, cardsToFetch = 50, skip }: Props) => {
  const { data, refetch, loading } = useQuery<
    ListCustomDeckQuery,
    ListCustomDeckQueryVariables
  >(LIST_CUSTOM_DECK_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { name, first: cardsToFetch },
    skip: !name || skip,
  });

  return {
    deck: data?.customDeck,
    refetch,
    loading,
  };
};

export default useCustomDeckQuery;
