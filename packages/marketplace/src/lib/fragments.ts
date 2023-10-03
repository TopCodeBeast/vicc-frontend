import { TypedDocumentNode, gql } from '@apollo/client';

// Eslint disable because: we cannot import fragments on token in baseball + Rules component not used
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import ActiveUserAvatar from '@sorare/core/src/components/user/ActiveUserAvatar';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import ItemSold from '@marketplace/components/ItemPreview/ItemSold';
import { PromotedToken } from '@marketplace/components/PromotedToken';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import { TradeButton } from '@marketplace/components/TradeButton';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import BidHistory from '@marketplace/components/auction/BidHistory';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import OpenAuction from '@marketplace/components/auction/OpenAuction';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import MinimumPrice from '@marketplace/components/directOffer/MinimumPrice';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import CurrentOwner from '@marketplace/components/offer/CurrentOwner';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import SingleSaleOffer from '@marketplace/components/offer/SingleSaleOffer';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import PrimaryOfferPreview from '@marketplace/components/primaryOffer/PrimaryOfferPreview';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import PrimaryOfferSale from '@marketplace/components/primaryOffer/PrimaryOfferSale';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import PrimaryOfferTokensSummary from '@marketplace/components/primaryOffer/PrimaryOfferTokensSummary';
import CardPreview from '@marketplace/components/starterbundle/CardPreview';
import MobileCardPreview from '@marketplace/components/starterbundle/MobileCardPreview';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import FlexToken from '@marketplace/components/token/FlexToken';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import OwnershipHistory from '@marketplace/components/token/OwnershipHistory';
import { Token } from '@marketplace/components/token/Token';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import TokenDescription from '@marketplace/components/token/TokenDescription';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import TokenFavoriteButton from '@marketplace/components/token/TokenFavoriteButton';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import BlockchainInfo from '@marketplace/components/token/TokenPage/BlockchainInfo';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import TokensAvailableOnPrimaryWhenInsufficientFundsInWallet from '@marketplace/components/token/TokenPage/TokensAvailableOnPrimaryWhenInsufficientFundsInWallet';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import TokenWithdrawal from '@marketplace/components/token/TokenWithdrawal';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import SmallUser from '@marketplace/components/user/SmallUser';

import {
  InterstitialPrimaryOfferQueryByIds,
  InterstitialPrimaryOfferQueryByIdsVariables,
  PrimaryOfferByIdQuery,
  PrimaryOfferByIdQueryVariables,
  PrimaryOfferUpdate,
  PrimaryOfferUpdateVariables,
  PrimaryOffersByIdsQuery,
  PrimaryOffersByIdsQueryVariables,
  PromotedTokensByIds,
  PromotedTokensByIdsVariables,
  TokenAuctionUpdate,
  TokenAuctionUpdateVariables,
  TokenBidSubscription_bidConnection,
  TokenBidderSubscription_blockchainUser,
  TokenByIdQuery,
  TokenByIdQueryVariables,
  TokenOfferUpdate,
  TokenOfferUpdateVariables,
  TokensByIdsQuery,
  TokensByIdsQueryVariables,
  UserBySlugQuery,
  UserBySlugQueryVariables,
} from './__generated__/fragments.graphql';

// /!\
// This is a temporary query for Baseball's marketplace
// getting the bundleAuctions from Slugs IDs
// /!\

const bidderFragment = gql`
  fragment TokenBidderSubscription_blockchainUser on BlockchainUser {
    ... on User {
      slug
      nickname
    }
    ... on AnonymousUser {
      id
    }
  }
` as TypedDocumentNode<TokenBidderSubscription_blockchainUser>;

const bidsFragment = gql`
  fragment TokenBidSubscription_bidConnection on BidConnection {
    nodes {
      id
      amounts {
        ...MonetaryAmountFragment_monetaryAmount
      }
      bidder {
        ...TokenBidderSubscription_blockchainUser
        ... on User {
          slug
          profile {
            id
            pictureUrl
            verified
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
    totalCount
  }
  ${bidderFragment}
  ${monetaryAmountFragment}
` as TypedDocumentNode<TokenBidSubscription_bidConnection>;

export const TOKEN_BY_ID_QUERY = gql`
  query TokenByIdQuery($assetId: String!, $bidCursor: String) {
    tokens {
      nft(assetId: $assetId) {
        assetId
        slug
        collection
        metadata {
          ... on TokenCardMetadataInterface {
            id
            rarity
          }
        }
        latestEnglishAuction {
          bids(first: 5, after: $bidCursor) {
            ...BidHistory_tokenBidConnection
          }
          ...OpenAuction_auction
        }
        ...Token_token
        ...CurrentOwner_token
        ...SingleSaleOffer_token
        ...TokenDescription_token
        ...OwnershipHistory_token
        ...BlockchainInfo_token
        ...MinimumPrice_token
        ...TokenWithdrawal_token
        ...TokensAvailableOnPrimaryWhenInsufficientFundsInWallet_token
      }
    }
  }
  ${CurrentOwner.fragments.token}
  ${Token.fragments.token}
  ${SingleSaleOffer.fragments.token}
  ${OpenAuction.fragments.auction}
  ${BidHistory.fragments.bid}
  ${TokenDescription.fragments.token}
  ${BlockchainInfo.fragments.token}
  ${OwnershipHistory.fragments.token}
  ${MinimumPrice.fragments.token}
  ${TokenWithdrawal.fragments.token}
  ${TokensAvailableOnPrimaryWhenInsufficientFundsInWallet.fragments.token}
` as TypedDocumentNode<TokenByIdQuery, TokenByIdQueryVariables>;

export const TOKENS_BY_IDS_QUERY = gql`
  query TokensByIdsQuery($assetIds: [String!]!) {
    tokens {
      nfts(assetIds: $assetIds) {
        assetId
        slug
        sport
        ...Token_token
        ...TokenFavoriteButton_token
      }
    }
  }
  ${Token.fragments.token}
  ${TokenFavoriteButton.fragments.token}
` as TypedDocumentNode<TokensByIdsQuery, TokensByIdsQueryVariables>;

export const PROMOTED_TOKENS_BY_IDS_QUERY = gql`
  query PromotedTokensByIds($assetIds: [String!]!) {
    tokens {
      nfts(assetIds: $assetIds) {
        assetId
        slug
        ...PromotedToken_token
      }
    }
  }
  ${PromotedToken.fragments.token}
` as TypedDocumentNode<PromotedTokensByIds, PromotedTokensByIdsVariables>;

export const PRIMARY_OFFERS_BY_IDS_QUERY = gql`
  query PrimaryOffersByIdsQuery($ids: [String!]!) {
    tokens {
      primaryOffers(ids: $ids) {
        id
        cancelledAt
        ...PrimaryOfferPreview_primaryOffer
      }
    }
  }
  ${PrimaryOfferPreview.fragments.primaryOffer}
` as TypedDocumentNode<
  PrimaryOffersByIdsQuery,
  PrimaryOffersByIdsQueryVariables
>;

export const PRIMARY_OFFER_BY_ID_QUERY = gql`
  query PrimaryOfferByIdQuery($id: String!) {
    tokens {
      primaryOffer(id: $id) {
        id
        nfts {
          slug
          assetId
          metadata {
            ... on TokenCardMetadataInterface {
              id
              rarity
            }
          }
          ...FlexToken_token
          ...CardPreview_token
          ...MobileCardPreview_token
        }
        ...PrimaryOfferPreview_primaryOffer
        ...PrimaryOfferSale_primaryOffer
      }
    }
  }
  ${PrimaryOfferPreview.fragments.primaryOffer}
  ${PrimaryOfferSale.fragments.primaryOffer}
  ${FlexToken.fragments.token}
  ${CardPreview.fragments.token}
  ${MobileCardPreview.fragments.token}
` as TypedDocumentNode<PrimaryOfferByIdQuery, PrimaryOfferByIdQueryVariables>;

export const INTERSTITIAL_PRIMARY_OFFERS_BY_IDS = gql`
  query InterstitialPrimaryOfferQueryByIds($primaryOfferIds: [String!]!) {
    tokens {
      primaryOffers(ids: $primaryOfferIds) {
        id
        nfts {
          assetId
          slug
          ...PrimaryOfferTokensSummary_token
        }
      }
    }
  }
  ${PrimaryOfferTokensSummary.fragments.token}
` as TypedDocumentNode<
  InterstitialPrimaryOfferQueryByIds,
  InterstitialPrimaryOfferQueryByIdsVariables
>;

export const tokenAuctionSubscription = gql`
  subscription TokenAuctionUpdate($bidCursor: String, $sports: [Sport!]) {
    tokenAuctionWasUpdated(sports: $sports) {
      id
      open
      endDate
      currentPrice
      currency
      bidsCount
      blockchainId
      minNextBid
      creditCardFee
      nfts {
        assetId
        slug
        owner {
          id
          from
          price {
            ...MonetaryAmountFragment_monetaryAmount
          }
          transferType
          account {
            id
            owner {
              ... on User {
                slug
                nickname
              }
              ... on Contract {
                id
              }
            }
          }
        }
        liveSingleSaleOffer {
          id
        }
        myMintedSingleSaleOffer {
          id
        }
        latestEnglishAuction {
          id
        }
        ...ItemSold_token
      }
      bestBid {
        id
        bidder {
          ... on User {
            slug
          }
        }
      }
      bids(first: 5, after: $bidCursor) {
        ...TokenBidSubscription_bidConnection
      }
    }
  }
  ${bidsFragment}
  ${ItemSold.fragments.token}
  ${monetaryAmountFragment}
` as TypedDocumentNode<TokenAuctionUpdate, TokenAuctionUpdateVariables>;

export const USER_BY_SLUG_QUERY = gql`
  query UserBySlugQuery($slug: String!) {
    user(slug: $slug) {
      slug
      ...TradeButton_publicUserInfoInterface
      ...ActiveUserAvatar_user
    }
  }
  ${TradeButton.fragments.user}
  ${ActiveUserAvatar.fragments.user}
` as TypedDocumentNode<UserBySlugQuery, UserBySlugQueryVariables>;

export const tokenOfferSubscription = gql`
  subscription TokenOfferUpdate($sports: [Sport!]) {
    tokenOfferWasUpdated(sports: $sports) {
      id
      endDate
      status
      senderSide {
        id
        wei
        nfts {
          assetId
          slug
          owner {
            id
            from
            price {
              ...MonetaryAmountFragment_monetaryAmount
            }
            transferType
          }
          ...ItemSold_token
          liveSingleSaleOffer {
            id
          }
          myMintedSingleSaleOffer {
            id
          }
        }
      }
      receiverSide {
        id
        wei
        nfts {
          assetId
          slug
          owner {
            id
            from
            price {
              ...MonetaryAmountFragment_monetaryAmount
            }
            transferType
            account {
              id
              owner {
                ... on User {
                  slug
                  nickname
                }
              }
            }
          }
          liveSingleSaleOffer {
            id
          }
          myMintedSingleSaleOffer {
            id
          }
        }
      }
    }
  }
  ${ItemSold.fragments.token}
  ${monetaryAmountFragment}
` as TypedDocumentNode<TokenOfferUpdate, TokenOfferUpdateVariables>;

export const primaryOfferSubscription = gql`
  subscription PrimaryOfferUpdate($sports: [Sport!]) {
    primaryOfferWasUpdated(sports: $sports) {
      id
      endDate
      status
      buyer {
        slug
        ...SmallUser_user
      }
    }
  }
  ${SmallUser.fragments.user}
` as TypedDocumentNode<PrimaryOfferUpdate, PrimaryOfferUpdateVariables>;
