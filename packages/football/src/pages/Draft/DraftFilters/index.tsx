import { TypedDocumentNode, gql } from '@apollo/client';
import { Dispatch, ReactNode } from 'react';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';

import DesktopFilters from './DesktopFilters';
import MobileFilters from './MobileFilters';
import { Filters_team } from './__generated__/index.graphql';
import { Action, State } from './useFiltersReducer';

type Props = {
  teams?: Filters_team[];
  state: State;
  dispatch: Dispatch<Action>;
  currentPosition: Position;
  children?: ReactNode;
};

export const DraftFilters = ({
  teams,
  state,
  dispatch,
  currentPosition,
  children,
}: Props) => {
  const { up: isDesktop } = useScreenSize('tablet');

  return isDesktop ? (
    <DesktopFilters
      teams={teams}
      state={state}
      dispatch={dispatch}
      currentPosition={currentPosition}
    >
      {children}
    </DesktopFilters>
  ) : (
    <MobileFilters
      teams={teams}
      state={state}
      dispatch={dispatch}
      currentPosition={currentPosition}
    >
      {children}
    </MobileFilters>
  );
};

export default DraftFilters;

DraftFilters.fragments = {
  teams: gql`
    fragment Filters_team on Team {
      ...MobileFilters_team
      ...DesktopFilters_team
    }
    ${MobileFilters.fragments.teams}
    ${DesktopFilters.fragments.teams}
  ` as TypedDocumentNode<Filters_team>,
};
