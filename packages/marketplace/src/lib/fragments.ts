import { gql } from '@apollo/client';

// Eslint disable because: we cannot import fragments on token in baseball + Rules component not used
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import ActivityIndicator from '@sorare/core/src/components/user/ActivityIndicator';

import ItemSold from 'components/ItemPreview/ItemSold';
import { PromotedToken } from 'components/PromotedToken';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import { TradeButton } from 'components/TradeButton';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import BidHistory from 'components/auction/BidHistory';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import OpenAuction from 'components/auction/OpenAuction';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import MinimumPrice from 'components/directOffer/MinimumPrice';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import CurrentOwner from 'components/offer/CurrentOwner';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import SingleSaleOffer from 'components/offer/SingleSaleOffer';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import PrimaryOfferPreview from 'components/primaryOffer/PrimaryOfferPreview';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import PrimaryOfferSale from 'components/primaryOffer/PrimaryOfferSale';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import PrimaryOfferTokensSummary from 'components/primaryOffer/PrimaryOfferTokensSummary';
import CardPreview from 'components/starterbundle/CardPreview';
import MobileCardPreview from 'components/starterbundle/MobileCardPreview';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import FlexToken from 'components/token/FlexToken';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import OwnershipHistory from 'components/token/OwnershipHistory';
import { Token } from 'components/token/Token';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import TokenDescription from 'components/token/TokenDescription';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import TokenFavoriteButton from 'components/token/TokenFavoriteButton';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import BlockchainInfo from 'components/token/TokenPage/BlockchainInfo';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import TokensAvailableOnPrimaryWhenInsufficientFundsInWallet from 'components/token/TokenPage/TokensAvailableOnPrimaryWhenInsufficientFundsInWallet';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import TokenWithdrawal from 'components/token/TokenWithdrawal';
/* eslint-disable-next-line sorare/no-unrendered-component-imports */
import SmallUser from 'components/user/SmallUser';

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
`;

const bidsFragment = gql`
  fragment TokenBidSubscription_bidConnection on TokenBidConnection {
    nodes {
      id
      amount
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
`;

export const TOKEN_BY_ID_QUERY = gql`
  query TokenByIdQuery($assetId: String!, $bidCursor: String) {
    tokens {
      nft(assetId: $assetId) {
        assetId
        slug
        collection
        metadata {
          ... on TokenBaseballMetadata {
            id
          }
          ... on TokenFootballMetadata {
            id
          }
          ... on TokenCardMetadataInterface {
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
`;

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
`;

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
`;

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
`;

export const PRIMARY_OFFER_BY_ID_QUERY = gql`
  query PrimaryOfferByIdQuery($id: String!) {
    tokens {
      primaryOffer(id: $id) {
        id
        nfts {
          slug
          assetId
          metadata {
            ... on TokenBaseballMetadata {
              id
            }
            ... on TokenFootballMetadata {
              id
            }
            ... on TokenCardMetadataInterface {
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
`;

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
`;

export const tokenAuctionSubscription = gql`
  subscription TokenAuctionUpdate($bidCursor: String, $sports: [Sport!]) {
    tokenAuctionWasUpdated(sports: $sports) {
      id
      open
      endDate
      currentPrice
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
          priceFiat {
            eur
            usd
            gbp
          }
          priceWei
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
`;

export const USER_BY_SLUG_QUERY = gql`
  query UserBySlugQuery($slug: String!) {
    user(slug: $slug) {
      slug
      ...ActivityIndicator_user
      ...TradeButton_publicUserInfoInterface
    }
  }
  ${TradeButton.fragments.user}
  ${ActivityIndicator.fragments.user}
`;

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
            priceFiat {
              eur
              usd
              gbp
            }
            priceWei
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
            priceFiat {
              eur
              usd
              gbp
            }
            priceWei
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
`;

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
`;
