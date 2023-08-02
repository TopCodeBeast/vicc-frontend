/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import {
  Sport,
  sportFromJSON,
  sportToJSON,
} from '../../../events/shared/events';

export const protobufPackage = 'events.platform.web';

export interface ReferralCardBought {
  referralId: string;
  sport: Sport;
  /**
   * card_slug should be used
   *
   * @deprecated
   */
  cardSlugs: string[];
  cardSlug: string;
  /**
   * player_slug should be used
   *
   * @deprecated
   */
  playerSlugs: string[];
  playerSlug: string;
  positions: string[];
  season: number;
  teamSlug: string;
  cardCount: number;
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
  auctionId: string;
  primaryOfferId: string;
  count: number;
  ethAmount: number;
  eurAmount: number;
  conversionCreditEthAmount: number;
  conversionCreditEurAmount: number;
  fiatPayment: boolean;
  secondary: boolean;
  footballCardsBought: number;
  baseballCardsBought: number;
  nbaCardsBought: number;
}

export interface ReferralCompleted {
  referralId: string;
  sport: Sport;
  footballCardsBought: number;
  baseballCardsBought: number;
  nbaCardsBought: number;
}

export interface ReferralRewardSent {
  referralId: string;
  sport: Sport;
  cardSlug: string;
  playerSlug: string;
  positions: string[];
  scarcity: string;
  season: number;
  serialNumber: number;
  teamSlug: string;
  position: string;
}

export interface ClickListAgain {
  cardSlug: string;
}

export interface UserFlagToggled {
  flag: string;
}

export interface ClickTrade {
  interactionContext: string;
  offerId: string;
}

export interface SubmitSignUpForm {
  interactionContext: string;
}

export interface ClearMarketFilters {
  interactionContext: string;
  sport: Sport;
  filtersCount: number;
}

export interface RemoveMarketFilterChip {
  interactionContext: string;
  sport: Sport;
  filterName: string;
  filterValue: string;
}

export interface SetDefaultMarketFilters {
  interactionContext: string;
  sport: Sport;
  filters: { [key: string]: string };
}

export interface SetDefaultMarketFilters_FiltersEntry {
  key: string;
  value: string;
}

export interface ClearDefaultMarketFilters {
  interactionContext: string;
  sport: Sport;
}

export interface ConfirmPurchaseForm {
  interactionContext: string;
  ethAmount: number;
  eurAmount: number;
  fiatPayment: boolean;
  sport: Sport;
}

export interface ClickAnnouncementLink {
  announcementId: string;
  announcementTitle: string;
  linkHref: string;
}

export interface CreateSavedSearch {
  name: string;
  filters: { [key: string]: string };
  interactionContext: string;
  sport: Sport;
}

export interface CreateSavedSearch_FiltersEntry {
  key: string;
  value: string;
}

export interface SelectSavedSearch {
  name: string;
  filters: { [key: string]: string };
  interactionContext: string;
  sport: Sport;
}

export interface SelectSavedSearch_FiltersEntry {
  key: string;
  value: string;
}

export interface DeleteSavedSearch {
  name: string;
  filters: { [key: string]: string };
  interactionContext: string;
  sport: Sport;
}

export interface DeleteSavedSearch_FiltersEntry {
  key: string;
  value: string;
}

export interface SwitchStackedView {
  stacked: boolean;
  sport: Sport;
}

export interface ClickStack {
  playerSlug: string;
  scarcity: string;
  season: number;
  teamSlug: string;
  interactionContext: string;
  sport: Sport;
}

export interface ClickMarketTrend {
  timeframe: string;
  trend: string;
  slug: string;
  interactionContext: string;
  sport: Sport;
}

export interface LoadMarketTrends {
  timeframe: string;
  sales: string[];
  onTheRise: string[];
  volumes: string[];
  interactionContext: string;
  sport: Sport;
}

function createBaseReferralCardBought(): ReferralCardBought {
  return {
    referralId: '',
    sport: 0,
    cardSlugs: [],
    cardSlug: '',
    playerSlugs: [],
    playerSlug: '',
    positions: [],
    season: 0,
    teamSlug: '',
    cardCount: 0,
    limited: 0,
    rare: 0,
    superRare: 0,
    unique: 0,
    auctionId: '',
    primaryOfferId: '',
    count: 0,
    ethAmount: 0,
    eurAmount: 0,
    conversionCreditEthAmount: 0,
    conversionCreditEurAmount: 0,
    fiatPayment: false,
    secondary: false,
    footballCardsBought: 0,
    baseballCardsBought: 0,
    nbaCardsBought: 0,
  };
}

export const ReferralCardBought = {
  fromJSON(object: any): ReferralCardBought {
    return {
      referralId: isSet(object.referral_id) ? String(object.referral_id) : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      cardSlugs: Array.isArray(object?.card_slugs)
        ? object.card_slugs.map((e: any) => String(e))
        : [],
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      playerSlugs: Array.isArray(object?.player_slugs)
        ? object.player_slugs.map((e: any) => String(e))
        : [],
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      season: isSet(object.season) ? Number(object.season) : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      cardCount: isSet(object.card_count) ? Number(object.card_count) : 0,
      limited: isSet(object.limited) ? Number(object.limited) : 0,
      rare: isSet(object.rare) ? Number(object.rare) : 0,
      superRare: isSet(object.super_rare) ? Number(object.super_rare) : 0,
      unique: isSet(object.unique) ? Number(object.unique) : 0,
      auctionId: isSet(object.auction_id) ? String(object.auction_id) : '',
      primaryOfferId: isSet(object.primary_offer_id)
        ? String(object.primary_offer_id)
        : '',
      count: isSet(object.count) ? Number(object.count) : 0,
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      conversionCreditEthAmount: isSet(object.conversion_credit_eth_amount)
        ? Number(object.conversion_credit_eth_amount)
        : 0,
      conversionCreditEurAmount: isSet(object.conversion_credit_eur_amount)
        ? Number(object.conversion_credit_eur_amount)
        : 0,
      fiatPayment: isSet(object.fiat_payment)
        ? Boolean(object.fiat_payment)
        : false,
      secondary: isSet(object.secondary) ? Boolean(object.secondary) : false,
      footballCardsBought: isSet(object.football_cards_bought)
        ? Number(object.football_cards_bought)
        : 0,
      baseballCardsBought: isSet(object.baseball_cards_bought)
        ? Number(object.baseball_cards_bought)
        : 0,
      nbaCardsBought: isSet(object.nba_cards_bought)
        ? Number(object.nba_cards_bought)
        : 0,
    };
  },

  toJSON(message: ReferralCardBought): unknown {
    const obj: any = {};
    message.referralId !== undefined && (obj.referral_id = message.referralId);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    if (message.cardSlugs) {
      obj.card_slugs = message.cardSlugs.map(e => e);
    } else {
      obj.card_slugs = [];
    }
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    if (message.playerSlugs) {
      obj.player_slugs = message.playerSlugs.map(e => e);
    } else {
      obj.player_slugs = [];
    }
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    if (message.positions) {
      obj.positions = message.positions.map(e => e);
    } else {
      obj.positions = [];
    }
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.cardCount !== undefined &&
      (obj.card_count = Math.round(message.cardCount));
    message.limited !== undefined &&
      (obj.limited = Math.round(message.limited));
    message.rare !== undefined && (obj.rare = Math.round(message.rare));
    message.superRare !== undefined &&
      (obj.super_rare = Math.round(message.superRare));
    message.unique !== undefined && (obj.unique = Math.round(message.unique));
    message.auctionId !== undefined && (obj.auction_id = message.auctionId);
    message.primaryOfferId !== undefined &&
      (obj.primary_offer_id = message.primaryOfferId);
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.conversionCreditEthAmount !== undefined &&
      (obj.conversion_credit_eth_amount = message.conversionCreditEthAmount);
    message.conversionCreditEurAmount !== undefined &&
      (obj.conversion_credit_eur_amount = message.conversionCreditEurAmount);
    message.fiatPayment !== undefined &&
      (obj.fiat_payment = message.fiatPayment);
    message.secondary !== undefined && (obj.secondary = message.secondary);
    message.footballCardsBought !== undefined &&
      (obj.football_cards_bought = Math.round(message.footballCardsBought));
    message.baseballCardsBought !== undefined &&
      (obj.baseball_cards_bought = Math.round(message.baseballCardsBought));
    message.nbaCardsBought !== undefined &&
      (obj.nba_cards_bought = Math.round(message.nbaCardsBought));
    return obj;
  },
};

function createBaseReferralCompleted(): ReferralCompleted {
  return {
    referralId: '',
    sport: 0,
    footballCardsBought: 0,
    baseballCardsBought: 0,
    nbaCardsBought: 0,
  };
}

export const ReferralCompleted = {
  fromJSON(object: any): ReferralCompleted {
    return {
      referralId: isSet(object.referral_id) ? String(object.referral_id) : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      footballCardsBought: isSet(object.football_cards_bought)
        ? Number(object.football_cards_bought)
        : 0,
      baseballCardsBought: isSet(object.baseball_cards_bought)
        ? Number(object.baseball_cards_bought)
        : 0,
      nbaCardsBought: isSet(object.nba_cards_bought)
        ? Number(object.nba_cards_bought)
        : 0,
    };
  },

  toJSON(message: ReferralCompleted): unknown {
    const obj: any = {};
    message.referralId !== undefined && (obj.referral_id = message.referralId);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    message.footballCardsBought !== undefined &&
      (obj.football_cards_bought = Math.round(message.footballCardsBought));
    message.baseballCardsBought !== undefined &&
      (obj.baseball_cards_bought = Math.round(message.baseballCardsBought));
    message.nbaCardsBought !== undefined &&
      (obj.nba_cards_bought = Math.round(message.nbaCardsBought));
    return obj;
  },
};

function createBaseReferralRewardSent(): ReferralRewardSent {
  return {
    referralId: '',
    sport: 0,
    cardSlug: '',
    playerSlug: '',
    positions: [],
    scarcity: '',
    season: 0,
    serialNumber: 0,
    teamSlug: '',
    position: '',
  };
}

export const ReferralRewardSent = {
  fromJSON(object: any): ReferralRewardSent {
    return {
      referralId: isSet(object.referral_id) ? String(object.referral_id) : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      positions: Array.isArray(object?.positions)
        ? object.positions.map((e: any) => String(e))
        : [],
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      serialNumber: isSet(object.serial_number)
        ? Number(object.serial_number)
        : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      position: isSet(object.position) ? String(object.position) : '',
    };
  },

  toJSON(message: ReferralRewardSent): unknown {
    const obj: any = {};
    message.referralId !== undefined && (obj.referral_id = message.referralId);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
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
    message.position !== undefined && (obj.position = message.position);
    return obj;
  },
};

function createBaseClickListAgain(): ClickListAgain {
  return { cardSlug: '' };
}

export const ClickListAgain = {
  fromJSON(object: any): ClickListAgain {
    return {
      cardSlug: isSet(object.card_slug) ? String(object.card_slug) : '',
    };
  },

  toJSON(message: ClickListAgain): unknown {
    const obj: any = {};
    message.cardSlug !== undefined && (obj.card_slug = message.cardSlug);
    return obj;
  },
};

function createBaseUserFlagToggled(): UserFlagToggled {
  return { flag: '' };
}

export const UserFlagToggled = {
  fromJSON(object: any): UserFlagToggled {
    return {
      flag: isSet(object.flag) ? String(object.flag) : '',
    };
  },

  toJSON(message: UserFlagToggled): unknown {
    const obj: any = {};
    message.flag !== undefined && (obj.flag = message.flag);
    return obj;
  },
};

function createBaseClickTrade(): ClickTrade {
  return { interactionContext: '', offerId: '' };
}

export const ClickTrade = {
  fromJSON(object: any): ClickTrade {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      offerId: isSet(object.offer_id) ? String(object.offer_id) : '',
    };
  },

  toJSON(message: ClickTrade): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.offerId !== undefined && (obj.offer_id = message.offerId);
    return obj;
  },
};

function createBaseSubmitSignUpForm(): SubmitSignUpForm {
  return { interactionContext: '' };
}

export const SubmitSignUpForm = {
  fromJSON(object: any): SubmitSignUpForm {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
    };
  },

  toJSON(message: SubmitSignUpForm): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    return obj;
  },
};

function createBaseClearMarketFilters(): ClearMarketFilters {
  return { interactionContext: '', sport: 0, filtersCount: 0 };
}

export const ClearMarketFilters = {
  fromJSON(object: any): ClearMarketFilters {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      filtersCount: isSet(object.filters_count)
        ? Number(object.filters_count)
        : 0,
    };
  },

  toJSON(message: ClearMarketFilters): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    message.filtersCount !== undefined &&
      (obj.filters_count = Math.round(message.filtersCount));
    return obj;
  },
};

function createBaseRemoveMarketFilterChip(): RemoveMarketFilterChip {
  return { interactionContext: '', sport: 0, filterName: '', filterValue: '' };
}

export const RemoveMarketFilterChip = {
  fromJSON(object: any): RemoveMarketFilterChip {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      filterName: isSet(object.filter_name) ? String(object.filter_name) : '',
      filterValue: isSet(object.filter_value)
        ? String(object.filter_value)
        : '',
    };
  },

  toJSON(message: RemoveMarketFilterChip): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    message.filterName !== undefined && (obj.filter_name = message.filterName);
    message.filterValue !== undefined &&
      (obj.filter_value = message.filterValue);
    return obj;
  },
};

function createBaseSetDefaultMarketFilters(): SetDefaultMarketFilters {
  return { interactionContext: '', sport: 0, filters: {} };
}

export const SetDefaultMarketFilters = {
  fromJSON(object: any): SetDefaultMarketFilters {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
      filters: isObject(object.filters)
        ? Object.entries(object.filters).reduce<{ [key: string]: string }>(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {}
          )
        : {},
    };
  },

  toJSON(message: SetDefaultMarketFilters): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    obj.filters = {};
    if (message.filters) {
      Object.entries(message.filters).forEach(([k, v]) => {
        obj.filters[k] = v;
      });
    }
    return obj;
  },
};

function createBaseSetDefaultMarketFilters_FiltersEntry(): SetDefaultMarketFilters_FiltersEntry {
  return { key: '', value: '' };
}

export const SetDefaultMarketFilters_FiltersEntry = {
  fromJSON(object: any): SetDefaultMarketFilters_FiltersEntry {
    return {
      key: isSet(object.key) ? String(object.key) : '',
      value: isSet(object.value) ? String(object.value) : '',
    };
  },

  toJSON(message: SetDefaultMarketFilters_FiltersEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },
};

function createBaseClearDefaultMarketFilters(): ClearDefaultMarketFilters {
  return { interactionContext: '', sport: 0 };
}

export const ClearDefaultMarketFilters = {
  fromJSON(object: any): ClearDefaultMarketFilters {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClearDefaultMarketFilters): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseConfirmPurchaseForm(): ConfirmPurchaseForm {
  return {
    interactionContext: '',
    ethAmount: 0,
    eurAmount: 0,
    fiatPayment: false,
    sport: 0,
  };
}

export const ConfirmPurchaseForm = {
  fromJSON(object: any): ConfirmPurchaseForm {
    return {
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      ethAmount: isSet(object.eth_amount) ? Number(object.eth_amount) : 0,
      eurAmount: isSet(object.eur_amount) ? Number(object.eur_amount) : 0,
      fiatPayment: isSet(object.fiat_payment)
        ? Boolean(object.fiat_payment)
        : false,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ConfirmPurchaseForm): unknown {
    const obj: any = {};
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.ethAmount !== undefined && (obj.eth_amount = message.ethAmount);
    message.eurAmount !== undefined && (obj.eur_amount = message.eurAmount);
    message.fiatPayment !== undefined &&
      (obj.fiat_payment = message.fiatPayment);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickAnnouncementLink(): ClickAnnouncementLink {
  return { announcementId: '', announcementTitle: '', linkHref: '' };
}

export const ClickAnnouncementLink = {
  fromJSON(object: any): ClickAnnouncementLink {
    return {
      announcementId: isSet(object.announcement_id)
        ? String(object.announcement_id)
        : '',
      announcementTitle: isSet(object.announcement_title)
        ? String(object.announcement_title)
        : '',
      linkHref: isSet(object.link_href) ? String(object.link_href) : '',
    };
  },

  toJSON(message: ClickAnnouncementLink): unknown {
    const obj: any = {};
    message.announcementId !== undefined &&
      (obj.announcement_id = message.announcementId);
    message.announcementTitle !== undefined &&
      (obj.announcement_title = message.announcementTitle);
    message.linkHref !== undefined && (obj.link_href = message.linkHref);
    return obj;
  },
};

function createBaseCreateSavedSearch(): CreateSavedSearch {
  return { name: '', filters: {}, interactionContext: '', sport: 0 };
}

export const CreateSavedSearch = {
  fromJSON(object: any): CreateSavedSearch {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      filters: isObject(object.filters)
        ? Object.entries(object.filters).reduce<{ [key: string]: string }>(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {}
          )
        : {},
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: CreateSavedSearch): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    obj.filters = {};
    if (message.filters) {
      Object.entries(message.filters).forEach(([k, v]) => {
        obj.filters[k] = v;
      });
    }
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseCreateSavedSearch_FiltersEntry(): CreateSavedSearch_FiltersEntry {
  return { key: '', value: '' };
}

export const CreateSavedSearch_FiltersEntry = {
  fromJSON(object: any): CreateSavedSearch_FiltersEntry {
    return {
      key: isSet(object.key) ? String(object.key) : '',
      value: isSet(object.value) ? String(object.value) : '',
    };
  },

  toJSON(message: CreateSavedSearch_FiltersEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },
};

function createBaseSelectSavedSearch(): SelectSavedSearch {
  return { name: '', filters: {}, interactionContext: '', sport: 0 };
}

export const SelectSavedSearch = {
  fromJSON(object: any): SelectSavedSearch {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      filters: isObject(object.filters)
        ? Object.entries(object.filters).reduce<{ [key: string]: string }>(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {}
          )
        : {},
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: SelectSavedSearch): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    obj.filters = {};
    if (message.filters) {
      Object.entries(message.filters).forEach(([k, v]) => {
        obj.filters[k] = v;
      });
    }
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseSelectSavedSearch_FiltersEntry(): SelectSavedSearch_FiltersEntry {
  return { key: '', value: '' };
}

export const SelectSavedSearch_FiltersEntry = {
  fromJSON(object: any): SelectSavedSearch_FiltersEntry {
    return {
      key: isSet(object.key) ? String(object.key) : '',
      value: isSet(object.value) ? String(object.value) : '',
    };
  },

  toJSON(message: SelectSavedSearch_FiltersEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },
};

function createBaseDeleteSavedSearch(): DeleteSavedSearch {
  return { name: '', filters: {}, interactionContext: '', sport: 0 };
}

export const DeleteSavedSearch = {
  fromJSON(object: any): DeleteSavedSearch {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      filters: isObject(object.filters)
        ? Object.entries(object.filters).reduce<{ [key: string]: string }>(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {}
          )
        : {},
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: DeleteSavedSearch): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    obj.filters = {};
    if (message.filters) {
      Object.entries(message.filters).forEach(([k, v]) => {
        obj.filters[k] = v;
      });
    }
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseDeleteSavedSearch_FiltersEntry(): DeleteSavedSearch_FiltersEntry {
  return { key: '', value: '' };
}

export const DeleteSavedSearch_FiltersEntry = {
  fromJSON(object: any): DeleteSavedSearch_FiltersEntry {
    return {
      key: isSet(object.key) ? String(object.key) : '',
      value: isSet(object.value) ? String(object.value) : '',
    };
  },

  toJSON(message: DeleteSavedSearch_FiltersEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },
};

function createBaseSwitchStackedView(): SwitchStackedView {
  return { stacked: false, sport: 0 };
}

export const SwitchStackedView = {
  fromJSON(object: any): SwitchStackedView {
    return {
      stacked: isSet(object.stacked) ? Boolean(object.stacked) : false,
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: SwitchStackedView): unknown {
    const obj: any = {};
    message.stacked !== undefined && (obj.stacked = message.stacked);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickStack(): ClickStack {
  return {
    playerSlug: '',
    scarcity: '',
    season: 0,
    teamSlug: '',
    interactionContext: '',
    sport: 0,
  };
}

export const ClickStack = {
  fromJSON(object: any): ClickStack {
    return {
      playerSlug: isSet(object.player_slug) ? String(object.player_slug) : '',
      scarcity: isSet(object.scarcity) ? String(object.scarcity) : '',
      season: isSet(object.season) ? Number(object.season) : 0,
      teamSlug: isSet(object.team_slug) ? String(object.team_slug) : '',
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickStack): unknown {
    const obj: any = {};
    message.playerSlug !== undefined && (obj.player_slug = message.playerSlug);
    message.scarcity !== undefined && (obj.scarcity = message.scarcity);
    message.season !== undefined && (obj.season = Math.round(message.season));
    message.teamSlug !== undefined && (obj.team_slug = message.teamSlug);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseClickMarketTrend(): ClickMarketTrend {
  return {
    timeframe: '',
    trend: '',
    slug: '',
    interactionContext: '',
    sport: 0,
  };
}

export const ClickMarketTrend = {
  fromJSON(object: any): ClickMarketTrend {
    return {
      timeframe: isSet(object.timeframe) ? String(object.timeframe) : '',
      trend: isSet(object.trend) ? String(object.trend) : '',
      slug: isSet(object.slug) ? String(object.slug) : '',
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: ClickMarketTrend): unknown {
    const obj: any = {};
    message.timeframe !== undefined && (obj.timeframe = message.timeframe);
    message.trend !== undefined && (obj.trend = message.trend);
    message.slug !== undefined && (obj.slug = message.slug);
    message.interactionContext !== undefined &&
      (obj.interaction_context = message.interactionContext);
    message.sport !== undefined && (obj.sport = sportToJSON(message.sport));
    return obj;
  },
};

function createBaseLoadMarketTrends(): LoadMarketTrends {
  return {
    timeframe: '',
    sales: [],
    onTheRise: [],
    volumes: [],
    interactionContext: '',
    sport: 0,
  };
}

export const LoadMarketTrends = {
  fromJSON(object: any): LoadMarketTrends {
    return {
      timeframe: isSet(object.timeframe) ? String(object.timeframe) : '',
      sales: Array.isArray(object?.sales)
        ? object.sales.map((e: any) => String(e))
        : [],
      onTheRise: Array.isArray(object?.on_the_rise)
        ? object.on_the_rise.map((e: any) => String(e))
        : [],
      volumes: Array.isArray(object?.volumes)
        ? object.volumes.map((e: any) => String(e))
        : [],
      interactionContext: isSet(object.interaction_context)
        ? String(object.interaction_context)
        : '',
      sport: isSet(object.sport) ? sportFromJSON(object.sport) : 0,
    };
  },

  toJSON(message: LoadMarketTrends): unknown {
    const obj: any = {};
    message.timeframe !== undefined && (obj.timeframe = message.timeframe);
    if (message.sales) {
      obj.sales = message.sales.map(e => e);
    } else {
      obj.sales = [];
    }
    if (message.onTheRise) {
      obj.on_the_rise = message.onTheRise.map(e => e);
    } else {
      obj.on_the_rise = [];
    }
    if (message.volumes) {
      obj.volumes = message.volumes.map(e => e);
    } else {
      obj.volumes = [];
    }
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

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
