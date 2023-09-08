import { Dispatch, useReducer } from 'react';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import {
  findIndexStartingFrom,
  findLastIndex,
} from '@sorare/core/src/lib/arrays';

import { Action as FiltersAction } from './DraftFilters/useFiltersReducer';
import { UpsertCommonDraftInputMutation } from './Picker/__generated__/useUpsertDraft.graphql';
import {
  DraftAutofillQuery,
  DraftQuery,
} from './__generated__/queries.graphql';

type AutoPick = NonNullable<
  DraftAutofillQuery['vicc5']['vicc5Leaderboard']['commonDraftCampaign']
>['autoPick'][number];

export type Player = NonNullable<
  DraftQuery['vicc5']['vicc5Leaderboard']['commonDraftCampaign']
>['availablePlayers']['nodes'][number];

type UpsertCommonDraftInputMutation_upsertCommonDraft_draftError = NonNullable<
  NonNullable<UpsertCommonDraftInputMutation['upsertCommonDraft']>['draftError']
>;

type Action =
  | { type: 'paginate'; payload: number }
  | { type: 'changeSelectedPosition'; payload: number }
  | { type: 'changeSelectedPositionType'; payload: Position }
  | {
      type: 'error';
      payload: UpsertCommonDraftInputMutation_upsertCommonDraft_draftError;
    }
  | {
      type: 'addPlayer';
      payload: Player;
    }
  | { type: 'nextPosition'; payload?: null }
  | { type: 'removePlayer'; payload: string }
  | { type: 'clear'; payload?: null }
  | { type: 'autoFill'; payload: AutoPick[] }
  | { type: 'closeError'; payload?: null };

export type Draft = { position: Position; drafted?: AutoPick | Player }[];
export type State = {
  draft: Draft;
  selectedPlayersInError: string[];
  errorMessage?: string;
  errorCode?: number;
  activePosition: number;
  page: number;
};

const defaultValues = {
  draft: [],
  activePosition: 0,
  page: 0,
  selectedPlayersInError: [],
};

const getNextPosition = (draft: Draft, activePosition: number): number => {
  const emptyPositionOfSameType = draft.findIndex(({ drafted, position }) => {
    const currentPositionType = draft[activePosition].position;
    return !drafted && position === currentPositionType;
  });
  if (emptyPositionOfSameType > -1) {
    return emptyPositionOfSameType;
  }

  const nextEmptyPosition = findIndexStartingFrom(
    draft,
    activePosition,
    ({ drafted }) => !drafted
  );
  if (nextEmptyPosition > -1) {
    return nextEmptyPosition;
  }

  const emptyPosition = draft.findIndex(({ drafted }) => !drafted);
  if (emptyPosition > -1) {
    return emptyPosition;
  }

  return activePosition;
};

const useDraftReducer = (
  positions: Position[],
  storedDraft: Draft,
  draftedPlayers: Player[],
  filtersDispatch: Dispatch<FiltersAction>
): [State, Dispatch<Action>] => {
  const draftedPlayerPerPosition = draftedPlayers.reduce<{
    [key in string]: Player[];
  }>((acc, curr) => {
    const { position } = curr;
    if (!acc[position]) acc[position] = [];
    acc[position].push(curr);
    return acc;
  }, {});
  const [stateDraft, dispatch] = useReducer(
    (state: State, action: Action): State => {
      const { type, payload } = action;
      switch (type) {
        case 'paginate': {
          return {
            ...state,
            page: payload,
          };
        }
        case 'changeSelectedPosition': {
          return {
            ...state,
            activePosition: payload,
            page: 0,
          };
        }
        case 'changeSelectedPositionType': {
          const { draft, activePosition } = state;
          const currentPositionType = draft[activePosition].position;
          if (currentPositionType === payload) {
            return state;
          }
          const firstEmptyMatchingPosition = draft.findIndex(
            ({ position, drafted }) => position === payload && !drafted
          );
          if (firstEmptyMatchingPosition > -1) {
            return {
              ...state,
              activePosition: firstEmptyMatchingPosition,
            };
          }
          const lastFilledMatchingPosition = findLastIndex(
            draft,
            ({ position }) => position === payload
          );

          return {
            ...state,
            activePosition: lastFilledMatchingPosition,
          };
        }
        case 'addPlayer': {
          const newDraft = [...state.draft];
          newDraft[state.activePosition] = {
            ...newDraft[state.activePosition],
            drafted: payload,
          };
          filtersDispatch({ type: 'clearSearch' });
          return {
            ...state,
            draft: newDraft,
            page: 0,
            selectedPlayersInError: [],
            errorMessage: undefined,
          };
        }
        case 'nextPosition': {
          return {
            ...state,
            activePosition: getNextPosition(state.draft, state.activePosition),
          };
        }
        case 'removePlayer': {
          let removedPosition = 0;
          const newDraft = state.draft.map(({ position, drafted }, index) => {
            if (drafted?.id === payload) {
              removedPosition = index;
              return { position };
            }
            return { position, drafted };
          });
          return {
            ...state,
            draft: newDraft,
            activePosition: removedPosition,
            page: 0,
            selectedPlayersInError: [],
            errorMessage: undefined,
          };
        }
        case 'autoFill': {
          const newDraft = [...state.draft];
          payload.forEach(autoFilled => {
            const foundIndex = newDraft.findIndex(
              ({ position, drafted }) =>
                !drafted && position === autoFilled.position
            );
            newDraft[foundIndex] = {
              position: autoFilled.position,
              drafted: autoFilled,
            };
          });
          return {
            ...state,
            draft: newDraft,
            activePosition: findLastIndex(
              state.draft,
              ({ drafted }) => !drafted
            ),
            selectedPlayersInError: [],
            errorMessage: undefined,
          };
        }
        case 'clear': {
          return {
            draft: state.draft.map(({ position }) => ({ position })),
            activePosition: 0,
            page: 0,
            selectedPlayersInError: [],
            errorMessage: undefined,
          };
        }
        case 'error': {
          return {
            ...state,
            selectedPlayersInError: payload.printablePlayers.map(pp => pp.id),
            errorMessage: payload.error,
            errorCode: payload.code,
          };
        }
        case 'closeError': {
          return {
            ...state,
            errorMessage: undefined,
            errorCode: undefined,
          };
        }
        default:
          return state;
      }
    },
    {
      ...defaultValues,
      draft:
        draftedPlayers?.length || !storedDraft.length
          ? positions.map(position => ({
              position,
              drafted: draftedPlayerPerPosition[position]?.pop(),
            }))
          : storedDraft,
    }
  );

  return [stateDraft, dispatch];
};

export default useDraftReducer;
