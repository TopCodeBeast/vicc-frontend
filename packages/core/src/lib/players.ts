// TODO: ultimately this should be in SO5 instead of @sorare-core
//       but for the sake of simplicity, let's have it here for now

import { defineMessages } from 'react-intl';

import { CardQuality, Position } from '__generated__/globalTypes';

import {
  LenientPolicy,
  lenientArrayIndexComparator,
  sortByArrayIndex,
} from './arrays';

export { LenientPolicy } from './arrays';

export const formatFilterOption = (name: string) => {
  const [firstName, ...lastName] = name.split(' ');
  if (lastName.length > 0) {
    return `${firstName[0]}. ${lastName.join(' ')}`;
  }
  return firstName;
};

export const splitName = (name: string) => {
  let [firstName, ...lastNames] = name.split(' ');
  if (lastNames.length === 0) {
    [firstName, lastNames] = ['', [firstName]];
  }
  const lastLastName = lastNames[lastNames.length - 1];
  const lastName = lastNames.join(' ');

  return [firstName, lastName, lastLastName];
};

export const lineupPositions = [
  Position.Wicketkeeper,
  Position.Batsman,
  Position.Fielder,
  Position.Bowler,
  'Extra Player',
] as const;

export type LineupPosition = (typeof lineupPositions)[number];

// Changing how this array is sorted will change how the compose team go to the next available slot
export const playablePositions = [
  Position.Bowler,
  Position.Fielder,
  Position.Batsman,
  Position.Wicketkeeper,
] as const;
export type PlayablePosition = (typeof playablePositions)[number];

export const allPositions = [...playablePositions, Position.AllRounder] as const; //TODO

export const positionComparator = (
  lenientPolicy: LenientPolicy = LenientPolicy.UNKNOWN_AT_HEAD
) =>
  lenientArrayIndexComparator<PlayablePosition>(
    playablePositions,
    lenientPolicy
  );

export const sortByPosition = (
  a: PlayablePosition,
  b: PlayablePosition
): number => sortByArrayIndex(playablePositions, a, b);

export const getSortedAppearances = <T extends { card?: { position: string } }>(
  appearances: T[]
): T[] => {
  if (!appearances?.length) {
    return [];
  }
  const extraPlayerByNameIndex = appearances.findIndex(
    a => a.card?.position === 'Extra Player'
  );
  const extraPlayerIndex =
    extraPlayerByNameIndex !== -1
      ? extraPlayerByNameIndex
      : appearances.findIndex(
          (item, index, arr) =>
            arr.findIndex(i => i.card?.position === item.card?.position) !==
            index
        );

  if (extraPlayerIndex === -1) {
    const sorted = [...appearances].sort((a, b) =>
      sortByArrayIndex(
        lineupPositions,
        a.card?.position as PlayablePosition,
        b.card?.position as PlayablePosition
      )
    );
    return sorted;
  }
  const appearancesWithoutExtraPlayer = appearances.filter(
    (_, idx) => idx !== extraPlayerIndex
  );
  const sorted = appearancesWithoutExtraPlayer.sort((a, b) =>
    sortByArrayIndex(
      lineupPositions,
      a.card?.position as PlayablePosition,
      b.card?.position as PlayablePosition
    )
  );
  return [...sorted, appearances[extraPlayerIndex]];
};

export const getMissingAppearances = (
  appearances: { card: { position: string } }[]
) => {
  return [...Array(5 - appearances?.length).keys()].reduce<
    { card: { position: string } }[]
  >(prev => {
    const missingPosition = lineupPositions.find(
      position =>
        !appearances.some(({ card }) => card.position === position) &&
        !prev.some(({ card }) => card.position === position)
    );
    return [...prev, { card: { position: missingPosition ?? 'Extra Player' } }];
  }, []);
};

export const qualityNames: { [key in CardQuality]: string } = {
  TIER_0: 'Star',
  TIER_1: 'Tier 1',
  TIER_2: 'Tier 2',
  TIER_3: 'Tier 3',
  TIER_4: 'Tier 4',
  TIER_5: 'Tier 5',
};

export const positionNames = defineMessages<Position>({
  Bowler: {
    id: 'Player.forward',
    defaultMessage: 'Forward',
  },
  Fielder: {
    id: 'Player.midfielder',
    defaultMessage: 'Fielder',
  },
  Batsman: {
    id: 'Player.defender',
    defaultMessage: 'Defender',
  },
  Wicketkeeper: {
    id: 'Player.goalkeeper',
    defaultMessage: 'Wicketkeeper',
  },
  Unknown: {
    id: 'Player.unknown',
    defaultMessage: 'Unknown Position',
  },
  AllRounder: {
    id: 'Player.coach',
    defaultMessage: 'Coach',
  },
});

export const attributes = defineMessages({
  position: {
    id: 'Information.position',
    defaultMessage: 'Position',
  },
  country: {
    id: 'Information.country',
    defaultMessage: 'Country',
  },
  age: {
    id: 'Information.age',
    defaultMessage: 'Age',
  },
  appearances: {
    id: 'SeasonStats.appearances',
    defaultMessage: 'Appearances',
  },
  assists: {
    id: 'SeasonStats.assists',
    defaultMessage: 'Assists',
  },
  minPlayed: {
    id: 'SeasonStats.minPlayed',
    defaultMessage: 'Min. played',
  },
  goals: {
    id: 'SeasonStats.goals',
    defaultMessage: 'Goals',
  },
  substituteIn: {
    id: 'SeasonStats.substituteIn',
    defaultMessage: 'Substitute In',
  },
  yellowCards: {
    id: 'SeasonStats.yellowCards',
    defaultMessage: 'Yellow Cards',
  },
  substituteOut: {
    id: 'SeasonStats.substituteOut',
    defaultMessage: 'Substitute Out',
  },
  redCards: {
    id: 'SeasonStats.redCards',
    defaultMessage: 'Red Cards',
  },
});

export type PlayerScoreMode =
  | 'LATEST_SCORE'
  | 'AVERAGE_LAST_5_GAMES'
  | 'AVERAGE_LAST_15_GAMES';

export const getAverageScore = (
  mode: PlayerScoreMode,
  vicc5Scores: { score: number | null }[],
  lastFiveVicc5AverageScore: number | null,
  lastFifteenVicc5AverageScore: number | null
) => {
  switch (mode) {
    case 'LATEST_SCORE':
      return vicc5Scores[0]?.score;
    case 'AVERAGE_LAST_5_GAMES':
      return lastFiveVicc5AverageScore;
    case 'AVERAGE_LAST_15_GAMES':
      return lastFifteenVicc5AverageScore;
    default:
      return 0;
  }
};

export const getSafeAverageScore = (
  mode: PlayerScoreMode,
  vicc5Scores: { score: number | null }[],
  lastFiveVicc5AverageScore: number | null,
  lastFifteenVicc5AverageScore: number | null
) => {
  return (
    getAverageScore(
      mode,
      vicc5Scores,
      lastFiveVicc5AverageScore,
      lastFifteenVicc5AverageScore
    ) || 0
  );
};

export const getAppearancePercentage = (
  mode: PlayerScoreMode,
  player: {
    lastFiveVicc5Appearances: number | null;
    lastFifteenVicc5Appearances: number | null;
  }
) => {
  switch (mode) {
    case 'AVERAGE_LAST_5_GAMES':
      if (!player.lastFiveVicc5Appearances) {
        return 0;
      }
      return ((player.lastFiveVicc5Appearances * 100) / 5.0).toFixed(0);
    case 'AVERAGE_LAST_15_GAMES':
      if (!player.lastFifteenVicc5Appearances) {
        return 0;
      }
      return ((player.lastFifteenVicc5Appearances * 100) / 15.0).toFixed(0);
    default:
      return 0;
  }
};
