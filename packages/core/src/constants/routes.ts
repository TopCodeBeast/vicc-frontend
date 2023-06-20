import qs from 'qs';
import { generatePath, matchPath } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';

import { API_ROOT } from '../config';

export const FOOTBALL_PATH = '/football';
export const MLB_PATH = '/mlb';
export const NBA_PATH = '/nba';

export const AFFILIATE_PROGRAM = '/affiliate-program';

export const MY_SORARE_HOME = '/my-sorare';
export const MY_SORARE_WILDCARD = `${MY_SORARE_HOME}/*`;
export const MY_SORARE_NEW = `${MY_SORARE_HOME}/new`;
export const MY_SORARE_AUCTIONS = `${MY_SORARE_HOME}/auctions`;
export const MY_SORARE_SALES = `${MY_SORARE_HOME}/sales`;
export const MY_SORARE_PURCHASES = `${MY_SORARE_HOME}/purchases`;
export const MY_SORARE_OFFERS_RECEIVED = `${MY_SORARE_HOME}/offers-received`;
export const MY_SORARE_MY_OFFER_RECEIVED = `${MY_SORARE_OFFERS_RECEIVED}/:id`;
export const MY_SORARE_OFFERS_SENT = `${MY_SORARE_HOME}/offers-sent`;
export const MY_SORARE_MY_OFFER_SENT = `${MY_SORARE_OFFERS_SENT}/:id`;
export const MY_SORARE_FOLLOWS = `${MY_SORARE_HOME}/follows`;
export const MY_SORARE_PLAYERS_NOTIFICATIONS = `${MY_SORARE_HOME}/players-notifications`;
export const MY_SORARE_TRANSACTIONS = `${MY_SORARE_HOME}/transactions`;

export const SETTINGS_WILDCARD = '/settings/*';
export const SETTINGS_HOME = '/settings';
export const SETTINGS_ACCOUNT = '/settings/account';
export const SETTINGS_NOTIFICATIONS = '/settings/notifications';
export const SETTINGS_SECURITY = '/settings/security';
export const SETTINGS_PAYMENT = '/settings/payment';

export const MY_AUCTIONS = '/my-auctions';
export const BID = '/bid';

export const LEGACY_CARD_SHOW = `/cards/:slug`;
export const LEGACY_PLAYER_SHOW = `/players/:slug`;
export const LEGACY_PLAYER_SHOW_CARDS = `/players/:slug/cards`;
export const LEGACY_USER_GALLERY = '/gallery/:slug';
export const LEGACY_BUNDLE_PAGE = '/starter-packs/:id';
export const LEGACY_LEAGUE_SHOW_CARDS = '/leagues/:slug/cards';
export const LEGACY_COUNTRY_SHOW = `/countries/:slug`;
export const LEGACY_BUNDLED_AUCTION = `/bundled-auctions/:id`;

export const LOCKEDON = '/lockedon';

export const FOOTBALL_CARD_SHOW = `${FOOTBALL_PATH}${LEGACY_CARD_SHOW}`;

export const FOOTBALL_CLUB_SHOW = `${FOOTBALL_PATH}/clubs/:slug`;
export const FOOTBALL_CLUB_SHOW_WILDCARD = `${FOOTBALL_CLUB_SHOW}/*`;
export const FOOTBALL_CLUB_SHOW_SQUAD = `${FOOTBALL_CLUB_SHOW}/squad`;
export const FOOTBALL_CLUB_SHOW_CARDS = `${FOOTBALL_CLUB_SHOW}/cards`;

export const FOOTBALL_LEAGUE_SHOW = `${FOOTBALL_PATH}/leagues/:slug`;
export const FOOTBALL_LEAGUE_SHOW_WILDCARD = `${FOOTBALL_LEAGUE_SHOW}/*`;
export const FOOTBALL_LEAGUE_SHOW_HOME = `${FOOTBALL_LEAGUE_SHOW}/home`;
export const FOOTBALL_LEAGUE_SHOW_CARDS = `${FOOTBALL_LEAGUE_SHOW}/cards`;

export const FOOTBALL_COUNTRY_SHOW = `${FOOTBALL_PATH}/countries/:slug`;
export const FOOTBALL_CUSTOM_DECK_SHOW = `${FOOTBALL_PATH}/squads/:slug`;
export const FOOTBALL_CUSTOM_DECK_EDIT = `${FOOTBALL_PATH}/squads/:name/edit`;
export const FAQ = '/faq';
export const PRESS = '/press';
export const PASSWORD_FORGOTTEN = '/password-forgotten';

export const FOOTBALL_PLAYER_SHOW = `${FOOTBALL_PATH}${LEGACY_PLAYER_SHOW}`;
export const FOOTBALL_PLAYER_SHOW_WILDCARD = `${FOOTBALL_PLAYER_SHOW}/*`;
export const FOOTBALL_PLAYER_SHOW_DESCRIPTION = `${FOOTBALL_PLAYER_SHOW}/description`;
export const FOOTBALL_PLAYER_SHOW_CARDS = `${FOOTBALL_PLAYER_SHOW}/cards`;

const GALLERY_OVERVIEW_RELATIVE = 'overview';
const GALLERY_CARDS_RELATIVE = 'cards';
const GALLERY_AWARDS_RELATIVE = 'awards';
const GALLERY_COLLECTIONS_RELATIVE = 'collections';
const GALLERY_NETWORK_RELATIVE = 'network';

export const MY_GALLERY_WILDCARD = `${FOOTBALL_PATH}/my-gallery/*`; // deprecated. Only kept for legacy links

export const FOOTBALL_USER_GALLERY = `${FOOTBALL_PATH}/gallery/:slug`;
export const FOOTBALL_USER_GALLERY_WILDCARD = `${FOOTBALL_USER_GALLERY}/*`;
export const FOOTBALL_USER_GALLERY_OVERVIEW = `${FOOTBALL_USER_GALLERY}/${GALLERY_OVERVIEW_RELATIVE}`;
export const FOOTBALL_USER_GALLERY_CARDS = `${FOOTBALL_USER_GALLERY}/${GALLERY_CARDS_RELATIVE}`;
export const FOOTBALL_USER_GALLERY_AWARDS = `${FOOTBALL_USER_GALLERY}/${GALLERY_AWARDS_RELATIVE}`;
export const FOOTBALL_USER_GALLERY_CLUB_HONORS = `${FOOTBALL_USER_GALLERY}/club-honors`;
export const FOOTBALL_USER_GALLERY_CUSTOM_DECKS = `${FOOTBALL_USER_GALLERY}/customDecks`; // deprecated. Only kept for legacy links
export const FOOTBALL_USER_GALLERY_SQUADS = `${FOOTBALL_USER_GALLERY}/squads`;
export const FOOTBALL_USER_GALLERY_NETWORK = `${FOOTBALL_USER_GALLERY}/${GALLERY_NETWORK_RELATIVE}`;
export const FOOTBALL_USER_GALLERY_CARD_COLLECTIONS = `${FOOTBALL_USER_GALLERY}/${GALLERY_COLLECTIONS_RELATIVE}`;
export const FOOTBALL_USER_CARD_COLLECTION = `${FOOTBALL_PATH}/collection/:slug/:collectionSlug`;
export const FOOTBALL_USER_CARD_COLLECTION_CARDS = `${FOOTBALL_USER_CARD_COLLECTION}/cards`;
export const FOOTBALL_USER_CARD_COLLECTION_LEADERBOARD = `${FOOTBALL_USER_CARD_COLLECTION}/leaderboard`;
export const FOOTBALL_NO_CARD_ENTRY = `${FOOTBALL_PATH}/no-card-route`;
export const FOOTBALL_NO_CARD_ROUTE_REQUEST = `${FOOTBALL_NO_CARD_ENTRY}/:so5FixtureId`;
export const FOOTBALL_NO_CARD_ROUTE_ACCEPT = `${FOOTBALL_NO_CARD_ENTRY}/:so5FixtureId/:so5LineupId/accept`;
export const FOOTBALL_NO_CARD_ROUTE_CANCEL = `${FOOTBALL_NO_CARD_ENTRY}/:so5FixtureId/:so5LineupId/cancel`;
export const FOOTBALL_NO_CARD_ROUTE_CONFIRM = `${FOOTBALL_NO_CARD_ENTRY}/:so5FixtureId/:so5LineupId/confirm`;
export const FOOTBALL_NO_CARD_ROUTE_LEADERBOARDS = `${FOOTBALL_NO_CARD_ENTRY}/:so5FixtureId/:so5LineupId/leaderboards`;

export const LANDING = '/';
export const TERMS = '/terms-and-conditions';
export const PRIVACY_POLICY = '/privacy-policy';
export const COOKIE_POLICY = '/cookie-policy';
export const GAME_RULES = '/game-rules';
export const LINK = '/link';
export const CONFIRM_EMAIL = '/confirm-email';
export const CONFIRM_DEVICE = '/confirm-device';
export const VERIFY_STRIPE_ACCOUNT = '/verify-identity/:id';
export const DEBUG_DEVICE = '/debug-device';
export const FOOTBALL_COMPOSE_TEAM = `/football/compose-team/:so5LeaderboardSlug`;
export const FOOTBALL_COMPOSE_TEAM_DRAFT = `${FOOTBALL_PATH}/compose/draft/:slug`;
export const FOOTBALL_COMPOSE_TEAM_LINEUP = `${FOOTBALL_PATH}/compose-team/:so5LeaderboardSlug/:so5LineupId`;
export const FOOTBALL_BUNDLED_AUCTION = `${FOOTBALL_PATH}${LEGACY_BUNDLED_AUCTION}`;
export const LEGACY_TOKEN_AUCTION = `/auctions/:id`;
export const TOKEN_AUCTION = `${FOOTBALL_PATH}/auctions/:id`;
export const REWARDS = `${FOOTBALL_PATH}/rewards/:so5LeagueSlug/:rarity/:quality`;
export const ACTIVITY_WILDCARD = '/activity/*';
export const ACTIVITY = '/activity';
export const ACTIVITY_NEWS = '/activity/news';
export const ACTIVITY_NEWS_SHOW = `${ACTIVITY_NEWS}/:id`;
export const INVITE = '/invite';
export const INVITE_WILDCARD = `${INVITE}/*`;
export const INVITE_USER_GROUP = `${INVITE}/pl/:joinSecret`;
export const ACCEPT_INVITATION = '/accept-invitation';
export const REFERRER_LINK = '/r/:userSlug';
export const MOBILE_SIGN_UP = '/mobile-sign-up';
export const OAUTH_AUTORIZE = '/oauth/authorize';
export const PROMO_SIGNUP = '/promo/signup/:code';
export const PROMO_CLAIM = '/promo/claim/:code';
export const FOOTBALL_CLUB_SHOP = `${FOOTBALL_PATH}/club-shop`;
export const FOOTBALL_CLUB_SHOP_WILDCARD = `${FOOTBALL_PATH}/club-shop/*`;
export const FOOTBALL_CLUB_SHOP_SKINS = `${FOOTBALL_PATH}/club-shop/skins`;
export const FOOTBALL_CLUB_SHOP_BOOSTS = `${FOOTBALL_PATH}/club-shop/boosts`;
export const FOOTBALL_CLUB_SHOP_MERCH = `${FOOTBALL_PATH}/club-shop/merch`;
export const FOOTBALL_CLUB_SHOP_INVENTORY = `${FOOTBALL_PATH}/club-shop/inventory`;
export const FOOTBALL_LINEUP_SHARING = `${FOOTBALL_PATH}/lineups/:id`;

export const FOOTBALL_ONBOARDING = `${FOOTBALL_PATH}/onboarding`;
export const FOOTBALL_ONBOARDING_WILDCARD = `${FOOTBALL_ONBOARDING}/*`;
export const EPL_DRAFT = `${FOOTBALL_ONBOARDING}?league=premier_league`;
export const SERIE_A_DRAFT = `${FOOTBALL_ONBOARDING}?league=serie_a`;
export const MLS_DRAFT = `${FOOTBALL_ONBOARDING}?league=mls`;
export const BUNDESLIGA_DRAFT = `${FOOTBALL_ONBOARDING}?league=bundesliga`;
export const LALIGA_DRAFT = `${FOOTBALL_ONBOARDING}?league=laliga_santander`;
export const FOOTBALL_PICK_LEAGUE = `${FOOTBALL_PATH}/pick-league`;
export const FOOTBALL_SCARCITIES = `${FOOTBALL_PATH}/scarcities`;

export const FOOTBALL_MARKET = `${FOOTBALL_PATH}/market/`;
export const FOOTBALL_NEW_SIGNINGS = `${FOOTBALL_MARKET}new-signings`;
export const FOOTBALL_STARTER_BUNDLES = `${FOOTBALL_MARKET}starter-packs`;
export const FOOTBALL_TRANSFER_MARKET = `${FOOTBALL_MARKET}transfers`;
export const FOOTBALL_TRANSFER_MARKET_STACK_SHOW = `${FOOTBALL_TRANSFER_MARKET}/:player_slug/:rarity`;

export const CAREERS = '/careers';

export const HOME = FOOTBALL_MARKET;

export const RENDERING_CARD_FACTORY_CARD_SAMPLE_PICTURE = `/rendering/card-factory/card-sample-pictures/:id/:serialNumber`;
export const RENDERING_CARD_FACTORY_CARD_PICTURE = `/rendering/card-factory/cards/:id`;
export const RENDERING_SO5_LINEUP = '/rendering/so5-lineups/:id';
export const RENDERING_CARD_COLLECTION = `/rendering/card-collections/:slug/:userSlug`;
export const RENDERING_AUCTION = `/rendering/auction/:id`;

export const FOOTBALL_COMPETITION_DETAILS_WILDCARD = `${FOOTBALL_PATH}/competition-details/:competition/*`;
export const FOOTBALL_COMPETITION_DETAILS = `${FOOTBALL_PATH}/competition-details/:competition/:tab`;
export const FOOTBALL_COMPETITION_DETAILS_TEAM = `${FOOTBALL_PATH}/competition-details/:competition/team`;
export const FOOTBALL_COMPETITION_DETAILS_MATCHES = `${FOOTBALL_PATH}/competition-details/:competition/matches`;
export const FOOTBALL_COMPETITION_DETAILS_REWARDS = `${FOOTBALL_PATH}/competition-details/:competition/rewards`;
export const FOOTBALL_COMPETITION_DETAILS_LEADERBOARD = `${FOOTBALL_PATH}/competition-details/:competition/leaderboards`;
export const FOOTBALL_COMPETITION_DETAILS_DETAILS = `${FOOTBALL_PATH}/competition-details/:competition/details`;

export const FOOTBALL_LOBBY_ROOT = `${FOOTBALL_PATH}/lobby`;
export const FOOTBALL_LOBBY = `${FOOTBALL_LOBBY_ROOT}/upcoming`;
export const FOOTBALL_LOBBY_UPCOMING_WILDCARD = `${FOOTBALL_LOBBY_ROOT}/upcoming/*`;
export const FOOTBALL_LOBBY_UPCOMING_SWAP = `${FOOTBALL_LOBBY_ROOT}/upcoming/swap/:leaderboardSlug`;
export const FOOTBALL_LOBBY_UPCOMING = `${FOOTBALL_LOBBY_ROOT}/upcoming/:tab`;
export const FOOTBALL_LOBBY_UPCOMING_CLUB_BANNER = `${FOOTBALL_LOBBY}/club`;
export const FOOTBALL_LOBBY_STARTER_BUNDLES = `${FOOTBALL_LOBBY_ROOT}/starter-bundles/:competition`;
export const FOOTBALL_LOBBY_PRIVATE_LEAGUES = `${FOOTBALL_LOBBY_ROOT}/private-leagues/*`;
export const FOOTBALL_LOBBY_PRIZE_POOL = `${FOOTBALL_LOBBY_ROOT}/prize-pool`;

export const FOOTBALL_PRIVATE_LEAGUES = `${FOOTBALL_PATH}/private-leagues`;
export const FOOTBALL_PRIVATE_LEAGUES_WILDCARD = `${FOOTBALL_PRIVATE_LEAGUES}/*`;
export const FOOTBALL_PRIVATE_LEAGUES_CREATE = `${FOOTBALL_PRIVATE_LEAGUES}/:step`;
export const FOOTBALL_PRIVATE_LEAGUES_CREATED = `${FOOTBALL_PRIVATE_LEAGUES}/:slug/:step`;
export const FOOTBALL_PRIVATE_LEAGUES_DETAILS = `${FOOTBALL_PRIVATE_LEAGUES}/:slug/details/:tab`;

export const FOOTBALL_VIDEOS = `${FOOTBALL_PATH}/videos/:slug`;
export const FOOTBALL_HOME = FOOTBALL_PATH;
export const FOOTBALL_WILDCARD = `${FOOTBALL_PATH}/*`;
export const FOOTBALL_MANAGER_HOME_CARDS = `${FOOTBALL_HOME}/cards`; // deprecated. Only kept for legacy links
export const FOOTBALL_MANAGER_HOME_CARD_COLLECTIONS = `${FOOTBALL_HOME}/collections`; // deprecated. Only kept for legacy links
export const FOOTBALL_MANAGER_HOME_SQUADS = `${FOOTBALL_HOME}/squads`; // deprecated. Only kept for legacy links
export const FOOTBALL_MANAGER_HOME_CLUB_HONORS = `${FOOTBALL_HOME}/club-honors`; // deprecated. Only kept for legacy links
export const FOOTBALL_MANAGER_HOME_NETWORK = `${FOOTBALL_HOME}/network`; // deprecated. Only kept for legacy links
export enum PrivateLeaguesStep {
  CREATE = 'create',
  CREATE_FORM = 'create-form',
  CONGRATS = 'congrats',
}
export enum PrivateLeaguesTab {
  LEADERBOARD = 'leaderboard',
  LEAGUE = 'league',
  MEMBERS = 'members',
}

export const FOOTBALL_LOBBY_LIVE_WILDCARD = `${FOOTBALL_PATH}/lobby/live/*`;
export const FOOTBALL_LOBBY_LIVE = `${FOOTBALL_PATH}/lobby/live/:tab`;
export const FOOTBALL_LOBBY_PAST_WILDCARD = `${FOOTBALL_PATH}/lobby/:slug/*`;
export const FOOTBALL_LOBBY_PAST = `${FOOTBALL_PATH}/lobby/:slug/:tab`;
export const FOOTBALL_LOBBY_WILDCARD = `${FOOTBALL_PATH}/lobby/*`;

export const FOOTBALL_DRAFT = `/football/draft/:slug`;

export const EPL_LANDING = `${FOOTBALL_PATH}/premier-league`;
export const EPL_LANDING_V2 = `${FOOTBALL_PATH}/epl`;
export const EPLV_LANDING_V2_SHORT = `${FOOTBALL_PATH}/pl`;
export const INVITE_EPL_USER_GROUP = `${EPL_LANDING}${INVITE_USER_GROUP}`;
export const SERIEA_LANDING = `${FOOTBALL_PATH}/serie-a`;
export const MLS_LANDING = `${FOOTBALL_PATH}/major-league-soccer`;
export const MLS_LANDING_SHORT = `${FOOTBALL_PATH}/mls`;
export const LALIGA_LANDING = `${FOOTBALL_PATH}/laliga-santander`;
export const BUNDESLIGA_LANDING = `${FOOTBALL_PATH}/bundesliga`;

export const FOOTBALL_STARTER_BUNDLE_PAGE = `${FOOTBALL_PATH}/starter-packs/:id`;
export const FOOTBALL_STARTER_BUNDLE_WILDCARD = `${FOOTBALL_PATH}/starter-packs/*`;

export const MLB_HOME = '/mlb/';
export const MLB_LOCKEDON = '/mlb/lockedon';
export const MLB_WILDCARD = `/mlb/*`;
export const MLB_LANDING = `/mlb/`;
export const MLB_MARKET = `${MLB_PATH}/market/`;
export const MLB_PRIMARY_MARKET = `${MLB_MARKET}primary`;
export const MLB_STARTER_BUNDLES = `${MLB_PATH}/market/starter-packs`;
export const MLB_SECONDARY_MARKET = `${MLB_MARKET}secondary`;
export const MLB_FAVORITES = `${MLB_MARKET}favorites`;
export const MLB_FAVORITES_CARDS = `${MLB_FAVORITES}/cards`;
export const MLB_FAVORITES_PLAYERS = `${MLB_FAVORITES}/players`;
export const MLB_SECONDARY_MARKET_STACK_SHOW = `${MLB_SECONDARY_MARKET}/:player_slug/:rarity`;
export const MLB_CARD_SHOW = `${MLB_PATH}/cards/:slug`;
const MLB_LEAGUES = `${MLB_HOME}leagues`;
export const MLB_LEAGUES_JOIN_SLUG = `${MLB_LEAGUES}/join/:leagueSlug`;
export const MLB_LEAGUES_SLUG = `${MLB_LEAGUES}/:leagueSlug`;
export const MLB_LEAGUES_SLUG_LEADERBOARDS = `${MLB_LEAGUES_SLUG}/leaderboards`;
export const MLB_LEAGUES_SLUG_MEMBERS = `${MLB_LEAGUES_SLUG}/members`;

export const MLB_SEATTLE_2023 = `${MLB_PATH}/seattle2023`;

export const MLB_PLAYER = `${MLB_PATH}${LEGACY_PLAYER_SHOW}`;
export const MLB_PLAYER_DESCRIPTION = `${MLB_PLAYER}/description`;
export const MLB_PLAYER_CARDS = `${MLB_PLAYER}/cards`;
export const MLB_PLAYER_WILDCARD = `${MLB_PLAYER}/*`;

export const MLB_TEAM = `${MLB_PATH}/teams/:slug`;
export const MLB_TEAM_PLAYERS = `${MLB_TEAM}/players`;
export const MLB_TEAM_CARDS = `${MLB_TEAM}/cards`;

export const MLB_ONBOARDING = '/mlb/onboarding';
export const MLB_DRAFT = '/mlb/draft';
export const MLB_COMPOSE_TEAM_WILDCARD = '/mlb/compose-team/*';
export const MLB_COMPOSE_TEAM = '/mlb/compose-team/:leaderboardSlug';
export const MLB_COMPOSE_TEAM_LINEUP = `${MLB_COMPOSE_TEAM}/:lineupId`;
export const MLB_HOW_TO_PLAY = `${MLB_PATH}/how-to-play`;
export const MLB_HOW_TO_PLAY_EXTERNAL = `https://mlbguide.sorare.com`;
export const MLB_USER_GALLERY = `${MLB_PATH}/gallery/:slug`;
export const MLB_USER_GALLERY_CARDS = `${MLB_USER_GALLERY}/${GALLERY_CARDS_RELATIVE}`;
export const MLB_USER_GALLERY_COLLECTIONS = `${MLB_USER_GALLERY}/${GALLERY_COLLECTIONS_RELATIVE}`;
export const MLB_USER_GALLERY_COLLECTIONS_SLUG = `${MLB_USER_GALLERY_COLLECTIONS}/:collectionSlug`;
export const MLB_LOBBY = `${MLB_PATH}/lobby`;
export const MLB_LOBBY_WILDCARD = `${MLB_LOBBY}/*`;
export const MLB_LOBBY_UPCOMING = `${MLB_LOBBY}/upcoming`;
export const MLB_LOBBY_UPCOMING_LEAGUE = `${MLB_LOBBY_UPCOMING}/league/:leagueSlug`;
export const MLB_LOBBY_UPCOMING_TOURNAMENTS = MLB_LOBBY_UPCOMING;
export const MLB_LOBBY_UPCOMING_MY_TEAMS = `${MLB_LOBBY_UPCOMING}/my-teams`;
export const MLB_LOBBY_UPCOMING_TRAINING_TEAMS = `${MLB_LOBBY_UPCOMING}/training-teams`;
export const MLB_LOBBY_UPCOMING_REWARDS = `${MLB_LOBBY_UPCOMING}/rewards`;

export const MLB_LOBBY_LIVE = `${MLB_LOBBY}/live`;
export const MLB_LOBBY_LIVE_MY_TEAMS = MLB_LOBBY_LIVE;
export const MLB_LOBBY_LIVE_LEAGUE = `${MLB_LOBBY_LIVE}/league/:leagueSlug`;
export const MLB_LOBBY_LIVE_TRAINING_TEAMS = `${MLB_LOBBY_LIVE}/training-teams`;
export const MLB_LOBBY_LIVE_LEADERBOARD = `${MLB_LOBBY_LIVE}/leaderboard`;
export const MLB_LOBBY_LIVE_REWARDS = `${MLB_LOBBY_LIVE}/rewards`;

export const MLB_LOBBY_PAST = `${MLB_LOBBY}/past`;
export const MLB_LOBBY_PAST_LEAGUE = `${MLB_LOBBY_PAST}/league/:leagueSlug`;
export const MLB_LOBBY_SLUG = `${MLB_LOBBY}/:slug`;
export const MLB_LOBBY_LEAGUE = `${MLB_LOBBY_SLUG}/league/:leagueSlug`;
export const MLB_LOBBY_MY_TEAMS = `${MLB_LOBBY_SLUG}/my-teams`;
export const MLB_LOBBY_TRAINING_TEAMS = `${MLB_LOBBY_SLUG}/training-teams`;
export const MLB_LOBBY_LEADERBOARD = `${MLB_LOBBY_SLUG}/leaderboard`;
export const MLB_LOBBY_REWARDS = `${MLB_LOBBY_SLUG}/rewards`;

export const MLB_COMPETITION_DETAILS = `${MLB_HOME}competition-details/:leaderboardSlug`;
export const MLB_COMPETITION_DETAILS_LEAGUE = `${MLB_COMPETITION_DETAILS}/league/:leagueSlug`;
export const MLB_COMPETITION_DETAILS_GAMEPLAY = `${MLB_COMPETITION_DETAILS}/gameplay`;
export const MLB_COMPETITION_DETAILS_LEAGUE_GAMEPLAY = `${MLB_COMPETITION_DETAILS_LEAGUE}/gameplay`;
export const MLB_COMPETITION_DETAILS_LINEUP = `${MLB_COMPETITION_DETAILS}/lineups/:lineupId`;
export const MLB_COMPETITION_DETAILS_LEAGUE_LINEUP = `${MLB_COMPETITION_DETAILS_LEAGUE}/lineups/:lineupId`;
export const MLB_COMPETITION_DETAILS_REWARDS = `${MLB_COMPETITION_DETAILS}/rewards`;
export const MLB_COMPETITION_DETAILS_LEAGUE_REWARDS = `${MLB_COMPETITION_DETAILS_LEAGUE}/rewards`;
export const MLB_COMPETITION_DETAILS_LEADERBOARD = `${MLB_COMPETITION_DETAILS}/leaderboard`;
export const MLB_COMPETITION_DETAILS_LEAGUE_LEADERBOARD = `${MLB_COMPETITION_DETAILS_LEAGUE}/leaderboard`;

export const MLB_NO_CARD_ENTRY = `${MLB_PATH}/no-card-route`;
export const MLB_NO_CARD_ENTRY_ACCEPT = `${MLB_NO_CARD_ENTRY}/accept`;
export const MLB_NO_CARD_ENTRY_REQUEST = `${MLB_NO_CARD_ENTRY}/request`;
export const MLB_NO_CARD_ENTRY_CONFIRM = `${MLB_NO_CARD_ENTRY}/confirm`;
export const MLB_NO_CARD_ENTRY_DECLINE = `${MLB_NO_CARD_ENTRY}/decline`;
export const MLB_NO_CARD_ENTRY_ELIGIBLE_LEADERBOARDS = `${MLB_NO_CARD_ENTRY}/eligible_leaderboards`;

export const MLB_JULIO_RODRIGUEZ_AUCTION_DETAILS = `${MLB_HOME}julio-rodriguez-auction`;

export const MLB_STARTER_BUNDLE_PAGE = `${MLB_HOME}starter-packs/:id`;

export const MLB_SHARE_USER_LINEUP = `${MLB_PATH}/share/:userSlug/lineups/:lineupId`;
export const MLB_SHARE_USER_LINEUP_TEMPLATE = `${MLB_SHARE_USER_LINEUP}/:shareTemplate`;
export const MLB_SHARE_USER_LINEUP_LEAGUE = `${MLB_SHARE_USER_LINEUP}/league/:leagueSlug`;
export const MLB_SHARE_USER_LINEUP_LEAGUE_TEMPLATE = `${MLB_SHARE_USER_LINEUP_LEAGUE}/:shareTemplate`;

export const NBA_HOME = '/nba/';
export const NBA_WILDCARD = `${NBA_PATH}/*`;
export const NBA_LANDING = NBA_HOME;
export const NBA_MARKET = `${NBA_PATH}/market/`;
export const NBA_USER_GALLERY = `${NBA_PATH}/gallery/:slug`;
export const NBA_USER_GALLERY_CARDS = `${NBA_USER_GALLERY}/${GALLERY_CARDS_RELATIVE}`;
export const NBA_USER_GALLERY_COLLECTIONS = `${NBA_USER_GALLERY}/${GALLERY_COLLECTIONS_RELATIVE}`;
export const NBA_USER_GALLERY_COLLECTIONS_SLUG = `${NBA_USER_GALLERY_COLLECTIONS}/:collectionSlug`;
export const NBA_PRIMARY_MARKET = `${NBA_PATH}/market/primary`;
export const NBA_STARTER_BUNDLES = `${NBA_PATH}/market/starter-packs`;
export const NBA_SECONDARY_MARKET = `${NBA_PATH}/market/secondary`;
export const NBA_SECONDARY_MARKET_STACK_SHOW = `${NBA_SECONDARY_MARKET}/:player_slug/:rarity`;
export const NBA_FAVORITES = `${NBA_MARKET}favorites`;
export const NBA_FAVORITES_CARDS = `${NBA_FAVORITES}/cards`;
export const NBA_FAVORITES_PLAYERS = `${NBA_FAVORITES}/players`;
export const NBA_CARD_SHOW = `${NBA_PATH}${LEGACY_CARD_SHOW}`;
export const NBA_HOW_TO_PLAY_EXTERNAL = `https://nbaguide.sorare.com`;

export const NBA_PLAYER = `${NBA_PATH}${LEGACY_PLAYER_SHOW}`;
export const NBA_PLAYER_DESCRIPTION = `${NBA_PLAYER}/description`;
export const NBA_PLAYER_CARDS = `${NBA_PLAYER}/cards`;
export const NBA_PLAYER_WILDCARD = `${NBA_PLAYER}/*`;

export const NBA_TEAM = `${NBA_PATH}/teams/:slug`;
export const NBA_TEAM_PLAYERS = `${NBA_TEAM}/players`;
export const NBA_TEAM_CARDS = `${NBA_TEAM}/cards`;

export const NBA_ONBOARDING = '/nba/onboarding';
export const NBA_COMPOSE_TEAM_WILDCARD = '/nba/compose-team/*';

export const NBA_LOBBY = `${NBA_PATH}/lobby`;
export const NBA_LEAGUES = `${NBA_HOME}leagues`;
export const NBA_LEAGUES_JOIN_SLUG = `${NBA_LEAGUES}/join/:leagueSlug`;
export const NBA_LEAGUES_SLUG = `${NBA_LEAGUES}/:leagueSlug`;
export const NBA_LEAGUES_SLUG_LEADERBOARDS = `${NBA_LEAGUES_SLUG}/leaderboards`;
export const NBA_LEAGUES_SLUG_MEMBERS = `${NBA_LEAGUES_SLUG}/members`;
export const NBA_PLAYOFFS_2022 = `${NBA_PATH}/playoffs-2022`;
export const NBA_PLAYOFFS_2022_CREDITS = `${NBA_PLAYOFFS_2022}/credits`;
export const NBA_PLAYOFFS_2022_SLUG = `${NBA_PLAYOFFS_2022}/:slug`;
export const NBA_PLAYOFFS_2022_SLUG_OVERVIEW = `${NBA_PLAYOFFS_2022_SLUG}/overview`;
export const NBA_PLAYOFFS_2022_SLUG_CREDITS = `${NBA_PLAYOFFS_2022_SLUG}/credits`;
export const NBA_PLAYOFFS_2022_SLUG_REWARDS = `${NBA_PLAYOFFS_2022_SLUG}/rewards`;
export const NBA_PLAYOFFS_2022_SLUG_MANAGER_VIEW = `${NBA_PLAYOFFS_2022_SLUG}/lineups/:cumulativeLeaderboardRankId`;

export const NBA_LOBBY_WILDCARD = `${NBA_LOBBY}/*`;
export const NBA_LOBBY_UPCOMING = `${NBA_LOBBY}/upcoming`;
export const NBA_LOBBY_UPCOMING_TOURNAMENTS = NBA_LOBBY_UPCOMING;
export const NBA_LOBBY_UPCOMING_MY_TEAMS = `${NBA_LOBBY_UPCOMING}/my-teams`;
export const NBA_LOBBY_UPCOMING_LEAGUE = `${NBA_LOBBY_UPCOMING}/league/:leagueSlug`;
export const NBA_LOBBY_UPCOMING_TRAINING_TEAMS = `${NBA_LOBBY_UPCOMING}/training-teams`;
export const NBA_LOBBY_UPCOMING_REWARDS = `${NBA_LOBBY_UPCOMING}/rewards`;
export const NBA_LOBBY_UPCOMING_SCHEDULE = `${NBA_LOBBY_UPCOMING}/schedule`;
export const NBA_LOBBY_UPCOMING_GAME = `${NBA_LOBBY_UPCOMING}/game/:gameId`;

export const NBA_LOBBY_LIVE = `${NBA_LOBBY}/live`;
export const NBA_LOBBY_LIVE_MY_TEAMS = NBA_LOBBY_LIVE;
export const NBA_LOBBY_LIVE_LEAGUE_DEPRECATED = `${NBA_LOBBY_LIVE}/group/:leagueSlug`;
export const NBA_LOBBY_LIVE_LEAGUE = `${NBA_LOBBY_LIVE}/league/:leagueSlug`;
export const NBA_LOBBY_LIVE_TRAINING_TEAMS = `${NBA_LOBBY_LIVE}/training-teams`;
export const NBA_LOBBY_LIVE_LEADERBOARD = `${NBA_LOBBY_LIVE}/leaderboard`;
export const NBA_LOBBY_LIVE_REWARDS = `${NBA_LOBBY_LIVE}/rewards`;
export const NBA_LOBBY_LIVE_SCHEDULE = `${NBA_LOBBY_LIVE}/schedule`;
export const NBA_LOBBY_LIVE_GAME = `${NBA_LOBBY_LIVE}/game/:gameId`;

export const NBA_LOBBY_PAST = `${NBA_LOBBY}/past`;
export const NBA_LOBBY_PAST_LEAGUE = `${NBA_LOBBY_PAST}/league/:leagueSlug`;
export const NBA_LOBBY_SLUG = `${NBA_LOBBY}/:slug`;
export const NBA_LOBBY_MY_TEAMS = `${NBA_LOBBY_SLUG}/my-teams`;
export const NBA_LOBBY_LEAGUE_DEPRECATED = `${NBA_LOBBY_SLUG}/group/:leagueSlug`;
export const NBA_LOBBY_LEAGUE = `${NBA_LOBBY_SLUG}/league/:leagueSlug`;
export const NBA_LOBBY_SCHEDULE = `${NBA_LOBBY_SLUG}/schedule`;
export const NBA_LOBBY_TRAINING_TEAMS = `${NBA_LOBBY_SLUG}/training-teams`;
export const NBA_LOBBY_LEADERBOARD = `${NBA_LOBBY_SLUG}/leaderboard`;
export const NBA_LOBBY_REWARDS = `${NBA_LOBBY_SLUG}/rewards`;
export const NBA_LOBBY_GAME = `${NBA_LOBBY_SLUG}/game/:gameId`;

export const NBA_COMPETITION_DETAILS = `${NBA_HOME}competition-details/:leaderboardSlug`;
export const NBA_COMPETITION_DETAILS_LEAGUE = `${NBA_COMPETITION_DETAILS}/league/:leagueSlug`;
export const NBA_COMPETITION_DETAILS_GAMEPLAY = `${NBA_COMPETITION_DETAILS}/gameplay`;
export const NBA_COMPETITION_DETAILS_LEAGUE_GAMEPLAY = `${NBA_COMPETITION_DETAILS_LEAGUE}/gameplay`;
export const NBA_COMPETITION_DETAILS_LINEUP = `${NBA_COMPETITION_DETAILS}/lineups/:lineupId`;
export const NBA_COMPETITION_DETAILS_LEAGUE_LINEUP = `${NBA_COMPETITION_DETAILS_LEAGUE}/lineups/:lineupId`;
export const NBA_COMPETITION_DETAILS_REWARDS = `${NBA_COMPETITION_DETAILS}/rewards`;
export const NBA_COMPETITION_DETAILS_LEAGUE_REWARDS = `${NBA_COMPETITION_DETAILS_LEAGUE}/rewards`;
export const NBA_COMPETITION_DETAILS_LEADERBOARD = `${NBA_COMPETITION_DETAILS}/leaderboard`;
export const NBA_COMPETITION_DETAILS_LEAGUE_LEADERBOARD = `${NBA_COMPETITION_DETAILS_LEAGUE}/leaderboard`;

export const NBA_COMPOSE_TEAM = `${NBA_HOME}compose-team/:leaderboardSlug`;
export const NBA_COMPOSE_TEAM_LINEUP = `${NBA_COMPOSE_TEAM}/:lineupId`;
export const NBA_STARTER_BUNDLE_OFFER = `${NBA_HOME}starterbundleoffer`;
export const NBA_STARTER_BUNDLE_PAGE = `${NBA_HOME}starter-packs/:id`;
export const NBA_STARTER_BUNDLE_WILDCARD = `${NBA_HOME}starter-packs/*`;

export const NBA_SHARE_USER_LINEUP = `${NBA_PATH}/share/:userSlug/lineups/:lineupId`;
export const NBA_SHARE_USER_LINEUP_TEMPLATE = `${NBA_SHARE_USER_LINEUP}/:shareTemplate`;
export const NBA_SHARE_USER_LINEUP_LEAGUE = `${NBA_SHARE_USER_LINEUP}/league/:leagueSlug`;
export const NBA_SHARE_USER_LINEUP_LEAGUE_TEMPLATE = `${NBA_SHARE_USER_LINEUP_LEAGUE}/:shareTemplate`;

export const NBA_NO_CARD_ENTRY = `${NBA_PATH}/no-card-route`;
export const NBA_NO_CARD_ENTRY_ACCEPT = `${NBA_NO_CARD_ENTRY}/accept`;
export const NBA_NO_CARD_ENTRY_REQUEST = `${NBA_NO_CARD_ENTRY}/request`;
export const NBA_NO_CARD_ENTRY_CONFIRM = `${NBA_NO_CARD_ENTRY}/confirm`;
export const NBA_NO_CARD_ENTRY_DECLINE = `${NBA_NO_CARD_ENTRY}/decline`;
export const NBA_NO_CARD_ENTRY_ELIGIBLE_LEADERBOARDS = `${NBA_NO_CARD_ENTRY}/eligible_leaderboards`;

export const LANDING_BY_SPORT: Record<Sport, string> = {
  [Sport.FOOTBALL]: FOOTBALL_PATH,
  [Sport.NBA]: NBA_LANDING,
  [Sport.BASEBALL]: MLB_LANDING,
};

export const SECONDARY_MARKET_STACK_SHOW_BY_SPORT: Record<Sport, string> = {
  [Sport.FOOTBALL]: FOOTBALL_TRANSFER_MARKET_STACK_SHOW,
  [Sport.NBA]: NBA_SECONDARY_MARKET_STACK_SHOW,
  [Sport.BASEBALL]: MLB_SECONDARY_MARKET_STACK_SHOW,
};

export const AUCTION_MARKET_URL: Record<Sport, string> = {
  [Sport.FOOTBALL]: FOOTBALL_NEW_SIGNINGS,
  [Sport.BASEBALL]: MLB_PRIMARY_MARKET,
  [Sport.NBA]: NBA_PRIMARY_MARKET,
};

export const STARTER_BUNDLES_URL: Record<Sport, string> = {
  [Sport.BASEBALL]: MLB_STARTER_BUNDLES,
  [Sport.NBA]: NBA_STARTER_BUNDLES,
  [Sport.FOOTBALL]: FOOTBALL_STARTER_BUNDLES,
};

export const LOBBY_TABS = {
  MY_TEAMS: 'my-teams',
  LEADERBOARD: 'leaderboard',
  MY_PLAYERS: 'my-players',
} as const;
export function goToLobby(
  type: 'past' | 'live' | 'upcoming',
  tab?: 'my-teams' | 'leaderboard' | 'my-players' | 'FOOTBALL_PRIVATE_LEAGUES',
  slug?: string
) {
  switch (type) {
    case 'past':
      return generatePath(FOOTBALL_LOBBY_PAST, {
        tab: tab || LOBBY_TABS.MY_TEAMS,
        slug: slug || 'past',
      });
    case 'live':
      return generatePath(FOOTBALL_LOBBY_LIVE, {
        tab: tab || LOBBY_TABS.MY_TEAMS,
      });
    default:
      if (tab) {
        return generatePath(FOOTBALL_LOBBY_UPCOMING, { tab });
      }
      return generatePath(FOOTBALL_LOBBY_UPCOMING.replace('/:tab', ''));
  }
}
export const CONTENT_PREVIEW_WILDCARD = `/content/preview/*`;
export const BANNER_SET_PREVIEW = `/content/preview/banner-set/:name`;
export const HERO_BANNER_SET_PREVIEW = `/content/preview/hero-banner-set/:name`;

export function getComposeTeamRoute({
  so5LeaderboardSlug,
  so5LineupId,
  ...rest
}: {
  so5LeaderboardSlug: string;
  so5LineupId?: string;
  [key: string]: string | undefined;
}) {
  let url;
  const params = {
    so5LeaderboardSlug,
    so5LineupId,
  };
  if (so5LineupId) {
    url = generatePath(FOOTBALL_COMPOSE_TEAM_LINEUP, params);
  } else {
    url = generatePath(FOOTBALL_COMPOSE_TEAM, params);
  }
  return url + qs.stringify(rest, { addQueryPrefix: true });
}

const SHARED_PAGES = [
  LANDING,
  MLB_LANDING,
  SETTINGS_WILDCARD,
  MY_SORARE_WILDCARD,
  CAREERS,
  PRESS,
  FAQ,
  TERMS,
  GAME_RULES,
  PRIVACY_POLICY,
  COOKIE_POLICY,
  CONFIRM_EMAIL,
  CONFIRM_DEVICE,
  DEBUG_DEVICE,
  INVITE_WILDCARD,
  ACCEPT_INVITATION,
  REFERRER_LINK,
  MOBILE_SIGN_UP,
  OAUTH_AUTORIZE,
  ACTIVITY_WILDCARD,
];

export function sharedAcrossSportsPage(pathname: string) {
  return !!SHARED_PAGES.find(page => matchPath(page, pathname));
}

export function isLanding(pathname: string) {
  return matchPath(LANDING, pathname);
}

export function isMlbPage(pathname: string) {
  return !!matchPath(MLB_WILDCARD, pathname);
}

export function isNBAPage(pathname: string) {
  return !!matchPath(NBA_WILDCARD, pathname);
}

export function isMarket(pathname: string) {
  return !!(
    matchPath(FOOTBALL_NEW_SIGNINGS, pathname) ||
    matchPath(MLB_PRIMARY_MARKET, pathname) ||
    matchPath(NBA_PRIMARY_MARKET, pathname) ||
    matchPath(FOOTBALL_TRANSFER_MARKET, pathname) ||
    matchPath(MLB_SECONDARY_MARKET, pathname) ||
    matchPath(NBA_SECONDARY_MARKET, pathname)
  );
}

// this should stay a hook for future feature flags integration
export const useDefaultSportPages = (): { [key in Sport]: string } => {
  return {
    FOOTBALL: FOOTBALL_HOME,
    BASEBALL: MLB_HOME,
    NBA: NBA_HOME,
  };
};

export const RAMP_TRANSACTION_WEBHOOK = `${API_ROOT}/webhooks/ramp/transaction_state_updated`;
