import qs from 'qs';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import {
  CommonDraftCampaignStatus,
  FootballManagerTaskSlug,
  Rarity,
} from '@sorare/core/src/__generated__/globalTypes';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import {
  FOOTBALL_COMPETITION_DETAILS_DETAILS,
  FOOTBALL_DRAFT,
  FOOTBALL_LOBBY,
  FOOTBALL_LOBBY_PRIZE_POOL,
  FOOTBALL_NEW_SIGNINGS,
  FOOTBALL_PICK_LEAGUE,
  FOOTBALL_TRANSFER_MARKET,
  FOOTBALL_VIDEOS,
  getComposeTeamRoute,
} from '@sorare/core/src/constants/routes';

import buyer from 'assets/home/tasks/buyer.png';
import coach_2 from 'assets/home/tasks/coach-2.png';
import coach from 'assets/home/tasks/coach.png';
import scout from 'assets/home/tasks/scout.png';

import { FootballManagerTask_so5Leaderboard } from './__generated__/index.graphql';

const messages = defineMessages({
  desktopComposeTeamAmateur: {
    id: 'FootballManagerTask.Desktop.compose_team_amateur',
    defaultMessage: 'Compose your first Amateur team',
  },
  mobileComposeTeamAmateur: {
    id: 'FootballManagerTask.Mobile.compose_team_amateur',
    defaultMessage: 'Compose your team',
  },
  draftSecondAmateur: {
    id: 'FootballManagerTask.draft_second_amateur',
    defaultMessage: 'Draft from another Amateur league',
  },
  desktopWatchVideo: {
    id: 'Awards.scout',
    defaultMessage: 'Master Sorare 101 and learn the basics of our game',
  },
  mobileWatchVideo: {
    id: 'FootballManagerTask.Mobile.watch_video',
    defaultMessage: 'Master Sorare 101',
  },
  watchTutorial: {
    id: 'FootballManagerTask.Desktop.watch_tutorial',
    defaultMessage: 'Explore the Marketplace',
  },
  desktopBuyCard: {
    id: 'Awards.buyer',
    defaultMessage: 'Improve your team and buy a card from the marketplace',
  },
  mobileBuyCard: {
    id: 'FootballManagerTask.Mobile.buy_card',
    defaultMessage: 'Buy a card',
  },
  desktopComposeTeamSemiPro: {
    id: 'Awards.coach_2',
    defaultMessage: 'Progress by submitting your first Semi-Pro lineup',
  },
  mobileComposeTeamSemiPro: {
    id: 'FootballManagerTask.Mobile.compose_team_semi_pro',
    defaultMessage: 'Submit your first Semi-Pro team',
  },
  desktopDiscoverProgression: {
    id: 'FootballManagerTask.Desktop.discover_progression',
    defaultMessage: 'Check the prize pool page',
  },
  mobileDiscoverProgression: {
    id: 'FootballManagerTask.Mobile.discover_progression',
    defaultMessage: 'Check rewards',
  },
  desktopPlaceBid: {
    id: 'FootballManagerTask.Desktop.place_bid',
    defaultMessage: 'Place a bid on a card',
  },
  mobilePlaceBid: {
    id: 'FootballManagerTask.Mobile.place_bid',
    defaultMessage: 'Place a bid',
  },
  desktopScoutPlayer: {
    id: 'FootballManagerTask.Desktop.scout_player',
    defaultMessage: 'Follow a player to get notified when his new cards appear',
  },
  mobileScoutPlayer: {
    id: 'FootballManagerTask.Mobile.scout_player',
    defaultMessage: 'Scout a player',
  },
});

export const tasksData: {
  [key in FootballManagerTaskSlug]: {
    desktopDescription: {
      id: string;
      defaultMessage: string;
    };
    mobileDescription: {
      id: string;
      defaultMessage: string;
    };
    image: any;
    getLink?: (args: {
      leaderboards: Nullable<FootballManagerTask_so5Leaderboard[]>;
      so5LeaguesAlgoliaFilters: Record<string, string>;
    }) => string;
    onClick?: (args: {
      openAddFunds: () => void;
      validateReward: () => void;
      openExploreMarketplace: () => void;
    }) => void;
    leaveActiveAfterCompleted?: boolean;
  };
} = {
  COMPOSE_TEAM_AMATEUR: {
    desktopDescription: messages.desktopComposeTeamAmateur,
    mobileDescription: messages.mobileComposeTeamAmateur,
    image: coach,
    getLink: ({ leaderboards }) => {
      const amateurLeaderboards = leaderboards?.filter(l =>
        l.so5LeaderboardType.includes('_AMATEUR')
      );
      if (!amateurLeaderboards?.length) {
        return FOOTBALL_LOBBY;
      }
      const unRegisteredOrUnConfirmedLeaderboard = amateurLeaderboards?.find(
        l =>
          l.commonDraftCampaign?.status !== CommonDraftCampaignStatus.OPEN &&
          (!l.mySo5Lineups.length || l.mySo5Lineups[0].draft)
      );
      if (unRegisteredOrUnConfirmedLeaderboard) {
        return getComposeTeamRoute({
          so5LeaderboardSlug: unRegisteredOrUnConfirmedLeaderboard.slug,
        });
      }

      const undraftedLeaderboard = amateurLeaderboards?.find(
        l => l.commonDraftCampaign?.status === CommonDraftCampaignStatus.OPEN
      );
      if (undraftedLeaderboard) {
        return generatePath(FOOTBALL_DRAFT, {
          slug: undraftedLeaderboard.slug,
        });
      }
      return FOOTBALL_LOBBY;
    },
  },
  DRAFT_SECOND_AMATEUR: {
    desktopDescription: messages.draftSecondAmateur,
    mobileDescription: messages.draftSecondAmateur,
    image: coach,
    getLink: () => FOOTBALL_PICK_LEAGUE,
  },
  WATCH_VIDEO: {
    desktopDescription: messages.desktopWatchVideo,
    mobileDescription: messages.mobileWatchVideo,
    image: scout,
    getLink: () =>
      generatePath(FOOTBALL_VIDEOS, {
        slug: 'football-beginner-guide',
      }),
    onClick: ({ validateReward }) => {
      validateReward();
    },
    leaveActiveAfterCompleted: true,
  },
  WATCH_TUTORIAL: {
    desktopDescription: messages.watchTutorial,
    mobileDescription: messages.watchTutorial,
    image: buyer,
    onClick: ({ openExploreMarketplace }) => {
      openExploreMarketplace();
    },
  },
  BUY_CARD: {
    desktopDescription: messages.mobileBuyCard,
    mobileDescription: messages.mobileBuyCard,
    image: buyer,
    getLink: ({ leaderboards, so5LeaguesAlgoliaFilters }) => {
      const leaderboardsWithDraft = leaderboards?.filter(
        l => l.commonDraftCampaign?.status !== CommonDraftCampaignStatus.OPEN
      );

      const correspondingLeagueFilter =
        // only filter in marketplace by league if one league drafted
        // otherwise display all cards
        leaderboardsWithDraft?.length === 1
          ? Object.keys(so5LeaguesAlgoliaFilters).find(leagueSlug =>
              leaderboardsWithDraft[0].so5League.displayName.includes(
                leagueSlug
              )
            )
          : undefined;
      return `${FOOTBALL_TRANSFER_MARKET}?${qs.stringify({
        [SEARCH_PARAMS.RARITY]: Rarity.limited,
        [SEARCH_PARAMS.LEAGUE_FILTER]: correspondingLeagueFilter,
      })}`;
    },
  },
  COMPOSE_TEAM_SEMI_PRO: {
    desktopDescription: messages.desktopComposeTeamSemiPro,
    mobileDescription: messages.mobileComposeTeamSemiPro,
    image: coach_2,
    getLink: ({ leaderboards }) => {
      const amateurLeaderboards = leaderboards?.filter(l =>
        l.so5LeaderboardType.includes('_AMATEUR')
      );
      const draftedAmateurLeaderboard = amateurLeaderboards?.find(
        l =>
          l.commonDraftCampaign?.status !== CommonDraftCampaignStatus.OPEN &&
          l.canCompose.value
      );
      const correspondingSemiProLeaderboard = leaderboards?.find(
        l =>
          draftedAmateurLeaderboard &&
          l.division === 2 &&
          l.so5LeaderboardType.startsWith(
            draftedAmateurLeaderboard.so5LeaderboardType.replace('_AMATEUR', '')
          )
      );
      if (correspondingSemiProLeaderboard) {
        return generatePath(FOOTBALL_COMPETITION_DETAILS_DETAILS, {
          competition: correspondingSemiProLeaderboard.slug,
        });
      }
      return FOOTBALL_LOBBY;
    },
  },
  DISCOVER_PROGRESSION: {
    desktopDescription: messages.desktopDiscoverProgression,
    mobileDescription: messages.mobileDiscoverProgression,
    image: scout,
    getLink: () => FOOTBALL_LOBBY_PRIZE_POOL,
    onClick: ({ validateReward }) => {
      validateReward();
    },
    leaveActiveAfterCompleted: true,
  },
  PLACE_BID: {
    desktopDescription: messages.desktopPlaceBid,
    mobileDescription: messages.mobilePlaceBid,
    image: buyer,
    getLink: () => FOOTBALL_NEW_SIGNINGS,
    leaveActiveAfterCompleted: true,
  },
  SCOUT_PLAYER: {
    desktopDescription: messages.desktopScoutPlayer,
    mobileDescription: messages.mobileScoutPlayer,
    image: buyer,
    getLink: () => FOOTBALL_NEW_SIGNINGS,
    leaveActiveAfterCompleted: true,
  },
};
