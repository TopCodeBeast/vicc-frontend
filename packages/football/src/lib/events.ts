// import { FootballManagerTaskSlug } from '@sorare/core/src/__generated__/globalTypes';
// import generateUseEvents from '@sorare/core/src/lib/events/generateUseEvents';
// import {
//   Sport,
//   sportToJSON,
// } from '@sorare/core/src/protos/events/shared/events';

export type UnlockButtonAction =
  | 'Open Starter Bundle Dialog'
  | 'Redirect to Market';

export type LeaderboardInfos = {
  leaderboardSlug?: string;
  leaderboardName?: string;
  leaderboardRarity?: string;
};

export type FootballEventTypes = {
  'Click Beginners Guide': {
    campaignSlug?: string;
    isLogged: boolean;
    isOnboarding: boolean;
  };
  'Click Confirm Lineup': {
    campaignSlug?: string;
    isLogged: boolean;
    hasWarnings: boolean;
  };
  'Click Confirm Lineup After Warning': {
    campaignSlug?: string;
  };
  'Click Content Unit': {
    title: string;
  };
  'Click How To Video': void;
  // 'Click Manager Assistant Task': {
  //   task: FootballManagerTaskSlug;
  // };
  'Click Submit Draft': {
    campaignSlug: string;
    success: boolean;
    errorMessage?: string;
    isLogged: boolean;
    isOnboarding: boolean;
  };
  'Click Starter Bundle Buy Button': {
    primaryOfferId: string;
    eurAmount: number;
    domesticLeagueName?: string;
    playerSlugs: string[];
    tournamentType: string;
    rarity: string;
    remainingSeconds: number;
  };
  'Click Team Placeholder': LeaderboardInfos;
  'Click Unlock Button': {
    action: UnlockButtonAction;
  } & LeaderboardInfos;
  'Click View More In Homepage': {
    context: 'Live' | 'Upcoming' | 'Private Leagues' | 'Discover' | 'Past';
  };
  'Dismiss Content Unit': {
    title: string;
  };
  'Expand Manager Assistant': {
    source: 'button' | 'title';
  };
  'Open Private League': {
    privateLeagueSlug: string;
  };
  'Pick League': {
    campaignSlug: string;
    automaticPick: boolean;
    isLogged: boolean;
    isOnboarding: boolean;
  };
  'Redirect To Marketplace': {
    destination: string;
  } & LeaderboardInfos;
  'Start Draft': {
    campaignSlug: string;
    sourcePage?: string;
    isLogged: boolean;
    isOnboarding: boolean;
  };
  'View Shared Lineup': {
    lineup: string;
    competition: string;
  };
  'Open Match View': {
    gameId: string;
    gameStatus: string;
    deviceType: string;
  };
  'Open Match View Player Details': {
    playerSlug: string;
  };
  'Click Competition': {
    leaderboardSlug: string;
    leaderboardName: string;
  };
  'Click Shuffle Card To Discover': {
    league: string;
  };
};

// export const useFootballEvents = generateUseEvents<FootballEventTypes>({
//   defaultProperties: {
//     sport: sportToJSON(Sport.FOOTBALL),
//   },
// });

export const useFootballEvents = () => {
  return (msg: any, ...params: any) => {
    return 1;
  };
};
