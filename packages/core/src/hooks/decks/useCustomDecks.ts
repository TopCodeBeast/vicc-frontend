import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@core/hooks/graphql/useQuery';

import {
  ListCustomDecksQuery,
  ListCustomDecksQueryVariables,
} from './__generated__/useCustomDecks.graphql';

const LIST_CUSTOM_DECKS_QUERY = gql`
  query ListCustomDecksQuery(
    $query: String
    $slug: String!
    $hasSlug: Boolean!
  ) {
    currentUser @skip(if: $hasSlug) {
      slug
      customDecks(query: $query) {
        nodes {
          slug
          name
          cardsCount
          visible
        }
      }
    }
    user(slug: $slug) @include(if: $hasSlug) {
      slug
      customDecks(query: $query) {
        nodes {
          slug
          name
          cardsCount
          visible
        }
      }
    }
  }
` as TypedDocumentNode<ListCustomDecksQuery, ListCustomDecksQueryVariables>;

const useCustomDecksQuery = (query?: string, userSlug?: string) => {
  const { data, refetch, loading } = useQuery(LIST_CUSTOM_DECKS_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { query, hasSlug: !!userSlug, slug: userSlug || '' },
  });

  const user = data?.user || data?.currentUser;

  return {
    decks: user?.customDecks.nodes || [],
    refetch,
    loading,
  };
};

export default useCustomDecksQuery;
