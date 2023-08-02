import { TypedDocumentNode, gql } from '@apollo/client';

import User from '@sorare/core/src/components/user/User';

import EditableDeckCard from '@football/components/deck/EditableDeckCard';

import { CustomDeck_customDeck } from './__generated__/fragments.graphql';

export const deckFragment = gql`
  fragment CustomDeck_customDeck on CustomDeck {
    slug
    visible
    name
    user {
      slug
      ...User_user
    }
    deckCardsCount
    deckCards(first: 30, after: $after) {
      nodes {
        id
        ...EditableDeckCard_deckCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${User.fragments.user}
  ${EditableDeckCard.fragments.deckCard}
` as TypedDocumentNode<CustomDeck_customDeck>;
