import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

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
        amount
        amountInFiat {
          eur
          usd
          gbp
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
`;

const useGetPriceHistory = (args: PriceHistoryQueryVariables) => {
  const prepareAcceptOffer = useQuery<
    PriceHistoryQuery,
    PriceHistoryQueryVariables
  >(PRICE_HISTORY_QUERY, {
    variables: args,
  });
  return prepareAcceptOffer;
};

export default useGetPriceHistory;
