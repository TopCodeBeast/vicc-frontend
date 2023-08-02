import qs from 'qs';
import { matchPath } from 'react-router-dom';

import { Sport as SportType } from '__generated__/globalTypes';
import { SEARCH_PARAMS } from '@core/components/search/InstantSearch/types';
import { Sport } from '@core/protos/events/shared/events';

import {
  ACTIVITY_NEWS_SHOW,
  EPL_LANDING,
  FOOTBALL_BUNDLED_AUCTION,
  FOOTBALL_CARD_SHOW,
  FOOTBALL_CLUB_SHOW_WILDCARD,
  FOOTBALL_COMPETITION_DETAILS,
  FOOTBALL_COMPOSE_TEAM,
  FOOTBALL_COUNTRY_SHOW,
  FOOTBALL_HOME,
  FOOTBALL_LEAGUE_SHOW_WILDCARD,
  FOOTBALL_LOBBY_STARTER_BUNDLES,
  FOOTBALL_LOBBY_WILDCARD,
  FOOTBALL_MARKET,
  FOOTBALL_NEW_SIGNINGS,
  FOOTBALL_ONBOARDING,
  FOOTBALL_ONBOARDING_WILDCARD,
  FOOTBALL_PLAYER_SHOW_WILDCARD,
  FOOTBALL_PRIVATE_LEAGUES_WILDCARD,
  FOOTBALL_TRANSFER_MARKET,
  FOOTBALL_TRANSFER_MARKET_STACK_SHOW,
  FOOTBALL_USER_CARD_COLLECTION,
  FOOTBALL_USER_GALLERY_CLUB_HONORS,
  FOOTBALL_USER_GALLERY_WILDCARD,
  INVITE,
  LANDING,
  MLB_CARD_SHOW,
  MLB_COMPETITION_DETAILS,
  MLB_COMPOSE_TEAM_WILDCARD,
  MLB_FAVORITES,
  MLB_HOME,
  MLB_LOBBY_WILDCARD,
  MLB_ONBOARDING,
  MLB_PLAYER_WILDCARD,
  MLB_PRIMARY_MARKET,
  MLB_SECONDARY_MARKET,
  MLB_USER_GALLERY_CARDS,
  MLB_WILDCARD,
  MY_GALLERY_WILDCARD,
  MY_SORARE_NEW,
  MY_SORARE_OFFERS_RECEIVED,
  MY_SORARE_WILDCARD,
  NBA_CARD_SHOW,
  NBA_COMPETITION_DETAILS,
  NBA_COMPOSE_TEAM_WILDCARD,
  NBA_FAVORITES,
  NBA_HOME,
  NBA_LOBBY_WILDCARD,
  NBA_ONBOARDING,
  NBA_PLAYER_WILDCARD,
  NBA_PRIMARY_MARKET,
  NBA_SECONDARY_MARKET,
  NBA_USER_GALLERY_CARDS,
  NBA_WILDCARD,
  TOKEN_AUCTION,
} from '../constants/routes';
import { catchAll } from './routing';

export type InteractionContext =
  | 'competition_details'
  | 'landing'
  | 'landing_nba'
  | 'landing_epl'
  | 'homepage'
  | 'my_sorare'
  | 'my_sorare_new'
  | 'my_sorare_offers_received'
  | 'my_club'
  | 'user_gallery'
  | 'user_gallery_collections'
  | 'primary_market'
  | 'secondary_market'
  | 'featured_market'
  | 'player_page'
  | 'card_page'
  | 'bundled_auction_page'
  | 'club_page'
  | 'country_page'
  | 'league_page'
  | 'onboarding'
  | 'compose_team'
  | 'lobby'
  | 'private_league_details'
  | 'club_honors'
  | 'club_shop'
  | string;

export const getPathname = (): InteractionContext => {
  const { pathname, search } = window.location;
  if (matchPath(LANDING, pathname)) {
    return 'landing';
  }
  if (matchPath(EPL_LANDING, pathname)) {
    return 'landing_epl';
  }
  if (
    matchPath(FOOTBALL_HOME, pathname) ||
    matchPath(NBA_HOME, pathname) ||
    matchPath(MLB_HOME, pathname)
  ) {
    return 'homepage';
  }
  if (matchPath(MY_SORARE_NEW, pathname)) {
    return 'my_sorare_new';
  }
  if (matchPath(MY_SORARE_OFFERS_RECEIVED, pathname)) {
    return 'my_sorare_offers_received';
  }
  if (matchPath(MY_SORARE_WILDCARD, pathname)) {
    return 'my_sorare';
  }
  if (matchPath(MY_GALLERY_WILDCARD, pathname)) {
    return 'my_club';
  }
  if (matchPath(FOOTBALL_USER_CARD_COLLECTION, pathname)) {
    return 'user_gallery_collections';
  }
  if (
    matchPath(FOOTBALL_USER_GALLERY_WILDCARD, pathname) ||
    matchPath(MLB_USER_GALLERY_CARDS, pathname) ||
    matchPath(NBA_USER_GALLERY_CARDS, pathname)
  ) {
    return 'user_gallery';
  }
  if (matchPath(FOOTBALL_MARKET, pathname)) {
    return 'market_home';
  }
  if (
    matchPath(FOOTBALL_NEW_SIGNINGS, pathname) ||
    matchPath(MLB_PRIMARY_MARKET, pathname) ||
    matchPath(NBA_PRIMARY_MARKET, pathname)
  ) {
    return 'primary_market';
  }
  if (
    matchPath(FOOTBALL_TRANSFER_MARKET, pathname) ||
    matchPath(MLB_SECONDARY_MARKET, pathname) ||
    matchPath(NBA_SECONDARY_MARKET, pathname)
  ) {
    const queryString = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    return queryString[SEARCH_PARAMS.UNSTACKED]
      ? 'secondary_market_unstacked'
      : 'secondary_market';
  }
  if (matchPath(FOOTBALL_TRANSFER_MARKET_STACK_SHOW, pathname)) {
    return 'secondary_market_stack';
  }
  if (
    matchPath(FOOTBALL_PLAYER_SHOW_WILDCARD, pathname) ||
    matchPath(MLB_PLAYER_WILDCARD, pathname) ||
    matchPath(NBA_PLAYER_WILDCARD, pathname)
  ) {
    return 'player_page';
  }
  if (
    matchPath(FOOTBALL_CARD_SHOW, pathname) ||
    matchPath(MLB_CARD_SHOW, pathname) ||
    matchPath(NBA_CARD_SHOW, pathname)
  ) {
    return 'card_page';
  }
  if (matchPath(FOOTBALL_CLUB_SHOW_WILDCARD, pathname)) {
    return 'club_page';
  }
  if (matchPath(FOOTBALL_COUNTRY_SHOW, pathname)) {
    return 'country_page';
  }
  if (matchPath(FOOTBALL_LEAGUE_SHOW_WILDCARD, pathname)) {
    return 'league_page';
  }
  if (
    matchPath(FOOTBALL_ONBOARDING_WILDCARD, pathname) ||
    matchPath(MLB_ONBOARDING, pathname) ||
    matchPath(NBA_ONBOARDING, pathname)
  ) {
    return 'onboarding';
  }
  if (
    matchPath(FOOTBALL_BUNDLED_AUCTION, pathname) ||
    matchPath(TOKEN_AUCTION, pathname)
  ) {
    return 'bundled_auction_page';
  }
  if (matchPath(FOOTBALL_LOBBY_STARTER_BUNDLES, pathname)) {
    return 'starter_bundle_dialog';
  }
  if (
    matchPath(FOOTBALL_LOBBY_WILDCARD, pathname) ||
    matchPath(MLB_LOBBY_WILDCARD, pathname) ||
    matchPath(NBA_LOBBY_WILDCARD, pathname)
  ) {
    return 'lobby';
  }
  if (
    matchPath(FOOTBALL_COMPOSE_TEAM, pathname) ||
    matchPath(MLB_COMPOSE_TEAM_WILDCARD, pathname) ||
    matchPath(NBA_COMPOSE_TEAM_WILDCARD, pathname)
  ) {
    return 'compose_team';
  }
  if (
    matchPath(FOOTBALL_COMPETITION_DETAILS, pathname) ||
    matchPath(NBA_COMPETITION_DETAILS, pathname) ||
    matchPath(MLB_COMPETITION_DETAILS, pathname)
  ) {
    return 'competition_details';
  }
  if (matchPath(FOOTBALL_PRIVATE_LEAGUES_WILDCARD, pathname)) {
    return 'private_league_details';
  }
  if (matchPath(FOOTBALL_CLUB_SHOW_WILDCARD, pathname)) {
    return 'club_shop';
  }
  if (matchPath(FOOTBALL_USER_GALLERY_CLUB_HONORS, pathname)) {
    return 'club_honors';
  }
  if (
    matchPath(catchAll(MLB_FAVORITES), pathname) ||
    matchPath(catchAll(NBA_FAVORITES), pathname)
  ) {
    return 'my_favorites';
  }
  return pathname;
};

export const getInteractionContext = (subpath?: string): string => {
  return `${getPathname()}${subpath ? `_${subpath}` : ''}`;
};

export const getSport = (): Sport => {
  const { pathname } = window.location;
  if (matchPath(NBA_WILDCARD, pathname)) {
    return Sport.NBA;
  }
  if (matchPath(MLB_WILDCARD, pathname)) {
    return Sport.BASEBALL;
  }
  return Sport.FOOTBALL;
};

// This is a helper function used to define what to pass to Segments' .page() function
// which can then be used to explicitly map to an AdWords Page Load conversion
export const getPageName = (pathname: string): string | undefined => {
  if (
    matchPath(FOOTBALL_ONBOARDING_WILDCARD, pathname) ||
    matchPath(FOOTBALL_ONBOARDING, pathname)
  ) {
    return 'Onboarding';
  }
  if (matchPath(INVITE, pathname)) {
    return 'Referrals';
  }
  if (matchPath(ACTIVITY_NEWS_SHOW, pathname)) {
    return 'News';
  }
  return undefined;
};

export const socialShareEventName = {
  SHARE_CARD: 'Share Card',
  SHARE_LINEUP: 'Share Lineup',
  SHARE_USER_GROUP: 'Share User Group',
  SHARE_SQUAD: 'Share Squad',
  SHARE_COLLECTION: 'Share Collection',
  SHARE_REFERRAL: 'Share Referral Link',
  SHARE_AUCTION_WON: 'Share Auction Won',
} as const;

export type SocialShareEventName =
  (typeof socialShareEventName)[keyof typeof socialShareEventName];

export const socialShareEventContext = {
  COMPETITION_DETAILS: 'Competition Details',
  LEADERBOARD: 'Leaderboard',
  MY_TEAMS: 'My Teams',
  COLLECTION: 'Collection Page',
  USER_GROUP_DETAILS: 'User Group Details',
  USER_GROUP_CONGRATS: 'User Group Congratulations Dialog',
  USER_GROUP_INVITE_FRIENDS: 'User Group Invite Friends',
  REFERRAL_PROGRAM: 'referral_program',
  HERO_HOMEPAGE: 'hero_homepage',
  ONBOARDING: 'onboarding',
  SQUAD: 'squad',
  HOME_DASHBOARD: 'Home Dashboard',
  AUCTION_WON: 'Auction Won Dialog',
  CARD_PAGE: 'Card Page',
} as const;

const FOOTBALL = 'football';

export type SocialShareEventContext =
  (typeof socialShareEventContext)[keyof typeof socialShareEventContext];

export const shareByCopyLinkEvent = (
  name: SocialShareEventName,
  context: SocialShareEventContext,
  sport?: SportType
) => ({
  name,
  properties: {
    sport: sport ?? FOOTBALL,
    target: 'copy_link',
    context,
  },
});

export const shareByImageEvent = (
  name: SocialShareEventName,
  context: SocialShareEventContext,
  sport?: SportType
) => ({
  name,
  properties: {
    sport: sport ?? FOOTBALL,
    target: 'image',
    context,
  },
});

export const shareOnTwitterEvent = (
  name: SocialShareEventName,
  context: SocialShareEventContext,
  sport?: SportType
) => ({
  name,
  properties: {
    sport: sport ?? FOOTBALL,
    target: 'twitter',
    context,
  },
});

export const shareOnFacebookEvent = (
  name: SocialShareEventName,
  context: SocialShareEventContext,
  sport?: SportType
) => ({
  name,
  properties: {
    sport: sport ?? FOOTBALL,
    target: 'facebook',
    context,
  },
});

export const shareOnWhatsappEvent = (
  name: SocialShareEventName,
  context: SocialShareEventContext,
  sport?: SportType
) => ({
  name,
  properties: {
    sport: sport ?? FOOTBALL,
    target: 'whatsapp',
    context,
  },
});

export const shareWithShareSheetEvent = (
  name: SocialShareEventName,
  context: SocialShareEventContext,
  sport?: SportType
) => ({
  name,
  properties: {
    sport: sport ?? FOOTBALL,
    target: 'share_sheet',
    context,
  },
});
