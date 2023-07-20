import { Dispatch, SetStateAction, createContext, useContext } from 'react';

import {
  AveragePlayerScore,
  RangeInput,
} from '@sorare/core/src/__generated__/globalTypes';
import { Scarcity } from '@sorare/core/src/lib/cards';

import {
  ContextProvider_card,
  ContextProvider_so5Leaderboard,
  ContextProvider_so5Lineup,
} from '@football/components/so5/ComposeTeam/ContextProvider/__generated__/index.graphql';
import { EditableAppearance, EditableLineup, Position } from '@football/lib/so5';

type ContextProvider_so5Leaderboard_displayedRules = NonNullable<
  ContextProvider_so5Leaderboard['displayedRules']
>;

export type ContextProvider_so5Lineup_so5Appearances_card =
  ContextProvider_so5Lineup['so5Appearances'][number]['card'];

export type Errors = { path: string[] | null; message: string }[] | null;

export type BenchFilters = {
  includeNoGameCards: boolean;
  includeUsedCards: boolean;
  lastFifteenVicc5AverageScore?: RangeInput;
};

const composeTeamContext = createContext<{
  initialLineupCards: string[];
  lineup: EditableLineup<ContextProvider_so5Lineup_so5Appearances_card>;
  lineupRarities: {
    [x: string]: number;
    [x: number]: number;
  };
  lineupComplete: boolean;
  addCard: (card: ContextProvider_so5Lineup_so5Appearances_card) => void;
  removeCard: (position: Position) => void;
  activePosition: Position;
  setActivePosition: (newPosition: Position) => void;
  so5Lineup: ContextProvider_so5Lineup;
  so5Leaderboard: ContextProvider_so5Leaderboard;
  toggleCaptain: (position: Position) => void;
  statsView: boolean;
  toggleStatsView: () => void;
  onClose: () => void;
  submitting: boolean;
  submit: () => Promise<any>;
  captain: EditableAppearance<ContextProvider_so5Lineup_so5Appearances_card> | null;
  needCaptain: boolean;
  captainRarities: Scarcity[];
  sortedPositions: Position[];
  search: string;
  setSearch: (value: string) => void;
  rules: ContextProvider_so5Leaderboard_displayedRules | null;
  onboarding?: boolean;
  isMobile: boolean;
  showFilters: boolean;
  filters: BenchFilters;
  setFilters: Dispatch<SetStateAction<BenchFilters>>;
  favoriteAverageScore: AveragePlayerScore;
  setFavoriteAverageScore: (scoreMode: AveragePlayerScore) => void;
  benchOpen: boolean;
  setBenchOpen: (value: boolean) => void;
  defaultAverageScore: AveragePlayerScore | null;
  setDefaultAverageScore: Dispatch<SetStateAction<AveragePlayerScore | null>>;
  displayedAverageScore: AveragePlayerScore;
  leaderboardRarities: readonly Scarcity[];
  cardsScarcities: readonly Scarcity[];
  setCardsScarcities: Dispatch<SetStateAction<readonly Scarcity[]>>;
  errors?: Errors | null;
  isCappedMode?: boolean;
  playerDetails: {
    slug: string;
    pictureUrl: string | null;
    card?: ContextProvider_card;
  } | null;
  setPlayerDetails: Dispatch<
    SetStateAction<{
      slug: string;
      pictureUrl: string | null;
      card?: ContextProvider_card;
    } | null>
  >;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  showAffordableOnly: boolean;
  setShowAffordableOnly: Dispatch<SetStateAction<boolean>>;
  averageScoreOptions: {
    value: AveragePlayerScore;
    label: string;
  }[];
  toggleAvgScore: () => void;
  customListFilter?: string;
  setCustomListFilter: (list: string | undefined) => void;
} | null>(null);

export const useComposeTeamContext = () => useContext(composeTeamContext)!;

export default composeTeamContext;
