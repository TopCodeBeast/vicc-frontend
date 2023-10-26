import { TypedDocumentNode, gql } from '@apollo/client';
import { MessageDescriptor, defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import {
  Position as GlobalPosition,
  Rarity,
  RestrictionGroup,
} from '@sorare/core/src/__generated__/globalTypes';
import {
  INVITE_EPL_USER_GROUP,
  INVITE_USER_GROUP,
} from '@sorare/core/src/constants/routes';
import { CamelCaseScarcity, Scarcity } from '@sorare/core/src/lib//cards';
import {
  LobbyRarity,
  RANKED_SCARCITY,
  RankedScarcity,
  ScarcityType,
  scarcityMessages,
} from '@sorare/core/src/lib//scarcity';
import { sortByArrayIndex } from '@sorare/core/src/lib/arrays';
import { withFragments } from '@sorare/core/src/lib/gql';
import { asObject } from '@sorare/core/src/lib/json';
import {
  PlayablePosition,
  playablePositions,
} from '@sorare/core/src/lib/players';

import {
  Lib_Vicc5_vicc5Leaderboard,
  Lib_Vicc5_vicc5League,
  getLeaderboardInfo_vicc5Leaderboard,
  getPlayerScore_vicc5Score,
  hasBonuses_vicc5Leaderboard,
  isBlockchainLeague_vicc5League,
  sortLeaderboards_leaderboard,
} from './__generated__/so5.graphql';

const fragments = {
  vicc5Leaderboard: gql`
    fragment Lib_Vicc5_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      displayName
      rarityType
    }
  ` as TypedDocumentNode<Lib_Vicc5_vicc5Leaderboard>,
  vicc5League: gql`
    fragment Lib_Vicc5_vicc5League on Vicc5League {
      slug
      name
      displayName
      shortDisplayName
      category
    }
  ` as TypedDocumentNode<Lib_Vicc5_vicc5League>,
};

export type LeagueType = Omit<Lib_Vicc5_vicc5League, '__typename' | 'slug'>;
export type LeagueNameType = { name: string };
export type LeaderboardType = Omit<
  Lib_Vicc5_vicc5Leaderboard,
  '__typename' | 'slug'
>;
export type LeaderboardDivisionType = { division: number };

const maxPower: {
  common: number;
  limited: number;
  rare: number;
  super_rare: number;
  unique: number;
  custom_series: number;
} = {
  common: 0.1,
  limited: 0.1,
  rare: 0.1,
  super_rare: 0.3,
  unique: 0.5,
  custom_series: 0.1,
};

export const orderLeaderboards = <T extends LeaderboardDivisionType>(
  vicc5Leaderboards: T[],
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  const d = direction === 'asc' ? 1 : -1;
  // don't sort the array in-place since it comes from gql cache
  return [...vicc5Leaderboards].sort((a, b) =>
    a.division < b.division ? d : -d
  );
};

export const leagues = [
  'rookie',
  'all_star',
  'under_twenty_one',
  'weekly',
  'jupiler',
  'europe',
  'america',
  'asia',
  'training_center',
  'unique_only',
] as const;
export type League = (typeof leagues)[number];
const leagueOrder: League[] = [
  'rookie',
  'all_star',
  'under_twenty_one',
  'unique_only',
  'weekly',
  'jupiler',
  'europe',
  'america',
  'asia',
  'training_center',
];

export const orderLeagues = <T extends { name: string; category: string }>(
  vicc5Leagues: T[]
): T[] =>
  [...vicc5Leagues].sort(
    (a, b) =>
      leagueOrder.indexOf(a.name as League) -
      leagueOrder.indexOf(b.name as League)
  );

export const isBlockchainLeague = withFragments(
  (vicc5League: isBlockchainLeague_vicc5League) =>
    vicc5League.restrictionGroup === RestrictionGroup.BLOCKCHAIN_GROUP,
  {
    vicc5League: gql`
      fragment isBlockchainLeague_vicc5League on Vicc5League {
        slug
        restrictionGroup
      }
    ` as TypedDocumentNode<isBlockchainLeague_vicc5League>,
  }
);

export const isWeekly = (league: { name: string }) => league.name === 'weekly';
export const isSpecialWeeklyEvent = (vicc5Fixture: {
  specialWeeklyBanner: any;
}) => vicc5Fixture.specialWeeklyBanner !== null;

export interface EditableAppearance<C> {
  __typename: 'Vicc5Appearance';
  card: C | null;
  captain: boolean;
  id: string;
}

export type EditableLineup<C> = {
  readonly [key in Position]: EditableAppearance<C>;
};

export const emptyAppearance: EditableAppearance<null> = {
  __typename: 'Vicc5Appearance',
  captain: false,
  id: '',
  card: null,
};

//TODO
export const emptyLineupByPosition: EditableLineup<any> = {
  [GlobalPosition.Batsman]: { ...emptyAppearance },
  [GlobalPosition.Bowler]: { ...emptyAppearance },
  [GlobalPosition.Fielder]: { ...emptyAppearance },
  [GlobalPosition.Wicketkeeper]: { ...emptyAppearance },
  'Extra Player': { ...emptyAppearance },
};

export const emptyLineup: {
  __typename: 'Vicc5Lineup';
  id: string;
  name: string | null;
  vicc5Appearances: [];
  socialPictureUrls: {
    __typename: 'SocialPictureDerivative';
    post: string | null;
    story: string | null;
    square: string | null;
  };
} = {
  __typename: 'Vicc5Lineup',
  id: '',
  name: null,
  vicc5Appearances: [],
  socialPictureUrls: {
    __typename: 'SocialPictureDerivative',
    post: null,
    story: null,
    square: null,
  },
};

export const hasAppearanceBeenUpdated = ({
  bonus,
}: {
  bonus: number | null;
}) => {
  return bonus !== null;
};

export type Position = PlayablePosition | 'Extra Player';

export const getMaxPower = (scarcity: Scarcity) => {
  return maxPower[scarcity];
};

export type FixtureState =
  | 'opened'
  | 'started'
  | 'computed'
  | 'cancelled'
  | 'closed';

export const isFixtureCancelled = (fixture: { aasmState: string }): boolean =>
  fixture.aasmState === 'cancelled';
export const isFixtureStarted = (fixture: { aasmState: string }): boolean =>
  ['started', 'computed', 'closed'].includes(fixture.aasmState);
export const isFixtureOpened = (fixture: { aasmState: string }): boolean =>
  fixture.aasmState === 'opened';
export const isFixtureLive = (fixture: {
  aasmState: string;
  endDate: string;
}): boolean =>
  fixture.aasmState === 'started' &&
  new Date(fixture.endDate).getTime() - new Date().getTime() > 0;
export const isFixtureClosed = (fixture: { aasmState: string }): boolean =>
  fixture.aasmState === 'closed';

export const isAllStar = (league: { name: string }) =>
  league.name === 'all_star';

export const isUnderTwentyThree = (league: { name: string }) =>
  league.name === 'under_twenty_one';

export const isUnique = (league: { name: string }) =>
  league.name === 'unique_only';

export const isGlobal = (league: { category: string }) =>
  league.category === 'global';

export const isPremierLeague = (league: { name: string }) =>
  league.name === 'england';

export const hasBonuses = withFragments(
  (leaderboard: hasBonuses_vicc5Leaderboard) =>
    Object.keys(asObject((leaderboard as any).engineConfiguration || {})).filter(
      bonus => bonus !== 'captain'
    ).length > 0,
  {
    vicc5Leaderboard: gql`
      fragment hasBonuses_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        engineConfiguration {
          scarcity
          grade
          season
        }
      }
    ` as TypedDocumentNode<hasBonuses_vicc5Leaderboard>,
  }
);

export type EngineConfiguration = {
  captain: number;
  scarcity: { [key in Rarity]?: number };
};

export const getEngineConfigurationScarcities = (
  scarcity: EngineConfiguration['scarcity']
): Partial<Record<CamelCaseScarcity, number>> => {
  if (!scarcity) return {};
  const scarcities = {
    ...scarcity,
    superRare: scarcity.super_rare,
  };
  delete scarcities.super_rare;
  return scarcities;
};

export const ScoreModifier = {
  None: '',
  NoPoints: 'noPoints',
  Less: 'less',
  More: 'more',
} as const;
type ScoreModifierKeys = keyof typeof ScoreModifier;
export type ScoreModifierValues = (typeof ScoreModifier)[ScoreModifierKeys];

export const getScoreModifiers = (
  rawModifier?: number
): { score: ScoreModifierValues; scoreModifier: number } => {
  const scoreModifier = rawModifier || 0;
  let score: ScoreModifierValues = ScoreModifier.None;
  if (scoreModifier === -1) {
    score = ScoreModifier.NoPoints;
  } else if (scoreModifier < 0) {
    score = ScoreModifier.Less;
  } else if (scoreModifier > 0) {
    score = ScoreModifier.More;
  }
  return { score, scoreModifier };
};

export type FormationName = 'batsman' | 'filder' | 'bowler' | 'wicketkeeper' | 'default';
export type Formation = {
  name: FormationName;
  formation: string;
};

export const extraPlayerPosition: {
  [key in FormationName]: PlayablePosition | null;
} = {
  batsman: GlobalPosition.Batsman,
  filder: GlobalPosition.Fielder,
  bowler: GlobalPosition.Bowler,
  wicketkeeper: GlobalPosition.Wicketkeeper,
  default: null,
};

export const formationFromExtraPlayerPosition: {
  [key in PlayablePosition]: FormationName;
} = {
  Batsman: 'batsman',
  Fielder: 'filder',
  Bowler: 'bowler',
  Wicketkeeper: 'wicketkeeper',
};

export const getPositionSelectionOrder = (
  formation: FormationName
): Position[] => {
  const extraPosition = extraPlayerPosition[formation];

  const result: Position[] = [...playablePositions].reverse();

  const extraPlayerIndex = extraPosition
    ? result.indexOf(extraPosition) + 1
    : 5;

  result.splice(extraPlayerIndex, 0, 'Extra Player');
  return result;
};

export enum PlayerScoreStatus {
  NO_GAME = 'no_game',
  DID_NOT_PLAY = 'did_not_play',
  REVIEWING = 'reviewing',
  PENDING = 'pending',
}

export enum GameEventStatus {
  SCHEDULED = 'scheduled',
  PLAYING = 'playing',
  PLAYED = 'played',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
  SUSPENDED = 'suspended',
}

export const gameStatusMessages = defineMessages<string>({
  scheduled: { id: 'GameStatus.scheduled', defaultMessage: 'Scheduled' },
  playing: { id: 'GameStatus.playing', defaultMessage: 'Playing' },
  played: { id: 'GameStatus.final', defaultMessage: 'Final' },
  cancelled: { id: 'GameStatus.canceled', defaultMessage: 'Canceled' },
  postponed: { id: 'GameStatus.postponed', defaultMessage: 'Postponed' },
  suspended: { id: 'GameStatus.suspended', defaultMessage: 'Suspended' },
});

export const isGameCancelled = (gameStatus: string): boolean =>
  gameStatus === GameEventStatus.SUSPENDED ||
  gameStatus === GameEventStatus.CANCELLED ||
  gameStatus === GameEventStatus.POSTPONED;

export const isGameLive = (gameStatus: string): boolean =>
  gameStatus === GameEventStatus.PLAYING;

export const isGameStarted = (gameStatus: string): boolean =>
  gameStatus === GameEventStatus.PLAYED ||
  gameStatus === GameEventStatus.PLAYING;

export const isGameFinished = (gameStatus: string): boolean =>
  gameStatus === GameEventStatus.PLAYED;

export const isGameLeft = (gameStatus: string): boolean =>
  gameStatus === GameEventStatus.SCHEDULED ||
  gameStatus === GameEventStatus.PLAYING;

export const isGameScheduled = (gameStatus: string): boolean =>
  gameStatus === GameEventStatus.SCHEDULED;

export type Vicc5Score_playerScore = Omit<getPlayerScore_vicc5Score, 'id'>;

export const getPlayerScore = withFragments(
  (vicc5Score?: Vicc5Score_playerScore | null, bonus?: number | null) => {
    if (!vicc5Score) {
      return { score: null, status: PlayerScoreStatus.NO_GAME };
    }

    const { game } = vicc5Score;
    const gameStatus = game.status;
    const { minsPlayed } = vicc5Score.playerGameStats;

    if (!!gameStatus && isGameScheduled(gameStatus)) {
      return { score: null, status: PlayerScoreStatus.PENDING };
    }

    if (!(minsPlayed && minsPlayed > 0)) {
      return { score: null, status: PlayerScoreStatus.DID_NOT_PLAY };
    }

    const isScoreDefined = typeof vicc5Score.score === 'number';

    if (!isScoreDefined) {
      return { score: null, status: null };
    }

    const score = vicc5Score.score
      ? vicc5Score.score * (bonus || 1)
      : vicc5Score.score;

    const reviewing = Boolean(
      gameStatus &&
        (isGameLive(gameStatus) || isGameFinished(gameStatus)) &&
        !vicc5Score?.playerGameStats?.reviewed
    );

    if (reviewing) {
      return { score, status: PlayerScoreStatus.REVIEWING };
    }

    return {
      score,
      status: null,
    };
  },
  {
    vicc5Score: gql`
      fragment getPlayerScore_vicc5Score on Vicc5Score {
        id
        score
        playerGameStats {
          id
          minsPlayed
          reviewed
        }
        game {
          id
          status
        }
      }
    ` as TypedDocumentNode<getPlayerScore_vicc5Score>,
  }
);

export const positionShortNames = defineMessages<GlobalPosition | Position>({
  Bowler: {
    id: 'Player.shortBowler',
    defaultMessage: 'BOWL',
  },
  Fielder: {
    id: 'Player.shortFielder',
    defaultMessage: 'FIELD',
  },
  Batsman: {
    id: 'Player.shortBatsman',
    defaultMessage: 'BATS',
  },
  Wicketkeeper: {
    id: 'Player.shortWicketkeeper',
    defaultMessage: 'WK',
  },
  'Extra Player': {
    id: 'Player.shortExtraPlayer',
    defaultMessage: 'Extra',
  },
  AllRounder: {
    id: 'Player.shortAllRounder',
    defaultMessage: 'ALL',
  },
  Unknown: {
    id: 'Player.shortUnknown',
    defaultMessage: 'Unknown',
  },
});

type AppearanceWithPosition = {
  __typename: 'Vicc5Appearance';
  captain: boolean;
  id: string;
  card: {
    position: GlobalPosition;
  };
};
export const getAppearancesByPosition = <T extends AppearanceWithPosition>(
  appearances: T[]
): { [key in Position]: T | EditableAppearance<any> } =>
  appearances.reduce(
    (acc, app) => {
      const { position } = app.card;
      // if (position === GlobalPosition.Coach) return acc;
      if (position === GlobalPosition.Unknown) return acc;

      if (acc[position]?.card) {
        acc['Extra Player'] = { ...app };
      } else {
        acc[position] = { ...app };
      }
      return acc;
    },
    { ...emptyLineupByPosition }
  );

export const socialSharingMessages = defineMessages({
  lineup: {
    id: 'SocialSharingVicc5.lineup',
    defaultMessage: 'Check out that lineup',
  },
  myLineup: {
    id: 'SocialSharingVicc5.myLineup',
    defaultMessage: 'Check out my lineup',
  },
  card: {
    id: 'SocialSharingVicc5.card',
    defaultMessage: 'Check out this card',
  },
});

export const startedLineupSharingMessages = defineMessages({
  set1: {
    id: 'StartedLineupSharingMessages.lineup.set1',
    defaultMessage:
      '🏆 Can you beat my team score in the {displayName} competition on #Vicc? Let’s see what you got! 💪',
  },
  set2: {
    id: 'StartedLineupSharingMessages.lineup.set2',
    defaultMessage:
      '💥 My #Vicc line-up in the {displayName} competition was on fire! 🔥 Think you can do better? Prove it!',
  },
  set3: {
    id: 'StartedLineupSharingMessages.lineup.set3',
    defaultMessage:
      '🔭 Another scouting masterclass from {clubName} in the {displayName} competition. Think you know football better? See you on #Vicc!',
  },
});

export const notStartedLineupSharingMessages = defineMessages({
  set1: {
    id: 'NotStartedLineupSharingMessages.lineup.set1',
    defaultMessage:
      '🚀 I’ve set my line-up for the {displayName} competition! Are you game? Join me on #Vicc and let’s compete! 🥇',
  },
  set2: {
    id: 'NotStartedLineupSharingMessages.lineup.set2',
    defaultMessage:
      '⚡️ It’s almost time for the {displayName} competition! Get your teams ready and challenge me on #Vicc! 🏆',
  },
  set3: {
    id: 'NotStartedLineupSharingMessages.lineup.set3',
    defaultMessage:
      '🌟 The {displayName} competition is coming up, and my team is ready to win! Can you beat me? Catch you on #Vicc! 🕶',
  },
});

export const getLeaderboardInfo = withFragments(
  (
    leaderboard: getLeaderboardInfo_vicc5Leaderboard
  ): {
    backgroundScarcity: ScarcityType;
    isTraining: boolean;
    weight: number;
    scarcityMessageDescriptor: MessageDescriptor;
    scarcity: ScarcityType;
    hasRewards: boolean;
    commonDraftCampaignSlug?: string;
  } => {
    const { totalRewards, rarityType, commonDraftCampaign, trainingCenter } =
      leaderboard;
    const rawScarcity = rarityType as LobbyRarity;
    const isPro = rawScarcity === 'rare_pro';
    const scarcity = isPro ? 'rare' : rawScarcity;
    const backgroundScarcity = scarcity;
    const scarcityMessageDescriptor = scarcityMessages[scarcity];
    let rankedScarcity: RankedScarcity = rawScarcity;
    if (trainingCenter) rankedScarcity = 'training';
    const hasCardsRewards = (totalRewards.cards as { rarities?: any[] })
      ?.rarities?.length;
    const hasEthRewards = totalRewards.prizePool;
    const hasCustomRewards = (totalRewards.experiences as { type?: any[] })
      ?.type?.length;

    return {
      backgroundScarcity,
      isTraining: trainingCenter,
      weight: RANKED_SCARCITY[rankedScarcity],
      scarcityMessageDescriptor,
      scarcity,
      hasRewards: !!(hasCardsRewards || hasEthRewards || hasCustomRewards),
      commonDraftCampaignSlug: commonDraftCampaign?.slug,
    };
  },
  {
    vicc5Leaderboard: gql`
      fragment getLeaderboardInfo_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        trainingCenter
        commonDraftCampaign {
          slug
        }
        totalRewards {
          cards
          experiences
          prizePool
          prizePoolCurrency
        }
        ...Lib_Vicc5_vicc5Leaderboard
      }
      ${fragments.vicc5Leaderboard}
    ` as TypedDocumentNode<getLeaderboardInfo_vicc5Leaderboard>,
  }
);

// sorted by display order
export const HANDLED_RULES = [
  'rarityLimits',
  'age',
  'captainRarities',
  'sameActiveClub',
  'minimumPlayersAverageScore',
  'maximumPlayersAverageScore',
  'scarcity',
  'allowLegend',
  'cardEditionsCount',
  'sumOfAverageScores',
  'seasons',
  'leagues',
  'competitions',
  'internationalCompetitions',
  'notDomesticCompetitions',
  'activeClubs',
  'sameNationality',
  'serialNumber',
  'nationalities',
  'notNationalities',
  'atLeastOfCompetitions',
  'atLeastOfClubs',
] as const;

export const ELIGIBILITY_RULES = ['cardsCountOfCurrentUser'] as string[];

export const captainDialogMessages = defineMessages({
  default: {
    id: 'CaptainDialog.subtitle',
    defaultMessage:
      'The player you select as captain will get a 20% bonus to their score. Pick someone you think will perform very well this Game Week!',
  },
});

export const generatePrivateUserGroupInviteLink = (
  joinSecret: string,
  userSlug?: string,
  vicc5LeaderboardType?: string
) => {
  let link =
    window.location.origin +
    generatePath(
      vicc5LeaderboardType?.startsWith('FIRST_DIVISION_ENGLAND')
        ? INVITE_EPL_USER_GROUP
        : INVITE_USER_GROUP,
      {
        joinSecret,
      }
    );
  if (userSlug) {
    link = `${link}?referrer=${userSlug}`;
  }
  return link;
};

const TOURNAMENT_NAMES: { [vicc5LeaderboardTypePrefix: string]: string } = {
  FIRST_DIVISION_FRANCE: 'Ligue 1',
  FIRST_DIVISION_GERMANY: 'Bundesliga',
  FIRST_DIVISION_ENGLAND: 'Premier League',
  FIRST_DIVISION_ITALY: 'Serie A',
  FIRST_DIVISION_SPAIN: 'LaLiga',
};

const extractTournamentName = (vicc5LeaderboardType?: string) =>
  Object.entries(TOURNAMENT_NAMES).find(([prefix]) =>
    vicc5LeaderboardType?.startsWith(prefix)
  )?.[1];

const PrivateUserGroupInvitationMessages = defineMessages({
  inviteTitle: {
    id: 'UserGroupInvitation.Field.Share',
    defaultMessage: 'Invite',
  },
  inviteMsg: {
    id: 'UserGroupInvitation.Field.Message',
    defaultMessage:
      'Come join my Vicc Private League to compete for great prizes!\n',
  },
  inviteMsgWithTournament: {
    id: 'UserGroupInvitation.Field.MessageWithTournament',
    defaultMessage:
      'Come join my Vicc {tournamentName} Private League to compete for great prizes!\n',
  },
});

export const generatePrivateUserGroupInvitationWording = (
  vicc5LeaderboardType?: string
) => {
  const tournamentName = extractTournamentName(vicc5LeaderboardType); // only specific tournaments have their name interpolated

  return {
    title: PrivateUserGroupInvitationMessages.inviteTitle,
    message: tournamentName
      ? PrivateUserGroupInvitationMessages.inviteMsgWithTournament
      : PrivateUserGroupInvitationMessages.inviteMsg,
    values: { tournamentName },
  };
};

const RARITY_ORDER = [
  Rarity.unique,
  Rarity.super_rare,
  Rarity.rare,
  Rarity.limited,
  Rarity.common,
  Rarity.custom_series,
  '__DEFAULT__',
];

const TOURNAMENT_TYPE_ORDER = [
  'global_kickoff',
  'global_cap',
  'global_all_star',
  'champion_europe',
  'challenger_europe',
  'second_division_europe',
  'global_under_twenty_one',
  'champion_america',
  'champion_asia',
  'global_unique_only',
  'special_weekly',
  'special_training_center',
  'legend',
  '__DEFAULT__',
  'first_division_england',
  'first_division_us',
  'first_division_spain',
  'first_division_germany',
  'first_division_italy',
  'first_division_france',
  'second_division_england',
  'second_division_spain',
  'second_division_germany',
  'second_division_italy',
  'second_division_france',
];

function sortByArrayIndexWithDefault<T>(
  array: readonly T[],
  a: T,
  b: T,
  defaultValue = '__DEFAULT__'
) {
  return sortByArrayIndex(
    array,
    !array.some(v => v === a) ? defaultValue : a,
    !array.some(v => v === b) ? defaultValue : b
  );
}

export const sortLeaderboardsByTournamentType = (
  tournamentType1: string,
  tournamentType2: string
) => {
  return sortByArrayIndexWithDefault(
    TOURNAMENT_TYPE_ORDER,
    tournamentType1,
    tournamentType2
  );
};

export const sortLeaderboards = withFragments(
  (l1: sortLeaderboards_leaderboard, l2: sortLeaderboards_leaderboard) => {
    return sortByArrayIndexWithDefault(
      RARITY_ORDER,
      l1.mainRarityType,
      l2.mainRarityType
    );
  },
  {
    leaderboard: gql`
      fragment sortLeaderboards_leaderboard on Vicc5Leaderboard {
        slug
        mainRarityType
      }
    ` as TypedDocumentNode<sortLeaderboards_leaderboard>,
  }
);
