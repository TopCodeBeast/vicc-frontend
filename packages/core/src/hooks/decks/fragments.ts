import { gql } from '@apollo/client';

export const first50DecksOnCurrentUserFragment = gql`
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
`;
