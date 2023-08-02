import { TypedDocumentNode, gql } from '@apollo/client';

import { first50DecksOnCurrentUserFragment } from './__generated__/fragments.graphql';

export const FIRST50_DECKS_ON_CURRENT_USER_FRAGMENT = gql`
  fragment first50DecksOnCurrentUserFragment on CurrentUser {
    slug
    customDecks(first: 50) {
      nodes {
        id
        slug
        name
        cardsCount
        visible
      }
    }
  }
` as TypedDocumentNode<first50DecksOnCurrentUserFragment>;
