/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import {
  Sport,
  sportFromJSON,
  sportToJSON,
} from '../../../events/shared/events';

export const protobufPackage = 'events.so5.web';

export interface CardInfo {
  cardSlug: string;
  domesticLeagueSlug: string;
  lastFiveSo5Appearances: number;
  lastFiveSo5AverageScore: number;
  lastFifteenSo5Appearances: number;
  lastFifteenSo5AverageScore: number;
  lastFortySo5Appearances: number;
  lastFortySo5AverageScore: number;
  playerSlug: string;
  playerTier: string;
  tierVersion: number;
  /**
   * MLB players have multiple positions
   * but we need to keep the `position` for backward compatibility on SO5 events
   */
  position: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  value: number;
  sport: Sport;
}

export interface BundledCardsInfo {
  cardSlugs: string[];
  domesticLeagueSlug: string;
  playerSlugs: string[];
  positions: string[];
  cardCount: number;
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
  season: number;
  teamSlug: string;
  value: number;
  sport: Sport;
}

export interface ClickCard {
  /** CardInfo */
  cardSlug: string;
  domesticLeagueSlug: string;
  lastFiveSo5Appearances: number;
  lastFiveSo5AverageScore: number;
  lastFifteenSo5Appearances: number;
  lastFifteenSo5AverageScore: number;
  lastFortySo5Appearances: number;
  lastFortySo5AverageScore: number;
  playerSlug: string;
  playerTier: string;
  tierVersion: number;
  position: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  value: number;
  secondary: boolean;
  interactionContext: string;
  sport: Sport;
}

export interface ClickBundle {
  auctionId: string;
  /** BundledCardsInfo */
  cardSlugs: string[];
  domesticLeagueSlug: string;
  playerSlugs: string[];
  positions: string[];
  cardCount: number;
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
  season: number;
  teamSlug: string;
  value: number;
  secondary: boolean;
  interactionContext: string;
  sport: Sport;
}

export interface ClickBid {
  auctionId: string;
  /** CardInfo */
  cardSlug: string;
  domesticLeagueSlug: string;
  lastFiveSo5Appearances: number;
  lastFiveSo5AverageScore: number;
  lastFifteenSo5Appearances: number;
  lastFifteenSo5AverageScore: number;
  lastFortySo5Appearances: number;
  lastFortySo5AverageScore: number;
  playerSlug: string;
  playerTier: string;
  tierVersion: number;
  position: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  value: number;
  count: number;
  ethAmount: number;
  eurAmount: number;
  secondary: boolean;
  interactionContext: string;
  sport: Sport;
}

export interface ClickBundledBid {
  auctionId: string;
  /** BundledCardsInfo */
  cardSlugs: string[];
  domesticLeagueSlug: string;
  playerSlugs: string[];
  positions: string[];
  cardCount: number;
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
  season: number;
  teamSlug: string;
  value: number;
  count: number;
  ethAmount: number;
  eurAmount: number;
  secondary: boolean;
  interactionContext: string;
  sport: Sport;
}

export interface ClickBuy {
  offerId: string;
  /** CardInfo */
  cardSlug: string;
  domesticLeagueSlug: string;
  lastFiveSo5Appearances: number;
  lastFiveSo5AverageScore: number;
  lastFifteenSo5Appearances: number;
  lastFifteenSo5AverageScore: number;
  lastFortySo5Appearances: number;
  lastFortySo5AverageScore: number;
  playerSlug: string;
  playerTier: string;
  tierVersion: number;
  position: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  value: number;
  ethAmount: number;
  eurAmount: number;
  secondary: boolean;
  interactionContext: string;
  sport: Sport;
}

export interface ClickBanner {
  bannerId: string;
  tileIndex: number;
  bannerTitle: string;
  bannerType: string;
  bannerSlotName: string;
  sport: Sport;
}

export interface UseMarketFilter {
  filterName: string;
  filterValue: string;
  interactionContext: string;
  sport: Sport;
}

export interface FavoriteCard {
  /** CardInfo */
  cardSlug: string;
  domesticLeagueSlug: string;
  lastFiveSo5Appearances: number;
  lastFiveSo5AverageScore: number;
  lastFifteenSo5Appearances: number;
  lastFifteenSo5AverageScore: number;
  lastFortySo5Appearances: number;
  lastFortySo5AverageScore: number;
  playerSlug: string;
  playerTier: string;
  tierVersion: number;
  position: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  value: number;
  customCardEditionName: string;
  interactionContext: string;
  sport: Sport;
}

export interface FollowPlayer {
  playerSlug: string;
  position: string;
  positions: string[];
  teamSlug: string;
  alertLimited: boolean;
  alertRare: boolean;
  alertSuperRare: boolean;
  alertUnique: boolean;
  interactionContext: string;
  sport: Sport;
}

export interface PlaceBid {
  auctionId: string;
  /** CardInfo */
  cardSlug: string;
  domesticLeagueSlug: string;
  lastFiveSo5Appearances: number;
  lastFiveSo5AverageScore: number;
  lastFifteenSo5Appearances: number;
  lastFifteenSo5AverageScore: number;
  lastFortySo5Appearances: number;
  lastFortySo5AverageScore: number;
  playerSlug: string;
  playerTier: string;
  tierVersion: number;
  position: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  value: number;
  customCardEditionName: string;
  count: number;
  ethAmount: number;
  eurAmount: number;
  fiatPayment: boolean;
  secondary: boolean;
  sport: Sport;
}

export interface PlaceBundledBid {
  auctionId: string;
  /** BundledCardsInfo */
  cardSlugs: string[];
  domesticLeagueSlug: string;
  playerSlugs: string[];
  positions: string[];
  cardCount: number;
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
  season: number;
  teamSlug: string;
  value: number;
  count: number;
  ethAmount: number;
  eurAmount: number;
  fiatPayment: boolean;
  secondary: boolean;
  sport: Sport;
}

export interface ToggleHideBalance {
  hidden: boolean;
}

export interface SeeTCUModal {
  mobile: boolean;
}

export interface AcceptTCU {
  source: string;
}

export interface AttemptToSignupFromSanctionedCountry {
  countryCode: string;
}

export interface SignUpForProductUpdates {
  email: string;
  topic: string;
}

export interface UseThirdParty {
  name: string;
}

export interface ClickInviteFriends {
  source: string;
}

export interface DisplayWarningHighBidAmount {
  auctionId: string;
  cardSlugs: string[];
  count: number;
  ethAmount: number;
  eurAmount: number;
  fiatPayment: boolean;
  multiplier: number;
  sport: Sport;
}

export interface DisplayWarningVeryHighBidAmount {
  auctionId: string;
  cardSlugs: string[];
  count: number;
  ethAmount: number;
  eurAmount: number;
  fiatPayment: boolean;
  multiplier: number;
  sport: Sport;
}

export interface PlaceBidAfterDisplayWarningHighBidAmount {
  auctionId: string;
  cardSlugs: string[];
  count: number;
  ethAmount: number;
  eurAmount: number;
  fiatPayment: boolean;
  multiplier: number;
  sport: Sport;
}

export interface PlaceBidAfterDisplayWarningVeryHighBidAmount {
  auctionId: string;
  cardSlugs: string[];
  count: number;
  ethAmount: number;
  eurAmount: number;
  fiatPayment: boolean;
  multiplier: number;
  sport: Sport;
}

export interface ClickFilterInSearch {
  sport: Sport;
  context: Sport;
  searchTerm: string;
}

export interface ClickSearchResult {
  sport: Sport;
  context: Sport;
  searchTerm: string;
  resultCategory: string;
  resultDestination: string;
}

export interface ExitSearchWithoutClickingResult {
  sport: Sport;
  context: Sport;
  searchTerm: string;
}

export interface WalletOpened {
  interactionContext: string;
  sport: Sport;
}

export interface ListCard {
  /** CardInfo */
  cardSlug: string;
  domesticLeagueSlug: string;
  lastFiveSo5Appearances: number;
  lastFiveSo5AverageScore: number;
  lastFifteenSo5Appearances: number;
  lastFifteenSo5AverageScore: number;
  lastFortySo5Appearances: number;
  lastFortySo5AverageScore: number;
  playerSlug: string;
  playerTier: string;
  tierVersion: number;
  position: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  value: number;
  customCardEditionName: string;
  ethAmount: number;
  eurAmount: number;
  duration: number;
  sport: Sport;
}

export interface UnlistCard {
  /** CardInfo */
  cardSlug: string;
  domesticLeagueSlug: string;
  lastFiveSo5Appearances: number;
  lastFiveSo5AverageScore: number;
  lastFifteenSo5Appearances: number;
  lastFifteenSo5AverageScore: number;
  lastFortySo5Appearances: number;
  lastFortySo5AverageScore: number;
  playerSlug: string;
  playerTier: string;
  tierVersion: number;
  position: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  value: number;
  customCardEditionName: string;
  unlistingType: string;
  listingTime: number;
  cancelledBy: string;
  sport: Sport;
}

export interface ClickPlayNow {
  interactionContext: string;
  sport: Sport;
}

export interface ClickSignUp {
  interactionContext: string;
}

export interface ViewSignUpModal {
  interactionContext: string;
}

export interface ClickOauthSignUp {
  method: ClickOauthSignUp_Method;
}

export enum ClickOauthSignUp_Method {
  GOOGLE = 0,
  FACEBOOK = 1,
  UNRECOGNIZED = -1,
}

export function clickOauthSignUp_MethodFromJSON(
  object: any
): ClickOauthSignUp_Method {
  switch (object) {
    case 0:
    case 'GOOGLE':
      return ClickOauthSignUp_Method.GOOGLE;
    case 1:
    case 'FACEBOOK':
      return ClickOauthSignUp_Method.FACEBOOK;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ClickOauthSignUp_Method.UNRECOGNIZED;
  }
}

export function clickOauthSignUp_MethodToJSON(
  object: ClickOauthSignUp_Method
): string {
  switch (object) {
    case ClickOauthSignUp_Method.GOOGLE:
      return 'GOOGLE';
    case ClickOauthSignUp_Method.FACEBOOK:
      return 'FACEBOOK';
    default:
      return 'UNKNOWN';
  }
}

export interface ClickPriceHistory {
  interactionContext: string;
  cardSlug: string;
  clickedCardSlug: string;
}

export interface ExpandPriceHistory {
  interactionContext: string;
  cardSlug: string;
}

export interface RevealPriceHistoryOnOffer {
  cardSlug: string;
}

export interface ClickBundledBuy {
  offerId: string;
  cardSlugs: string[];
  domesticLeagueSlug: string;
  playerSlugs: string[];
  positions: string[];
  cardCount: number;
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
  season: number;
  teamSlug: string;
  value: number;
  ethAmount: number;
  eurAmount: number;
  secondary: boolean;
  interactionContext: string;
  sport: Sport;
}

function createBaseCardInfo(): CardInfo {
  return {
    cardSlug: '',
    domesticLeagueSlug: '',
    lastFiveSo5Appearances: 0,
    lastFiveSo5AverageScore: 0,
    lastFifteenSo5Appearances: 0,
    lastFifteenSo5AverageScore: 0,
    lastFortySo5Appearances: 0,
    lastFortySo5AverageScore: 0,
    playerSlug: '',
    playerTier: '',
    tierVersion: 0,
    position: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    value: 0,
    sport: 0,
  };
}

export const CardInfo = {
  fromJSON(object: any): CardInfo {
    return {
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      lastFiveSo5Appearances: isSet(object.last_five_so5_appearances)
        ? Number(object.last_five_so5_appearances)
        : 0,
      lastFiveSo5AverageScore: isSet(object.last_five_so5_average_score)
        ? Number(object.last_five_so5_average_score)
        : 0,
      lastFifteenSo5Appearances: isSet(object.last_fifteen_so5_appearances)
        ? Number(object.last_fifteen_so5_appearances)
        : 0,
      lastFifteenSo5AverageScore: isSet(object.last_fifteen_so5_average_score)
        ? Number(object.last_fifteen_so5_average_score)
        : 0,
      lastFortySo5Appearances: isSet(object.last_forty_so5_appearances)
        ? Number(object.last_forty_so5_appearances)
        : 0,
      lastFortySo5AverageScore: isSet(object.last_forty_so5_average_score)
        ? Number(object.last_forty_so5_average_score)
        : 0,
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      playerTier: isSet(object.player_tier) ? String(object.player_tier) : '',
      tierVersion: isSet(object.tier_version) ? Number(object.tier_version) : 0,
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: CardInfo): unknown {
    const obj: any = {};
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    message.lastFiveSo5Appearances !== undefined &&
      (obj.last_five_so5_appearances = Math.round(
        message.lastFiveSo5Appearances
      ));
    message.lastFiveSo5AverageScore !== undefined &&
      (obj.last_five_so5_average_score = message.lastFiveSo5AverageScore);
    message.lastFifteenSo5Appearances !== undefined &&
      (obj.last_fifteen_so5_appearances = Math.round(
        message.lastFifteenSo5Appearances
      ));
    message.lastFifteenSo5AverageScore !== undefined &&
      (obj.last_fifteen_so5_average_score = message.lastFifteenSo5AverageScore);
    message.lastFortySo5Appearances !== undefined &&
      (obj.last_forty_so5_appearances = Math.round(
        message.lastFortySo5Appearances
      ));
    message.lastFortySo5AverageScore !== undefined &&
      (obj.last_forty_so5_average_score = message.lastFortySo5AverageScore);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.playerTier !== undefined && (obj.player_tier = message.playerTier);
    message.tierVersion !== undefined &&
      (obj.tier_version = Math.round(message.tierVersion));
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.serialNumber !== undefined &&
      (obj.serial_number = Math.round(message.serialNumber));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseBundledCardsInfo(): BundledCardsInfo {
  return {
    cardSlugs: [],
    domesticLeagueSlug: '',
    playerSlugs: [],
    positions: [],
    cardCount: 0,
    limited: 0,
    rare: 0,
    superRare: 0,
    unique: 0,
    season: 0,
    teamSlug: '',
    value: 0,
    sport: 0,
  };
}

export const BundledCardsInfo = {
  fromJSON(object: any): BundledCardsInfo {
    return {
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      playerSlugs: Array.isArray(object?.player_slugs)
        ? object.player_slugs.map((e: any) => String(e))
        : [],
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      cardCount: isSet(object.card_count) ? Number(object.card_count) : 0,
      limited: isSet(object.limited) ? Number(object.limited) : 0,
      rare: isSet(object.rare) ? Number(object.rare) : 0,
      superRare: isSet(object.super_rare) ? Number(object.super_rare) : 0,
      unique: isSet(object.unique) ? Number(object.unique) : 0,
      season: isSet(object.season) ? Number(object.season) : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: BundledCardsInfo): unknown {
    const obj: any = {};
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    if (message.playerSlugs) {
      obj.player_slugs = message.playerSlugs.map(e => e);
    } else {
      obj.player_slugs = [];
    }
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.cardCount !== undefined &&
      (obj.card_count = Math.round(message.cardCount));
    message.limited !== undefined &&
      (obj.limited = Math.round(message.limited));
    message.rare !== undefined && (obj.rare = Math.round(message.rare));
    message.superRare !== undefined &&
      (obj.super_rare = Math.round(message.superRare));
    message.unique !== undefined && (obj.unique = Math.round(message.unique));
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickCard(): ClickCard {
  return {
    cardSlug: '',
    domesticLeagueSlug: '',
    lastFiveSo5Appearances: 0,
    lastFiveSo5AverageScore: 0,
    lastFifteenSo5Appearances: 0,
    lastFifteenSo5AverageScore: 0,
    lastFortySo5Appearances: 0,
    lastFortySo5AverageScore: 0,
    playerSlug: '',
    playerTier: '',
    tierVersion: 0,
    position: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    value: 0,
    secondary: false,
    interactionContext: '',
    sport: 0,
  };
}

export const ClickCard = {
  fromJSON(object: any): ClickCard {
    return {
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      lastFiveSo5Appearances: isSet(object.last_five_so5_appearances)
        ? Number(object.last_five_so5_appearances)
        : 0,
      lastFiveSo5AverageScore: isSet(object.last_five_so5_average_score)
        ? Number(object.last_five_so5_average_score)
        : 0,
      lastFifteenSo5Appearances: isSet(object.last_fifteen_so5_appearances)
        ? Number(object.last_fifteen_so5_appearances)
        : 0,
      lastFifteenSo5AverageScore: isSet(object.last_fifteen_so5_average_score)
        ? Number(object.last_fifteen_so5_average_score)
        : 0,
      lastFortySo5Appearances: isSet(object.last_forty_so5_appearances)
        ? Number(object.last_forty_so5_appearances)
        : 0,
      lastFortySo5AverageScore: isSet(object.last_forty_so5_average_score)
        ? Number(object.last_forty_so5_average_score)
        : 0,
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      playerTier: isSet(object.player_tier) ? String(object.player_tier) : '',
      tierVersion: isSet(object.tier_version) ? Number(object.tier_version) : 0,
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickCard): unknown {
    const obj: any = {};
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    message.lastFiveSo5Appearances !== undefined &&
      (obj.last_five_so5_appearances = Math.round(
        message.lastFiveSo5Appearances
      ));
    message.lastFiveSo5AverageScore !== undefined &&
      (obj.last_five_so5_average_score = message.lastFiveSo5AverageScore);
    message.lastFifteenSo5Appearances !== undefined &&
      (obj.last_fifteen_so5_appearances = Math.round(
        message.lastFifteenSo5Appearances
      ));
    message.lastFifteenSo5AverageScore !== undefined &&
      (obj.last_fifteen_so5_average_score = message.lastFifteenSo5AverageScore);
    message.lastFortySo5Appearances !== undefined &&
      (obj.last_forty_so5_appearances = Math.round(
        message.lastFortySo5Appearances
      ));
    message.lastFortySo5AverageScore !== undefined &&
      (obj.last_forty_so5_average_score = message.lastFortySo5AverageScore);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.playerTier !== undefined && (obj.player_tier = message.playerTier);
    message.tierVersion !== undefined &&
      (obj.tier_version = Math.round(message.tierVersion));
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.serialNumber !== undefined &&
      (obj.serial_number = Math.round(message.serialNumber));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickBundle(): ClickBundle {
  return {
    auctionId: '',
    cardSlugs: [],
    domesticLeagueSlug: '',
    playerSlugs: [],
    positions: [],
    cardCount: 0,
    limited: 0,
    rare: 0,
    superRare: 0,
    unique: 0,
    season: 0,
    teamSlug: '',
    value: 0,
    secondary: false,
    interactionContext: '',
    sport: 0,
  };
}

export const ClickBundle = {
  fromJSON(object: any): ClickBundle {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      playerSlugs: Array.isArray(object?.player_slugs)
        ? object.player_slugs.map((e: any) => String(e))
        : [],
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      cardCount: isSet(object.card_count) ? Number(object.card_count) : 0,
      limited: isSet(object.limited) ? Number(object.limited) : 0,
      rare: isSet(object.rare) ? Number(object.rare) : 0,
      superRare: isSet(object.super_rare) ? Number(object.super_rare) : 0,
      unique: isSet(object.unique) ? Number(object.unique) : 0,
      season: isSet(object.season) ? Number(object.season) : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickBundle): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    if (message.playerSlugs) {
      obj.player_slugs = message.playerSlugs.map(e => e);
    } else {
      obj.player_slugs = [];
    }
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.cardCount !== undefined &&
      (obj.card_count = Math.round(message.cardCount));
    message.limited !== undefined &&
      (obj.limited = Math.round(message.limited));
    message.rare !== undefined && (obj.rare = Math.round(message.rare));
    message.superRare !== undefined &&
      (obj.super_rare = Math.round(message.superRare));
    message.unique !== undefined && (obj.unique = Math.round(message.unique));
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickBid(): ClickBid {
  return {
    auctionId: '',
    cardSlug: '',
    domesticLeagueSlug: '',
    lastFiveSo5Appearances: 0,
    lastFiveSo5AverageScore: 0,
    lastFifteenSo5Appearances: 0,
    lastFifteenSo5AverageScore: 0,
    lastFortySo5Appearances: 0,
    lastFortySo5AverageScore: 0,
    playerSlug: '',
    playerTier: '',
    tierVersion: 0,
    position: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    value: 0,
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    secondary: false,
    interactionContext: '',
    sport: 0,
  };
}

export const ClickBid = {
  fromJSON(object: any): ClickBid {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      lastFiveSo5Appearances: isSet(object.last_five_so5_appearances)
        ? Number(object.last_five_so5_appearances)
        : 0,
      lastFiveSo5AverageScore: isSet(object.last_five_so5_average_score)
        ? Number(object.last_five_so5_average_score)
        : 0,
      lastFifteenSo5Appearances: isSet(object.last_fifteen_so5_appearances)
        ? Number(object.last_fifteen_so5_appearances)
        : 0,
      lastFifteenSo5AverageScore: isSet(object.last_fifteen_so5_average_score)
        ? Number(object.last_fifteen_so5_average_score)
        : 0,
      lastFortySo5Appearances: isSet(object.last_forty_so5_appearances)
        ? Number(object.last_forty_so5_appearances)
        : 0,
      lastFortySo5AverageScore: isSet(object.last_forty_so5_average_score)
        ? Number(object.last_forty_so5_average_score)
        : 0,
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      playerTier: isSet(object.player_tier) ? String(object.player_tier) : '',
      tierVersion: isSet(object.tier_version) ? Number(object.tier_version) : 0,
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickBid): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    message.lastFiveSo5Appearances !== undefined &&
      (obj.last_five_so5_appearances = Math.round(
        message.lastFiveSo5Appearances
      ));
    message.lastFiveSo5AverageScore !== undefined &&
      (obj.last_five_so5_average_score = message.lastFiveSo5AverageScore);
    message.lastFifteenSo5Appearances !== undefined &&
      (obj.last_fifteen_so5_appearances = Math.round(
        message.lastFifteenSo5Appearances
      ));
    message.lastFifteenSo5AverageScore !== undefined &&
      (obj.last_fifteen_so5_average_score = message.lastFifteenSo5AverageScore);
    message.lastFortySo5Appearances !== undefined &&
      (obj.last_forty_so5_appearances = Math.round(
        message.lastFortySo5Appearances
      ));
    message.lastFortySo5AverageScore !== undefined &&
      (obj.last_forty_so5_average_score = message.lastFortySo5AverageScore);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.playerTier !== undefined && (obj.player_tier = message.playerTier);
    message.tierVersion !== undefined &&
      (obj.tier_version = Math.round(message.tierVersion));
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.serialNumber !== undefined &&
      (obj.serial_number = Math.round(message.serialNumber));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickBundledBid(): ClickBundledBid {
  return {
    auctionId: '',
    cardSlugs: [],
    domesticLeagueSlug: '',
    playerSlugs: [],
    positions: [],
    cardCount: 0,
    limited: 0,
    rare: 0,
    superRare: 0,
    unique: 0,
    season: 0,
    teamSlug: '',
    value: 0,
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    secondary: false,
    interactionContext: '',
    sport: 0,
  };
}

export const ClickBundledBid = {
  fromJSON(object: any): ClickBundledBid {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      playerSlugs: Array.isArray(object?.player_slugs)
        ? object.player_slugs.map((e: any) => String(e))
        : [],
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      cardCount: isSet(object.card_count) ? Number(object.card_count) : 0,
      limited: isSet(object.limited) ? Number(object.limited) : 0,
      rare: isSet(object.rare) ? Number(object.rare) : 0,
      superRare: isSet(object.super_rare) ? Number(object.super_rare) : 0,
      unique: isSet(object.unique) ? Number(object.unique) : 0,
      season: isSet(object.season) ? Number(object.season) : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickBundledBid): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    if (message.playerSlugs) {
      obj.player_slugs = message.playerSlugs.map(e => e);
    } else {
      obj.player_slugs = [];
    }
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.cardCount !== undefined &&
      (obj.card_count = Math.round(message.cardCount));
    message.limited !== undefined &&
      (obj.limited = Math.round(message.limited));
    message.rare !== undefined && (obj.rare = Math.round(message.rare));
    message.superRare !== undefined &&
      (obj.super_rare = Math.round(message.superRare));
    message.unique !== undefined && (obj.unique = Math.round(message.unique));
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickBuy(): ClickBuy {
  return {
    offerId: '',
    cardSlug: '',
    domesticLeagueSlug: '',
    lastFiveSo5Appearances: 0,
    lastFiveSo5AverageScore: 0,
    lastFifteenSo5Appearances: 0,
    lastFifteenSo5AverageScore: 0,
    lastFortySo5Appearances: 0,
    lastFortySo5AverageScore: 0,
    playerSlug: '',
    playerTier: '',
    tierVersion: 0,
    position: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    value: 0,
    ethAmount: 0,
    eurAmount: 0,
    secondary: false,
    interactionContext: '',
    sport: 0,
  };
}

export const ClickBuy = {
  fromJSON(object: any): ClickBuy {
    return {
      offerId: isSet(object.offer_id) ? String(object.offer_id) : '',
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      lastFiveSo5Appearances: isSet(object.last_five_so5_appearances)
        ? Number(object.last_five_so5_appearances)
        : 0,
      lastFiveSo5AverageScore: isSet(object.last_five_so5_average_score)
        ? Number(object.last_five_so5_average_score)
        : 0,
      lastFifteenSo5Appearances: isSet(object.last_fifteen_so5_appearances)
        ? Number(object.last_fifteen_so5_appearances)
        : 0,
      lastFifteenSo5AverageScore: isSet(object.last_fifteen_so5_average_score)
        ? Number(object.last_fifteen_so5_average_score)
        : 0,
      lastFortySo5Appearances: isSet(object.last_forty_so5_appearances)
        ? Number(object.last_forty_so5_appearances)
        : 0,
      lastFortySo5AverageScore: isSet(object.last_forty_so5_average_score)
        ? Number(object.last_forty_so5_average_score)
        : 0,
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      playerTier: isSet(object.player_tier) ? String(object.player_tier) : '',
      tierVersion: isSet(object.tier_version) ? Number(object.tier_version) : 0,
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickBuy): unknown {
    const obj: any = {};
    message.offerId !== undefined && (obj.offer_id = message.offerId);
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    message.lastFiveSo5Appearances !== undefined &&
      (obj.last_five_so5_appearances = Math.round(
        message.lastFiveSo5Appearances
      ));
    message.lastFiveSo5AverageScore !== undefined &&
      (obj.last_five_so5_average_score = message.lastFiveSo5AverageScore);
    message.lastFifteenSo5Appearances !== undefined &&
      (obj.last_fifteen_so5_appearances = Math.round(
        message.lastFifteenSo5Appearances
      ));
    message.lastFifteenSo5AverageScore !== undefined &&
      (obj.last_fifteen_so5_average_score = message.lastFifteenSo5AverageScore);
    message.lastFortySo5Appearances !== undefined &&
      (obj.last_forty_so5_appearances = Math.round(
        message.lastFortySo5Appearances
      ));
    message.lastFortySo5AverageScore !== undefined &&
      (obj.last_forty_so5_average_score = message.lastFortySo5AverageScore);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.playerTier !== undefined && (obj.player_tier = message.playerTier);
    message.tierVersion !== undefined &&
      (obj.tier_version = Math.round(message.tierVersion));
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.serialNumber !== undefined &&
      (obj.serial_number = Math.round(message.serialNumber));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickBanner(): ClickBanner {
  return {
    bannerId: '',
    tileIndex: 0,
    bannerTitle: '',
    bannerType: '',
    bannerSlotName: '',
    sport: 0,
  };
}

export const ClickBanner = {
  fromJSON(object: any): ClickBanner {
    return {
      bannerId: isSet(object.banner_id) ? String(object.banner_id) : '',
      tileIndex: isSet(object.tile_index) ? Number(object.tile_index) : 0,
      bannerTitle: isSet(object.banner_title)
        ? String(object.banner_title)
        : '',
      bannerType: isSet(object.banner_type) ? String(object.banner_type) : '',
      bannerSlotName: isSet(object.banner_slot_name)
        ? String(object.banner_slot_name)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickBanner): unknown {
    const obj: any = {};
    message.bannerId !== undefined && (obj.banner_id = message.bannerId);
    message.tileIndex !== undefined &&
      (obj.tile_index = Math.round(message.tileIndex));
    message.bannerTitle !== undefined &&
      (obj.banner_title = message.bannerTitle);
    message.bannerType !== undefined && (obj.banner_type = message.bannerType);
    message.bannerSlotName !== undefined &&
      (obj.banner_slot_name = message.bannerSlotName);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseUseMarketFilter(): UseMarketFilter {
  return { filterName: '', filterValue: '', interactionContext: '', sport: 0 };
}

export const UseMarketFilter = {
  fromJSON(object: any): UseMarketFilter {
    return {
      filterName: isSet(object.filter_name) ? String(object.filter_name) : '',
      filterValue: isSet(object.filter_value)
        ? String(object.filter_value)
        : '',
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: UseMarketFilter): unknown {
    const obj: any = {};
    message.filterName !== undefined && (obj.filter_name = message.filterName);
    message.filterValue !== undefined &&
      (obj.filter_value = message.filterValue);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseFavoriteCard(): FavoriteCard {
  return {
    cardSlug: '',
    domesticLeagueSlug: '',
    lastFiveSo5Appearances: 0,
    lastFiveSo5AverageScore: 0,
    lastFifteenSo5Appearances: 0,
    lastFifteenSo5AverageScore: 0,
    lastFortySo5Appearances: 0,
    lastFortySo5AverageScore: 0,
    playerSlug: '',
    playerTier: '',
    tierVersion: 0,
    position: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    value: 0,
    customCardEditionName: '',
    interactionContext: '',
    sport: 0,
  };
}

export const FavoriteCard = {
  fromJSON(object: any): FavoriteCard {
    return {
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      lastFiveSo5Appearances: isSet(object.last_five_so5_appearances)
        ? Number(object.last_five_so5_appearances)
        : 0,
      lastFiveSo5AverageScore: isSet(object.last_five_so5_average_score)
        ? Number(object.last_five_so5_average_score)
        : 0,
      lastFifteenSo5Appearances: isSet(object.last_fifteen_so5_appearances)
        ? Number(object.last_fifteen_so5_appearances)
        : 0,
      lastFifteenSo5AverageScore: isSet(object.last_fifteen_so5_average_score)
        ? Number(object.last_fifteen_so5_average_score)
        : 0,
      lastFortySo5Appearances: isSet(object.last_forty_so5_appearances)
        ? Number(object.last_forty_so5_appearances)
        : 0,
      lastFortySo5AverageScore: isSet(object.last_forty_so5_average_score)
        ? Number(object.last_forty_so5_average_score)
        : 0,
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      playerTier: isSet(object.player_tier) ? String(object.player_tier) : '',
      tierVersion: isSet(object.tier_version) ? Number(object.tier_version) : 0,
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      customCardEditionName: isSet(object.custom_card_edition_name)
        ? String(object.custom_card_edition_name)
        : '',
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: FavoriteCard): unknown {
    const obj: any = {};
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    message.lastFiveSo5Appearances !== undefined &&
      (obj.last_five_so5_appearances = Math.round(
        message.lastFiveSo5Appearances
      ));
    message.lastFiveSo5AverageScore !== undefined &&
      (obj.last_five_so5_average_score = message.lastFiveSo5AverageScore);
    message.lastFifteenSo5Appearances !== undefined &&
      (obj.last_fifteen_so5_appearances = Math.round(
        message.lastFifteenSo5Appearances
      ));
    message.lastFifteenSo5AverageScore !== undefined &&
      (obj.last_fifteen_so5_average_score = message.lastFifteenSo5AverageScore);
    message.lastFortySo5Appearances !== undefined &&
      (obj.last_forty_so5_appearances = Math.round(
        message.lastFortySo5Appearances
      ));
    message.lastFortySo5AverageScore !== undefined &&
      (obj.last_forty_so5_average_score = message.lastFortySo5AverageScore);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.playerTier !== undefined && (obj.player_tier = message.playerTier);
    message.tierVersion !== undefined &&
      (obj.tier_version = Math.round(message.tierVersion));
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.serialNumber !== undefined &&
      (obj.serial_number = Math.round(message.serialNumber));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.customCardEditionName !== undefined &&
      (obj.custom_card_edition_name = message.customCardEditionName);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseFollowPlayer(): FollowPlayer {
  return {
    playerSlug: '',
    position: '',
    positions: [],
    teamSlug: '',
    alertLimited: false,
    alertRare: false,
    alertSuperRare: false,
    alertUnique: false,
    interactionContext: '',
    sport: 0,
  };
}

export const FollowPlayer = {
  fromJSON(object: any): FollowPlayer {
    return {
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      alertLimited: isSet(object.alert_limited)
        ? Boolean(object.alert_limited)
        : false,
      alertRare: isSet(object.alert_rare) ? Boolean(object.alert_rare) : false,
      alertSuperRare: isSet(object.alert_super_rare)
        ? Boolean(object.alert_super_rare)
        : false,
      alertUnique: isSet(object.alert_unique)
        ? Boolean(object.alert_unique)
        : false,
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: FollowPlayer): unknown {
    const obj: any = {};
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.alertLimited !== undefined &&
      (obj.alert_limited = message.alertLimited);
    message.alertRare !== undefined && (obj.alert_rare = message.alertRare);
    message.alertSuperRare !== undefined &&
      (obj.alert_super_rare = message.alertSuperRare);
    message.alertUnique !== undefined &&
      (obj.alert_unique = message.alertUnique);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBasePlaceBid(): PlaceBid {
  return {
    auctionId: '',
    cardSlug: '',
    domesticLeagueSlug: '',
    lastFiveSo5Appearances: 0,
    lastFiveSo5AverageScore: 0,
    lastFifteenSo5Appearances: 0,
    lastFifteenSo5AverageScore: 0,
    lastFortySo5Appearances: 0,
    lastFortySo5AverageScore: 0,
    playerSlug: '',
    playerTier: '',
    tierVersion: 0,
    position: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    value: 0,
    customCardEditionName: '',
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    fiatPayment: false,
    secondary: false,
    sport: 0,
  };
}

export const PlaceBid = {
  fromJSON(object: any): PlaceBid {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      lastFiveSo5Appearances: isSet(object.last_five_so5_appearances)
        ? Number(object.last_five_so5_appearances)
        : 0,
      lastFiveSo5AverageScore: isSet(object.last_five_so5_average_score)
        ? Number(object.last_five_so5_average_score)
        : 0,
      lastFifteenSo5Appearances: isSet(object.last_fifteen_so5_appearances)
        ? Number(object.last_fifteen_so5_appearances)
        : 0,
      lastFifteenSo5AverageScore: isSet(object.last_fifteen_so5_average_score)
        ? Number(object.last_fifteen_so5_average_score)
        : 0,
      lastFortySo5Appearances: isSet(object.last_forty_so5_appearances)
        ? Number(object.last_forty_so5_appearances)
        : 0,
      lastFortySo5AverageScore: isSet(object.last_forty_so5_average_score)
        ? Number(object.last_forty_so5_average_score)
        : 0,
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      playerTier: isSet(object.player_tier) ? String(object.player_tier) : '',
      tierVersion: isSet(object.tier_version) ? Number(object.tier_version) : 0,
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      customCardEditionName: isSet(object.custom_card_edition_name)
        ? String(object.custom_card_edition_name)
        : '',
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      fiatPayment: isSet(object.fiat_payment)
        ? Boolean(object.fiat_payment)
        : false,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: PlaceBid): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    message.lastFiveSo5Appearances !== undefined &&
      (obj.last_five_so5_appearances = Math.round(
        message.lastFiveSo5Appearances
      ));
    message.lastFiveSo5AverageScore !== undefined &&
      (obj.last_five_so5_average_score = message.lastFiveSo5AverageScore);
    message.lastFifteenSo5Appearances !== undefined &&
      (obj.last_fifteen_so5_appearances = Math.round(
        message.lastFifteenSo5Appearances
      ));
    message.lastFifteenSo5AverageScore !== undefined &&
      (obj.last_fifteen_so5_average_score = message.lastFifteenSo5AverageScore);
    message.lastFortySo5Appearances !== undefined &&
      (obj.last_forty_so5_appearances = Math.round(
        message.lastFortySo5Appearances
      ));
    message.lastFortySo5AverageScore !== undefined &&
      (obj.last_forty_so5_average_score = message.lastFortySo5AverageScore);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.playerTier !== undefined && (obj.player_tier = message.playerTier);
    message.tierVersion !== undefined &&
      (obj.tier_version = Math.round(message.tierVersion));
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.serialNumber !== undefined &&
      (obj.serial_number = Math.round(message.serialNumber));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.customCardEditionName !== undefined &&
      (obj.custom_card_edition_name = message.customCardEditionName);
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.fiatPayment !== undefined &&
      (obj.fiat_payment = message.fiatPayment);
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBasePlaceBundledBid(): PlaceBundledBid {
  return {
    auctionId: '',
    cardSlugs: [],
    domesticLeagueSlug: '',
    playerSlugs: [],
    positions: [],
    cardCount: 0,
    limited: 0,
    rare: 0,
    superRare: 0,
    unique: 0,
    season: 0,
    teamSlug: '',
    value: 0,
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    fiatPayment: false,
    secondary: false,
    sport: 0,
  };
}

export const PlaceBundledBid = {
  fromJSON(object: any): PlaceBundledBid {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      playerSlugs: Array.isArray(object?.player_slugs)
        ? object.player_slugs.map((e: any) => String(e))
        : [],
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      cardCount: isSet(object.card_count) ? Number(object.card_count) : 0,
      limited: isSet(object.limited) ? Number(object.limited) : 0,
      rare: isSet(object.rare) ? Number(object.rare) : 0,
      superRare: isSet(object.super_rare) ? Number(object.super_rare) : 0,
      unique: isSet(object.unique) ? Number(object.unique) : 0,
      season: isSet(object.season) ? Number(object.season) : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      fiatPayment: isSet(object.fiat_payment)
        ? Boolean(object.fiat_payment)
        : false,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: PlaceBundledBid): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    if (message.playerSlugs) {
      obj.player_slugs = message.playerSlugs.map(e => e);
    } else {
      obj.player_slugs = [];
    }
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.cardCount !== undefined &&
      (obj.card_count = Math.round(message.cardCount));
    message.limited !== undefined &&
      (obj.limited = Math.round(message.limited));
    message.rare !== undefined && (obj.rare = Math.round(message.rare));
    message.superRare !== undefined &&
      (obj.super_rare = Math.round(message.superRare));
    message.unique !== undefined && (obj.unique = Math.round(message.unique));
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.fiatPayment !== undefined &&
      (obj.fiat_payment = message.fiatPayment);
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseToggleHideBalance(): ToggleHideBalance {
  return { hidden: false };
}

export const ToggleHideBalance = {
  fromJSON(object: any): ToggleHideBalance {
    return {
      hidden: isSet(object.hidden) ? Boolean(object.hidden) : false,
    };
  },

  toJSON(message: ToggleHideBalance): unknown {
    const obj: any = {};
    message.hidden !== undefined && (obj.hidden = message.hidden);
    return obj;
  },
};

function createBaseSeeTCUModal(): SeeTCUModal {
  return { mobile: false };
}

export const SeeTCUModal = {
  fromJSON(object: any): SeeTCUModal {
    return {
      mobile: isSet(object.mobile) ? Boolean(object.mobile) : false,
    };
  },

  toJSON(message: SeeTCUModal): unknown {
    const obj: any = {};
    message.mobile !== undefined && (obj.mobile = message.mobile);
    return obj;
  },
};

function createBaseAcceptTCU(): AcceptTCU {
  return { source: '' };
}

export const AcceptTCU = {
  fromJSON(object: any): AcceptTCU {
    return {
      source: isSet(object.source) ? String(object.source) : '',
    };
  },

  toJSON(message: AcceptTCU): unknown {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    return obj;
  },
};

function createBaseAttemptToSignupFromSanctionedCountry(): AttemptToSignupFromSanctionedCountry {
  return { countryCode: '' };
}

export const AttemptToSignupFromSanctionedCountry = {
  fromJSON(object: any): AttemptToSignupFromSanctionedCountry {
    return {
      countryCode: isSet(object.country_code)
        ? String(object.country_code)
        : '',
    };
  },

  toJSON(message: AttemptToSignupFromSanctionedCountry): unknown {
    const obj: any = {};
    message.countryCode !== undefined &&
      (obj.country_code = message.countryCode);
    return obj;
  },
};

function createBaseSignUpForProductUpdates(): SignUpForProductUpdates {
  return { email: '', topic: '' };
}

export const SignUpForProductUpdates = {
  fromJSON(object: any): SignUpForProductUpdates {
    return {
      email: isSet(object.email) ? String(object.email) : '',
      topic: isSet(object.topic) ? String(object.topic) : '',
    };
  },

  toJSON(message: SignUpForProductUpdates): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    message.topic !== undefined && (obj.topic = message.topic);
    return obj;
  },
};

function createBaseUseThirdParty(): UseThirdParty {
  return { name: '' };
}

export const UseThirdParty = {
  fromJSON(object: any): UseThirdParty {
    return {
      name: isSet(object.name) ? String(object.name) : '',
    };
  },

  toJSON(message: UseThirdParty): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
};

function createBaseClickInviteFriends(): ClickInviteFriends {
  return { source: '' };
}

export const ClickInviteFriends = {
  fromJSON(object: any): ClickInviteFriends {
    return {
      source: isSet(object.source) ? String(object.source) : '',
    };
  },

  toJSON(message: ClickInviteFriends): unknown {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    return obj;
  },
};

function createBaseDisplayWarningHighBidAmount(): DisplayWarningHighBidAmount {
  return {
    auctionId: '',
    cardSlugs: [],
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    fiatPayment: false,
    multiplier: 0,
    sport: 0,
  };
}

export const DisplayWarningHighBidAmount = {
  fromJSON(object: any): DisplayWarningHighBidAmount {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      fiatPayment: isSet(object.fiat_payment)
        ? Boolean(object.fiat_payment)
        : false,
      multiplier: isSet(object.multiplier) ? Number(object.multiplier) : 0,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: DisplayWarningHighBidAmount): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.fiatPayment !== undefined &&
      (obj.fiat_payment = message.fiatPayment);
    message.multiplier !== undefined && (obj.multiplier = message.multiplier);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseDisplayWarningVeryHighBidAmount(): DisplayWarningVeryHighBidAmount {
  return {
    auctionId: '',
    cardSlugs: [],
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    fiatPayment: false,
    multiplier: 0,
    sport: 0,
  };
}

export const DisplayWarningVeryHighBidAmount = {
  fromJSON(object: any): DisplayWarningVeryHighBidAmount {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      fiatPayment: isSet(object.fiat_payment)
        ? Boolean(object.fiat_payment)
        : false,
      multiplier: isSet(object.multiplier) ? Number(object.multiplier) : 0,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: DisplayWarningVeryHighBidAmount): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.fiatPayment !== undefined &&
      (obj.fiat_payment = message.fiatPayment);
    message.multiplier !== undefined && (obj.multiplier = message.multiplier);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBasePlaceBidAfterDisplayWarningHighBidAmount(): PlaceBidAfterDisplayWarningHighBidAmount {
  return {
    auctionId: '',
    cardSlugs: [],
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    fiatPayment: false,
    multiplier: 0,
    sport: 0,
  };
}

export const PlaceBidAfterDisplayWarningHighBidAmount = {
  fromJSON(object: any): PlaceBidAfterDisplayWarningHighBidAmount {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      fiatPayment: isSet(object.fiat_payment)
        ? Boolean(object.fiat_payment)
        : false,
      multiplier: isSet(object.multiplier) ? Number(object.multiplier) : 0,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: PlaceBidAfterDisplayWarningHighBidAmount): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.fiatPayment !== undefined &&
      (obj.fiat_payment = message.fiatPayment);
    message.multiplier !== undefined && (obj.multiplier = message.multiplier);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBasePlaceBidAfterDisplayWarningVeryHighBidAmount(): PlaceBidAfterDisplayWarningVeryHighBidAmount {
  return {
    auctionId: '',
    cardSlugs: [],
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    fiatPayment: false,
    multiplier: 0,
    sport: 0,
  };
}

export const PlaceBidAfterDisplayWarningVeryHighBidAmount = {
  fromJSON(object: any): PlaceBidAfterDisplayWarningVeryHighBidAmount {
    return {
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      fiatPayment: isSet(object.fiat_payment)
        ? Boolean(object.fiat_payment)
        : false,
      multiplier: isSet(object.multiplier) ? Number(object.multiplier) : 0,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: PlaceBidAfterDisplayWarningVeryHighBidAmount): unknown {
    const obj: any = {};
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.fiatPayment !== undefined &&
      (obj.fiat_payment = message.fiatPayment);
    message.multiplier !== undefined && (obj.multiplier = message.multiplier);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickFilterInSearch(): ClickFilterInSearch {
  return { sport: 0, context: 0, searchTerm: '' };
}

export const ClickFilterInSearch = {
  fromJSON(object: any): ClickFilterInSearch {
    return {
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      context: isSet(object.context) ? sportFromJSON(object.context) : 0,
      searchTerm: isSet(object.search_term) ? String(object.search_term) : '',
    };
  },

  toJSON(message: ClickFilterInSearch): unknown {
    const obj: any = {};
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    message.context !== undefined &&
      (obj.context = sportToJSON(message.context));
    message.searchTerm !== undefined && (obj.search_term = message.searchTerm);
    return obj;
  },
};

function createBaseClickSearchResult(): ClickSearchResult {
  return {
    sport: 0,
    context: 0,
    searchTerm: '',
    resultCategory: '',
    resultDestination: '',
  };
}

export const ClickSearchResult = {
  fromJSON(object: any): ClickSearchResult {
    return {
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      context: isSet(object.context) ? sportFromJSON(object.context) : 0,
      searchTerm: isSet(object.search_term) ? String(object.search_term) : '',
      resultCategory: isSet(object.result_category)
        ? String(object.result_category)
        : '',
      resultDestination: isSet(object.result_destination)
        ? String(object.result_destination)
        : '',
    };
  },

  toJSON(message: ClickSearchResult): unknown {
    const obj: any = {};
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    message.context !== undefined &&
      (obj.context = sportToJSON(message.context));
    message.searchTerm !== undefined && (obj.search_term = message.searchTerm);
    message.resultCategory !== undefined &&
      (obj.result_category = message.resultCategory);
    message.resultDestination !== undefined &&
      (obj.result_destination = message.resultDestination);
    return obj;
  },
};

function createBaseExitSearchWithoutClickingResult(): ExitSearchWithoutClickingResult {
  return { sport: 0, context: 0, searchTerm: '' };
}

export const ExitSearchWithoutClickingResult = {
  fromJSON(object: any): ExitSearchWithoutClickingResult {
    return {
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      context: isSet(object.context) ? sportFromJSON(object.context) : 0,
      searchTerm: isSet(object.search_term) ? String(object.search_term) : '',
    };
  },

  toJSON(message: ExitSearchWithoutClickingResult): unknown {
    const obj: any = {};
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    message.context !== undefined &&
      (obj.context = sportToJSON(message.context));
    message.searchTerm !== undefined && (obj.search_term = message.searchTerm);
    return obj;
  },
};

function createBaseWalletOpened(): WalletOpened {
  return { interactionContext: '', sport: 0 };
}

export const WalletOpened = {
  fromJSON(object: any): WalletOpened {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: WalletOpened): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseListCard(): ListCard {
  return {
    cardSlug: '',
    domesticLeagueSlug: '',
    lastFiveSo5Appearances: 0,
    lastFiveSo5AverageScore: 0,
    lastFifteenSo5Appearances: 0,
    lastFifteenSo5AverageScore: 0,
    lastFortySo5Appearances: 0,
    lastFortySo5AverageScore: 0,
    playerSlug: '',
    playerTier: '',
    tierVersion: 0,
    position: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    value: 0,
    customCardEditionName: '',
    ethAmount: 0,
    eurAmount: 0,
    duration: 0,
    sport: 0,
  };
}

export const ListCard = {
  fromJSON(object: any): ListCard {
    return {
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      lastFiveSo5Appearances: isSet(object.last_five_so5_appearances)
        ? Number(object.last_five_so5_appearances)
        : 0,
      lastFiveSo5AverageScore: isSet(object.last_five_so5_average_score)
        ? Number(object.last_five_so5_average_score)
        : 0,
      lastFifteenSo5Appearances: isSet(object.last_fifteen_so5_appearances)
        ? Number(object.last_fifteen_so5_appearances)
        : 0,
      lastFifteenSo5AverageScore: isSet(object.last_fifteen_so5_average_score)
        ? Number(object.last_fifteen_so5_average_score)
        : 0,
      lastFortySo5Appearances: isSet(object.last_forty_so5_appearances)
        ? Number(object.last_forty_so5_appearances)
        : 0,
      lastFortySo5AverageScore: isSet(object.last_forty_so5_average_score)
        ? Number(object.last_forty_so5_average_score)
        : 0,
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      playerTier: isSet(object.player_tier) ? String(object.player_tier) : '',
      tierVersion: isSet(object.tier_version) ? Number(object.tier_version) : 0,
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      customCardEditionName: isSet(object.custom_card_edition_name)
        ? String(object.custom_card_edition_name)
        : '',
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      duration: isSet(object.duration) ? Number(object.duration) : 0,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ListCard): unknown {
    const obj: any = {};
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    message.lastFiveSo5Appearances !== undefined &&
      (obj.last_five_so5_appearances = Math.round(
        message.lastFiveSo5Appearances
      ));
    message.lastFiveSo5AverageScore !== undefined &&
      (obj.last_five_so5_average_score = message.lastFiveSo5AverageScore);
    message.lastFifteenSo5Appearances !== undefined &&
      (obj.last_fifteen_so5_appearances = Math.round(
        message.lastFifteenSo5Appearances
      ));
    message.lastFifteenSo5AverageScore !== undefined &&
      (obj.last_fifteen_so5_average_score = message.lastFifteenSo5AverageScore);
    message.lastFortySo5Appearances !== undefined &&
      (obj.last_forty_so5_appearances = Math.round(
        message.lastFortySo5Appearances
      ));
    message.lastFortySo5AverageScore !== undefined &&
      (obj.last_forty_so5_average_score = message.lastFortySo5AverageScore);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.playerTier !== undefined && (obj.player_tier = message.playerTier);
    message.tierVersion !== undefined &&
      (obj.tier_version = Math.round(message.tierVersion));
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.serialNumber !== undefined &&
      (obj.serial_number = Math.round(message.serialNumber));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.customCardEditionName !== undefined &&
      (obj.custom_card_edition_name = message.customCardEditionName);
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.duration !== undefined &&
      (obj.duration = Math.round(message.duration));
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseUnlistCard(): UnlistCard {
  return {
    cardSlug: '',
    domesticLeagueSlug: '',
    lastFiveSo5Appearances: 0,
    lastFiveSo5AverageScore: 0,
    lastFifteenSo5Appearances: 0,
    lastFifteenSo5AverageScore: 0,
    lastFortySo5Appearances: 0,
    lastFortySo5AverageScore: 0,
    playerSlug: '',
    playerTier: '',
    tierVersion: 0,
    position: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    value: 0,
    customCardEditionName: '',
    unlistingType: '',
    listingTime: 0,
    cancelledBy: '',
    sport: 0,
  };
}

export const UnlistCard = {
  fromJSON(object: any): UnlistCard {
    return {
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      lastFiveSo5Appearances: isSet(object.last_five_so5_appearances)
        ? Number(object.last_five_so5_appearances)
        : 0,
      lastFiveSo5AverageScore: isSet(object.last_five_so5_average_score)
        ? Number(object.last_five_so5_average_score)
        : 0,
      lastFifteenSo5Appearances: isSet(object.last_fifteen_so5_appearances)
        ? Number(object.last_fifteen_so5_appearances)
        : 0,
      lastFifteenSo5AverageScore: isSet(object.last_fifteen_so5_average_score)
        ? Number(object.last_fifteen_so5_average_score)
        : 0,
      lastFortySo5Appearances: isSet(object.last_forty_so5_appearances)
        ? Number(object.last_forty_so5_appearances)
        : 0,
      lastFortySo5AverageScore: isSet(object.last_forty_so5_average_score)
        ? Number(object.last_forty_so5_average_score)
        : 0,
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      playerTier: isSet(object.player_tier) ? String(object.player_tier) : '',
      tierVersion: isSet(object.tier_version) ? Number(object.tier_version) : 0,
      position: isSet(object.position) ? String(object.position) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      customCardEditionName: isSet(object.custom_card_edition_name)
        ? String(object.custom_card_edition_name)
        : '',
      unlistingType: isSet(object.unlisting_type)
        ? String(object.unlisting_type)
        : '',
      listingTime: isSet(object.listing_time) ? Number(object.listing_time) : 0,
      cancelledBy: isSet(object.cancelled_by)
        ? String(object.cancelled_by)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: UnlistCard): unknown {
    const obj: any = {};
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    message.lastFiveSo5Appearances !== undefined &&
      (obj.last_five_so5_appearances = Math.round(
        message.lastFiveSo5Appearances
      ));
    message.lastFiveSo5AverageScore !== undefined &&
      (obj.last_five_so5_average_score = message.lastFiveSo5AverageScore);
    message.lastFifteenSo5Appearances !== undefined &&
      (obj.last_fifteen_so5_appearances = Math.round(
        message.lastFifteenSo5Appearances
      ));
    message.lastFifteenSo5AverageScore !== undefined &&
      (obj.last_fifteen_so5_average_score = message.lastFifteenSo5AverageScore);
    message.lastFortySo5Appearances !== undefined &&
      (obj.last_forty_so5_appearances = Math.round(
        message.lastFortySo5Appearances
      ));
    message.lastFortySo5AverageScore !== undefined &&
      (obj.last_forty_so5_average_score = message.lastFortySo5AverageScore);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.playerTier !== undefined && (obj.player_tier = message.playerTier);
    message.tierVersion !== undefined &&
      (obj.tier_version = Math.round(message.tierVersion));
    message.position !== undefined && (obj.position = message.position);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.serialNumber !== undefined &&
      (obj.serial_number = Math.round(message.serialNumber));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.customCardEditionName !== undefined &&
      (obj.custom_card_edition_name = message.customCardEditionName);
    message.unlistingType !== undefined &&
      (obj.unlisting_type = message.unlistingType);
    message.listingTime !== undefined &&
      (obj.listing_time = Math.round(message.listingTime));
    message.cancelledBy !== undefined &&
      (obj.cancelled_by = message.cancelledBy);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickPlayNow(): ClickPlayNow {
  return { interactionContext: '', sport: 0 };
}

export const ClickPlayNow = {
  fromJSON(object: any): ClickPlayNow {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickPlayNow): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickSignUp(): ClickSignUp {
  return { interactionContext: '' };
}

export const ClickSignUp = {
  fromJSON(object: any): ClickSignUp {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
    };
  },

  toJSON(message: ClickSignUp): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    return obj;
  },
};

function createBaseViewSignUpModal(): ViewSignUpModal {
  return { interactionContext: '' };
}

export const ViewSignUpModal = {
  fromJSON(object: any): ViewSignUpModal {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
    };
  },

  toJSON(message: ViewSignUpModal): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    return obj;
  },
};

function createBaseClickOauthSignUp(): ClickOauthSignUp {
  return { method: 0 };
}

export const ClickOauthSignUp = {
  fromJSON(object: any): ClickOauthSignUp {
    return {
      method: isSet(object.method)
        ? clickOauthSignUp_MethodFromJSON(object.method)
        : 0,
    };
  },

  toJSON(message: ClickOauthSignUp): unknown {
    const obj: any = {};
    message.method !== undefined &&
      (obj.method = clickOauthSignUp_MethodToJSON(message.method));
    return obj;
  },
};

function createBaseClickPriceHistory(): ClickPriceHistory {
  return { interactionContext: '', cardSlug: '', clickedCardSlug: '' };
}

export const ClickPriceHistory = {
  fromJSON(object: any): ClickPriceHistory {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      clickedCardSlug: isSet(object.clicked_card_slug)
        ? String(object.clicked_card_slug)
        : '',
    };
  },

  toJSON(message: ClickPriceHistory): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.clickedCardSlug !== undefined &&
      (obj.clicked_card_slug = message.clickedCardSlug);
    return obj;
  },
};

function createBaseExpandPriceHistory(): ExpandPriceHistory {
  return { interactionContext: '', cardSlug: '' };
}

export const ExpandPriceHistory = {
  fromJSON(object: any): ExpandPriceHistory {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
    };
  },

  toJSON(message: ExpandPriceHistory): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    return obj;
  },
};

function createBaseRevealPriceHistoryOnOffer(): RevealPriceHistoryOnOffer {
  return { cardSlug: '' };
}

export const RevealPriceHistoryOnOffer = {
  fromJSON(object: any): RevealPriceHistoryOnOffer {
    return {
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
    };
  },

  toJSON(message: RevealPriceHistoryOnOffer): unknown {
    const obj: any = {};
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    return obj;
  },
};

function createBaseClickBundledBuy(): ClickBundledBuy {
  return {
    offerId: '',
    cardSlugs: [],
    domesticLeagueSlug: '',
    playerSlugs: [],
    positions: [],
    cardCount: 0,
    limited: 0,
    rare: 0,
    superRare: 0,
    unique: 0,
    season: 0,
    teamSlug: '',
    value: 0,
    ethAmount: 0,
    eurAmount: 0,
    secondary: false,
    interactionContext: '',
    sport: 0,
  };
}

export const ClickBundledBuy = {
  fromJSON(object: any): ClickBundledBuy {
    return {
      offerId: isSet(object.offer_id) ? String(object.offer_id) : '',
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      domesticLeagueSlug: isSet(object.domestic_league_slug)
        ? String(object.domestic_league_slug)
        : '',
      playerSlugs: Array.isArray(object?.player_slugs)
        ? object.player_slugs.map((e: any) => String(e))
        : [],
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      cardCount: isSet(object.card_count) ? Number(object.card_count) : 0,
      limited: isSet(object.limited) ? Number(object.limited) : 0,
      rare: isSet(object.rare) ? Number(object.rare) : 0,
      superRare: isSet(object.super_rare) ? Number(object.super_rare) : 0,
      unique: isSet(object.unique) ? Number(object.unique) : 0,
      season: isSet(object.season) ? Number(object.season) : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      value: isSet(object.value) ? Number(object.value) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickBundledBuy): unknown {
    const obj: any = {};
    message.offerId !== undefined && (obj.offer_id = message.offerId);
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.domesticLeagueSlug !== undefined &&
      (obj.domestic_league_slug = message.domesticLeagueSlug);
    if (message.playerSlugs) {
      obj.player_slugs = message.playerSlugs.map(e => e);
    } else {
      obj.player_slugs = [];
    }
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.cardCount !== undefined &&
      (obj.card_count = Math.round(message.cardCount));
    message.limited !== undefined &&
      (obj.limited = Math.round(message.limited));
    message.rare !== undefined && (obj.rare = Math.round(message.rare));
    message.superRare !== undefined &&
      (obj.super_rare = Math.round(message.superRare));
    message.unique !== undefined && (obj.unique = Math.round(message.unique));
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.value !== undefined && (obj.value = Math.round(message.value));
    message.ethAmount !== undefined &&
      (obj.eth_amount = Math.round(message.ethAmount));
    message.eurAmount !== undefined &&
      (obj.eur_amount = Math.round(message.eurAmount));
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
