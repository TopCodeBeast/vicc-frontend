import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useState } from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { CommonDraftCampaignStatus } from '@sorare/core/src/__generated__/globalTypes';
import ComposeCta from '@sorare/core/src/components/lobby/LineupActions/ComposeCta';
import ConfirmCta from '@sorare/core/src/components/lobby/LineupActions/ConfirmCta';
import DeleteCta from '@sorare/core/src/components/lobby/LineupActions/DeleteCta';
import DraftCta from '@sorare/core/src/components/lobby/LineupActions/DraftCta';
import EditCta from '@sorare/core/src/components/lobby/LineupActions/EditCta';
import RedraftCta from '@sorare/core/src/components/lobby/LineupActions/RedraftCta';
import SwapCta from '@sorare/core/src/components/lobby/LineupActions/SwapCta';
import {
  FOOTBALL_DRAFT,
  getComposeTeamRoute,
} from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { getInteractionContext } from '@sorare/core/src/lib/events';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { LockedCompetitionAction } from '@football/components/competition/LockedCompetitionAction';
import useConfirmLineups from '@football/hooks/so5/useConfirmLineups';
import useDeleteLineup from '@football/hooks/so5/useDeleteLineup';

import { Lobby_LineupActions_vicc5Leaderboard } from './__generated__/index.graphql';

const Root = styled.aside`
  display: flex;
  gap: var(--half-unit);
  justify-content: center;
  /** Target mostly the register button */
  & > *:first-child:last-child {
    flex: 1;
  }

  @media ${tabletAndAbove} {
    justify-content: flex-end;
    & > *:first-child:last-child {
      flex: unset;
    }
  }
`;

const MobileLockedCompetitionAction = styled.div`
  display: block;
  @media ${laptopAndAbove} {
    display: none;
  }
`;

type Props = {
  vicc5Leaderboard: Lobby_LineupActions_vicc5Leaderboard;
  onDelete?: (id: string) => void;
  onConfirm?: (id: string) => void;
  lineupId?: string;
};

const LineupActions = ({
  vicc5Leaderboard,
  onDelete,
  onConfirm,
  lineupId,
}: Props) => {
  const [loadingState, setLoadingState] = useState<
    | {
        [key in 'confirming' | 'deleting']?: string;
      }
    | null
  >(null);
  const deleteLineup = useDeleteLineup();
  const confirmedLineups = useConfirmLineups();
  const doDeleteLineup = useCallback(
    async (id: string) => {
      setLoadingState({ deleting: id });
      await deleteLineup(id);
      setLoadingState(null);
      if (onDelete) {
        onDelete(id);
      }
    },
    [deleteLineup, onDelete]
  );
  const doConfirmedLineups = useCallback(
    async (id: string) => {
      setLoadingState({ confirming: id });
      await confirmedLineups([id]);
      setLoadingState(null);
      if (onConfirm) {
        onConfirm(id);
      }
    },
    [confirmedLineups, onConfirm]
  );
  const track = useEvents();

  if (!vicc5Leaderboard) {
    return null;
  }

  const { myVicc5Lineups, teamsCap } = vicc5Leaderboard;
  const lineup =
    myVicc5Lineups.find(({ id }) => id === lineupId) || myVicc5Lineups[0];
  const { canCompose } = vicc5Leaderboard;
  const draftUrl = generatePath(FOOTBALL_DRAFT, { slug: vicc5Leaderboard.slug });

  const showRedraft =
    vicc5Leaderboard.commonDraftCampaign?.status ===
    CommonDraftCampaignStatus.REDRAFTABLE;
  const showSwap =
    vicc5Leaderboard.commonDraftCampaign?.status ===
    CommonDraftCampaignStatus.SWAPPABLE;
  const showDraft =
    vicc5Leaderboard.commonDraftCampaign?.status ===
    CommonDraftCampaignStatus.OPEN;

  const showUnlock =
    !canCompose.value && !(showDraft || showRedraft || showSwap);
  const showEdit = !showUnlock && !!lineup;
  const showDelete = !!lineup;
  const showConfirm = !showUnlock && lineup?.confirmable && lineup?.draft;
  const capHit = myVicc5Lineups.length === teamsCap;
  const showCompose = !showUnlock && !(showDraft || showEdit || capHit);

  return (
    <Root>
      {showUnlock && (
        <LockedCompetitionAction
          vicc5Leaderboard={vicc5Leaderboard}
          Wrapper={MobileLockedCompetitionAction}
        />
      )}
      {showSwap && (
        <SwapCta
          onTrack={() => {
            track('Click Swap', {
              context: getInteractionContext(),
            });
          }}
          vicc5Leaderboard={vicc5Leaderboard}
        />
      )}
      {showRedraft && (
        <RedraftCta url={draftUrl} hideLabelOnMobile={!showCompose} />
      )}
      {showDraft && <DraftCta url={draftUrl} />}
      {showDelete && (
        <DeleteCta
          showLoader={loadingState?.deleting === lineup.id}
          onDelete={() => {
            doDeleteLineup(lineup.id);
          }}
        />
      )}
      {showEdit && (
        <EditCta
          onTrack={() => {
            track('Click Edit Lineup', {
              context: getInteractionContext(),
            });
          }}
          editUrl={getComposeTeamRoute({
            vicc5LeaderboardSlug: vicc5Leaderboard.slug,
            vicc5LineupId: idFromObject(lineup?.id),
          })}
        />
      )}
      {showConfirm && (
        <ConfirmCta
          onClick={() => {
            doConfirmedLineups(lineup.id);
          }}
          showLoader={loadingState?.deleting === lineup.id}
        />
      )}
      {showCompose && (
        <ComposeCta
          onTrack={() => {
            track('Click Compose Lineup', {
              context: getInteractionContext(),
            });
          }}
          url={getComposeTeamRoute({
            vicc5LeaderboardSlug: vicc5Leaderboard.slug,
          })}
        />
      )}
    </Root>
  );
};

LineupActions.fragments = {
  vicc5Leaderboard: gql`
    fragment Lobby_LineupActions_vicc5Leaderboard on Vicc5Leaderboard {
      id
      slug
      rarityType
      displayName
      teamsCap
      commonDraftCampaign {
        slug
        status
        campaignType
      }
      ...SwapCta_vicc5Leaderboard
      canCompose {
        value
      }
      myVicc5Lineups {
        id
        draft
        confirmable
      }
      ...LockedCompetitionAction_vicc5Leaderboard
    }
    ${SwapCta.fragments.vicc5Leaderboard}
    ${LockedCompetitionAction.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<Lobby_LineupActions_vicc5Leaderboard>,
};

export default LineupActions;
