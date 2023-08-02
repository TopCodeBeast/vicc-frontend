import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import {
  PriceHistoryQuery,
  PriceHistoryQueryVariables,
} from './__generated__/useGetPriceHistory.graphql';

const PRICE_HISTORY_QUERY = gql`
  query PriceHistoryQuery(
    $playerSlug: String!
    $collection: Collection!
    $rarity: Rarity!
  ) {
    tokens {
      tokenPrices(
        playerSlug: $playerSlug
        collection: $collection
        rarity: $rarity
      ) {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        date
        deal {
          ... on TokenAuction {
            id
            nfts {
              assetId
              slug
              collection
              sport
              pictureUrl: pictureUrl(derivative: "tinified")
            }
          }
          ... on TokenOffer {
            id
            senderSide {
              id
              nfts {
                assetId
                slug
                collection
                sport
                pictureUrl: pictureUrl(derivative: "tinified")
              }
            }
          }
          ... on TokenPrimaryOffer {
            id
            nfts {
              assetId
              slug
              collection
              sport
              pictureUrl: pictureUrl(derivative: "tinified")
            }
          }
        }
      }
    }
  }
  ${monetaryAmountFragment}
` as TypedDocumentNode<PriceHistoryQuery, PriceHistoryQueryVariables>;

const useGetPriceHistory = (args: PriceHistoryQueryVariables) => {
  const prepareAcceptOffer = useQuery(PRICE_HISTORY_QUERY, {
    variables: args,
  });
  return prepareAcceptOffer;
};

export default useGetPriceHistory;
