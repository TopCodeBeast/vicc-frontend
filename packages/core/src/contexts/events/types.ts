import { ApolloClient, gql } from '@apollo/client';

// import {
//   Analytics_cardInfo,
//   Analytics_tokenInfo,
//   CardAnalyticsInfoQuery,
//   CardAnalyticsInfoQueryVariables,
//   TokenAnalyticsInfoQuery,
//   TokenAnalyticsInfoQueryVariables,
// } from './__generated__/types.graphql';

export enum EventStep {
  STARTED = 'STARTED',
  FULFILLED = 'FULFILLED',
}

export const fragments = {
  cardInfo: gql`
    fragment Analytics_cardInfo on Card {
      slug
      assetId
      name
      lastFiveSo5AverageScore: averageScore(type: LAST_FIVE_VICC5_AVERAGE_SCORE)
      lastFifteenVicc5AverageScore: averageScore(
        type: LAST_FIFTEEN_VICC5_AVERAGE_SCORE
      )
      player {
        slug
        activeClub {
          slug
          domesticLeague {
            slug
          }
        }
        lastFiveVicc5Appearances
        lastFifteenVicc5Appearances
      }
      position: positionTyped
      rarity
      season {
        startYear
      }
      serialNumber
      team {
        ... on TeamInterface {
          slug
        }
      }
      user {
        slug
      }
    }
  `,

  tokenInfo: gql`
    fragment Analytics_tokenInfo on Token {
      assetId
      slug
      name
      metadata {
        ... on TokenCricketMetadata {
          id
          playerPosition
        }
        ... on TokenCardMetadataInterface {
          playerDisplayName
          playerSlug
          rarity
          seasonStartYear
          serialNumber
          singleCivilYear
          teamSlug
        }
      }
      owner {
        id
        user {
          slug
        }
      }
    }
  `,
};

// const CARD_ANALYTICS_INFO_QUERY = gql`
//   query CardAnalyticsInfoQuery($assetId: String!) {
//     cardByAssetId(assetId: $assetId) {
//       slug
//       assetId
//       name
//       ...Analytics_cardInfo
//     }
//   }
//   ${fragments.cardInfo}
// `;

// const TOKEN_ANALYTICS_INFO_QUERY = gql`
//   query TokenAnalyticsInfoQuery($assetId: String!) {
//     tokens {
//       nft(assetId: $assetId) {
//         slug
//         assetId
//         ...Analytics_tokenInfo
//       }
//     }
//   }
//   ${fragments.tokenInfo}
// `;

// export const getCardFromAssetId = async (
//   client: ApolloClient<object>,
//   assetId: string
// ): Promise<Analytics_cardInfo> =>
//   client
//     .query<CardAnalyticsInfoQuery, CardAnalyticsInfoQueryVariables>({
//       query: CARD_ANALYTICS_INFO_QUERY,
//       variables: {
//         assetId,
//       },
//       fetchPolicy: 'cache-first',
//     })
//     .then(value => {
//       return value.data?.cardByAssetId;
//     });

// export const getTokenFromAssetId = async (
//   client: ApolloClient<object>,
//   assetId: string
// ): Promise<Analytics_tokenInfo> =>
//   client
//     .query<TokenAnalyticsInfoQuery, TokenAnalyticsInfoQueryVariables>({
//       query: TOKEN_ANALYTICS_INFO_QUERY,
//       variables: {
//         assetId,
//       },
//       fetchPolicy: 'cache-first',
//     })
//     .then(value => {
//       return value.data?.tokens?.nft;
//     });

// export const getCardsFromAssetIds = async (
//   client: ApolloClient<object>,
//   assetIds: string[]
// ): Promise<Analytics_cardInfo[]> =>
//   Promise.all(
//     assetIds.map(async assetId => getCardFromAssetId(client, assetId))
//   );

// export const getTokensFromAssetIds = async (
//   client: ApolloClient<object>,
//   assetIds: string[]
// ): Promise<Analytics_tokenInfo[]> =>
//   Promise.all(
//     assetIds.map(async assetId => getTokenFromAssetId(client, assetId))
//   );
