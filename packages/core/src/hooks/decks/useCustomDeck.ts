import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  ListCustomDeckQuery,
  ListCustomDeckQueryVariables,
} from './__generated__/useCustomDeck.graphql';

const LIST_CUSTOM_DECK_QUERY = gql`
  query ListCustomDeckQuery($slug: String!, $name: String, $first: Int) {
    customDeck(slug: $slug, name: $name) {
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
` as TypedDocumentNode<ListCustomDeckQuery, ListCustomDeckQueryVariables>;

type Props = {
  name?: string;
  cardsToFetch?: number;
  skip?: boolean;
};
const useCustomDeckQuery = ({ name, cardsToFetch = 50, skip }: Props) => {
  const { data, refetch, loading } = useQuery(LIST_CUSTOM_DECK_QUERY, {
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
