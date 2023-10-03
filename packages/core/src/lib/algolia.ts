import { TypedDocumentNode, gql } from '@apollo/client';
import { SearchParameters } from 'algoliasearch-helper';
import { BaseHit } from 'instantsearch.js';
import shuffle from 'shuffle-array';

import {
  Collection,
  Rarity,
  Sport,
  Tradeable,
  WalletStatus,
} from '__generated__/globalTypes';
import { AlgoliaCardIndexesNames } from '@core/contexts/config';
import idFromObject from '@core/gql/idFromObject';

import { Algolia_CardHit_token } from './__generated__/algolia.graphql';
import { Scarcity } from './cards';

type AlgoliaSport = 'baseball' | 'football' | 'nba';

export const TOKENS_STACKED_LIMIT = 2;

export interface CardHit extends BaseHit {
  objectID: string;
  rarity: Scarcity;
  serial_number: number;
  season: number;
  blockchain_id: string;
  tradeable_status: string;
  wallet_status: string;
  picture_url: string;
  player: {
    slug: string;
    display_name: string;
  };
  user: {
    slug: string;
  };
  sport: AlgoliaSport;
  __position: number;
  sale?: SaleHit;
}

const AlgoliaSportsMappings: Readonly<{ [key in AlgoliaSport]: Sport }> = {
  nba: Sport.NBA,
  football: Sport.CRICKET,
  baseball: Sport.BASEBALL,
};

const SportsMappings: Readonly<{ [key in Sport]: AlgoliaSport }> = {
  [Sport.NBA]: 'nba',
  [Sport.CRICKET]: 'football',
  [Sport.BASEBALL]: 'baseball',
};

const FakeCollectionMappings: Readonly<{ [key in AlgoliaSport]: Collection }> =
  {
    nba: Collection.NBA,
    baseball: Collection.BASEBALL,
    football: Collection.CRICKET,
  };

export interface SaleHit {
  id: string;
}

export interface UserHit {
  objectID: string;
  slug: string;
  id: string;
  profile: { picture: string; verified?: boolean };
  nickname: string;
  sorare_address_hex: string;
}

export interface ClubHit extends BaseHit {
  domestic_league: { display_name: string };
  objectID: string;
  pictureUrl: string;
  name: string;
  released: boolean;
  __position: number;
}

export interface CountryHit {
  objectID: string;
  code: string;
  name_en: string;
}

export interface PlayerHit {
  objectID: string;
  avatarUrl: string;
  display_name: string;
  activeClub?: {
    name: string;
  };
}

export interface CompetitionHit {
  objectID: string;
  display_name: string;
  released: boolean;
  open_for_game_stats: boolean;
  code: string;
  pictureUrl: string;
}

export const convertUserHit = (
  hit: UserHit
): {
  __typename: 'User';
  slug: string;
  id: string;
  nickname: string;
  viccAddress: string;
  suspended: boolean;
  profile: {
    __typename: 'UserProfile';
    id: string;
    pictureUrl: string;
    verified: boolean;
  };
} => ({
  __typename: 'User',
  id: hit.id,
  slug: hit.objectID,
  nickname: hit.nickname,
  viccAddress: hit.sorare_address_hex,
  suspended: false,
  profile: {
    __typename: 'UserProfile',
    id: hit.id,
    pictureUrl: hit.profile?.picture,
    verified: !!hit.profile?.verified,
  },
});

export const algoliaCardObjectIdPrefix: { [key in Sport]: string } = {
  [Sport.BASEBALL]: 'baseball-assetId',
  [Sport.NBA]: 'baseball-assetId',
  [Sport.CRICKET]: '',
};

export const algoliaCommonCardObjectIdPrefix: { [key in Sport]: string } = {
  [Sport.BASEBALL]: 'baseball-cardId',
  [Sport.NBA]: 'baseball-cardId',
  [Sport.CRICKET]: '',
};

export type MarketplaceHit = {
  objectID: string;
  sale?: {
    id: string;
    bundled: boolean;
    distinct_key: string;
  };
};

export const buildAlgoliaObjectId = (card: {
  slug: string;
  assetId: string;
  sport: Sport;
}) => {
  if (card.sport === Sport.CRICKET) return card.slug;
  return `${algoliaCardObjectIdPrefix[card.sport]}:${card.assetId}`;
};

export const convertToCardHit = (card: Algolia_CardHit_token): CardHit => ({
  ...card,
  objectID: buildAlgoliaObjectId(card),
  rarity: card.metadata.rarity as Scarcity,
  serial_number: card.metadata.serialNumber,
  blockchain_id: card.ethereumId!,
  tradeable_status: card.tradeableStatus,
  wallet_status: card.walletStatus,
  picture_url: card.pictureUrl!,
  player: {
    slug: card.metadata.playerSlug,
    display_name: card.metadata.playerDisplayName,
  },
  season: card.metadata.seasonStartYear,
  user: {
    slug: card.owner?.user?.slug || '',
  },
  sport: SportsMappings[card.sport],
  __position: 10,
  asset_id: card.assetId,
});

export const convertCardHitToToken = (
  hit: CardHit
): {
  __typename: 'Token';
  slug: string;
  assetId: string;
  rarity: Scarcity;
  serialNumber: number;
  blockchainId: string;
  tradeableStatus: Tradeable;
  walletStatus: WalletStatus;
  pictureUrl: string;
  collection: Collection;
  sport: Sport;
  metadata: {
    __typename: 'TokenCricketMetadata';
    id: string;
    playerDisplayName: string;
    playerSlug: string;
    rarity: Rarity;
    seasonStartYear: number;
    serialNumber: number;
    singleCivilYear: boolean;
  };
  user: {
    slug: string;
  };
  singleCivilYear: boolean;
} => ({
  ...hit,
  __typename: 'Token',
  slug: hit.objectID,
  assetId:
    hit.sport === 'baseball' ? idFromObject(hit.objectID)! : hit.objectID, // TODO: replace with `assetId` when ready
  serialNumber: hit.serial_number,
  blockchainId: hit.blockchain_id,
  tradeableStatus: hit.tradeable_status as Tradeable,
  walletStatus: hit.wallet_status as WalletStatus,
  pictureUrl: hit.picture_url,
  metadata: {
    __typename: 'TokenCricketMetadata',
    id: hit.sport === 'baseball' ? idFromObject(hit.objectID)! : hit.objectID, // TODO: replace with `assetId` when ready
    playerDisplayName: hit.player.display_name,
    playerSlug: hit.player.slug,
    rarity: hit.rarity as Rarity,
    seasonStartYear: hit.season,
    serialNumber: hit.serial_number,
    singleCivilYear: hit.sport === 'baseball',
  },
  user: {
    slug: hit.user?.slug,
  },
  singleCivilYear: false,
  sport: AlgoliaSportsMappings[hit.sport] || Sport.CRICKET,
  collection: FakeCollectionMappings[hit.sport] || Collection.CRICKET, // this assertion is factually wrong but that's a separate concern
});

export const tokenHitFragment = gql`
  fragment Algolia_CardHit_token on Token {
    assetId
    slug
    collection
    sport
    metadata {
      ... on TokenCardMetadataInterface {
        id
        rarity
        serialNumber
        seasonStartYear
        playerDisplayName
        playerSlug
      }
    }
    pictureUrl(derivative: "tinified")
    owner {
      id
      user {
        slug
      }
    }
    ethereumId
    tradeableStatus
    walletStatus
  }
` as TypedDocumentNode<Algolia_CardHit_token>;

export function isCardHit(card: any): card is CardHit {
  return (card as CardHit).objectID !== undefined;
}

export const visibleCardFilter = 'visible=1';
export const releasedPlayerFilter = 'released=1';

const tradeableWalletStatus = ['internal', 'mapped'];

export const sportFilter = (sport: Sport): string =>
  `sport:${sport.toLowerCase()}`;

const sanitizeFilters = (filters: (string | null | false | undefined)[]) =>
  filters.filter(Boolean).filter(string => string !== '');

export const joinFiltersWithAnd = (
  filters: (string | null | false | undefined)[]
) => sanitizeFilters(filters).join(' AND ');

export const joinFiltersWithOr = (
  filters: (string | null | false | undefined)[]
) => sanitizeFilters(filters).join(' OR ');

export function mergeResults<T extends { objectID: string }>(
  hits: T[],
  saved: T[]
) {
  const ids = hits.map(o => o.objectID);
  return saved.reduce((all, selectedCard) => {
    if (ids.includes(selectedCard.objectID)) {
      return all;
    }
    return [selectedCard, ...all];
  }, hits || []);
}

export function getAlgoliaHosts(
  algoliaApplicationId: string,
  useAlgoliaGeoOptimizedReadReplica: boolean
) {
  // APPID-dsn.algolia.net: the Algolia read replica that is the closest to the end-user's IP address (geoip)
  // APPID.algolia.net: one of the 3 machines of the primary cluster (round-robin)
  //
  // We build the algolia hosts to target following this strategy (the client will try one after the other):
  //  - first & main host:
  //     either use the DSN (closest) hostname if useAlgoliaGeoOptimizedReadReplica is TRUE
  //     or the regular round-robin between the 3 primary machines
  //  - next 3 hosts (DNS provider = NS1):
  //     the 3 primary machines on the `algolia.net` domain
  //  - next 3 hosts (DNS provider = Cloudflare, used when NS1 is down):
  //     the 3 primary machines on the `algolianet.com` domain
  const firstHost = `${algoliaApplicationId}${
    useAlgoliaGeoOptimizedReadReplica ? '-dsn' : ''
  }.algolia.net`;
  const algoliaHosts = [firstHost]
    .concat(
      shuffle([
        `${algoliaApplicationId}-1.algolia.net`,
        `${algoliaApplicationId}-2.algolia.net`,
        `${algoliaApplicationId}-3.algolia.net`,
      ])
    )
    .concat(
      shuffle([
        `${algoliaApplicationId}-1.algolianet.com`,
        `${algoliaApplicationId}-2.algolianet.com`,
        `${algoliaApplicationId}-3.algolianet.com`,
      ])
    );

  return algoliaHosts;
}

export const getUserCardFilters = (userId: string | undefined): string => {
  const filtersArray = [
    visibleCardFilter,
    `tradeable_status:yes`,
    `(${tradeableWalletStatus.map(r => `wallet_status:${r}`).join(' OR ')})`,
  ];
  if (userId) filtersArray.push(`user.id:${userId}`);
  return joinFiltersWithAnd(filtersArray);
};

export type EnablePopularPlayerMarketplaceFilterFlagValue =
  | 'enabled-and-default'
  | 'enabled'
  | 'disabled';

export type CardSortConfiguration = {
  withBestValue?: boolean;
  withHighestAverageScore?: true;
  withPopularPlayer?: true;
  withHighestPrice?: boolean;
  withEndingSoon?: boolean;
  withNew?: boolean;
};

export const createCardSorts = ({
  withBestValue,
  withHighestAverageScore,
  withPopularPlayer,
  withHighestPrice = true,
  withEndingSoon = true,
  withNew = true,
}: CardSortConfiguration = {}): AlgoliaCardIndexesNames => {
  const result: AlgoliaCardIndexesNames = [
    ...(withNew ? (['Newly Listed'] as AlgoliaCardIndexesNames) : []),
    ...(withEndingSoon ? (['Ending Soon'] as AlgoliaCardIndexesNames) : []),
    'Lowest Price',
  ];

  if (withHighestPrice) {
    result.splice(2, 0, 'Highest Price');
  }
  if (withPopularPlayer) {
    result.splice(1, 0, 'Popular Player');
  }
  if (withBestValue) {
    result.splice(1, 0, 'Best Value');
  }
  if (withHighestAverageScore) {
    result.push('Highest Average Score');
  }
  return result;
};

export const hitIsToken = (
  sport: Sport.BASEBALL | Sport.NBA,
  objectID: string
) => {
  return objectID.startsWith(algoliaCardObjectIdPrefix[sport]);
};

export interface StackProps {
  algoliaDistinctKey: string;
  params?: SearchParameters;
  count: number;
}

export const assetIdFromHit = ({
  objectID,
  asset_id,
  sport,
}: {
  objectID: string;
  asset_id: string;
  sport: string;
}) => {
  if (sport === 'football') {
    return asset_id;
  }
  return idFromObject(objectID)!;
};
