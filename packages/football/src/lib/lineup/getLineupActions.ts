import { TypedDocumentNode, gql } from '@apollo/client';
import { isPast } from 'date-fns';

import {
  CommonDraftCampaignStatus,
  CommonDraftCampaignType,
} from '@sorare/core/src/__generated__/globalTypes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { LeaderboardAction } from '@football/types/leaderboard';

import {
  getLineupActions_vicc5Leaderboard,
  getLineupActions_vicc5Lineup,
} from './__generated__/getLineupActions.graphql';

const defaultValues = {
  availableActions: [],
  tooManyCards: false,
};
const getLineupActions = withFragments(
  (
    vicc5Lineup: Nullable<getLineupActions_vicc5Lineup>,
    vicc5Leaderboard: Nullable<getLineupActions_vicc5Leaderboard>
  ): {
    availableActions: LeaderboardAction[];
    tooManyCards: boolean;
  } => {
    if (!vicc5Leaderboard) {
      return defaultValues;
    }

    const { myVicc5Lineups, teamsCap, startDate } = vicc5Leaderboard;

    if (isPast(new Date(startDate))) {
      return {
        ...defaultValues,
        availableActions: vicc5Lineup?.draft ? [] : [LeaderboardAction.Share],
      };
    }

    const { canCompose } = vicc5Leaderboard;

    const showRedraft =
      vicc5Leaderboard.commonDraftCampaign?.status ===
      CommonDraftCampaignStatus.REDRAFTABLE;
    const showSwap =
      vicc5Leaderboard.commonDraftCampaign?.status ===
      CommonDraftCampaignStatus.SWAPPABLE;
    const showDraft =
      vicc5Leaderboard.commonDraftCampaign?.status ===
      CommonDraftCampaignStatus.OPEN;
    const showExtraDraft =
      vicc5Leaderboard.commonDraftCampaign?.campaignType ===
      CommonDraftCampaignType.EXTRA;
    const showEdit = !!vicc5Lineup;
    const showDelete = !!vicc5Lineup;
    const capHit = myVicc5Lineups.length === teamsCap;
    const showCompose = canCompose.value && !(showDraft || showEdit || capHit);

    const locked = !canCompose.value && !(showDraft || showRedraft || showSwap);

    const showUnlock = locked && canCompose.notEnoughEligibleCards;

    const showConfirm =
      !showUnlock && vicc5Lineup?.confirmable && vicc5Lineup?.draft;

    const tooManyCards = locked && !canCompose.notEnoughEligibleCards;

    const availableActions = Object.entries({
      [LeaderboardAction.Draft]: showDraft,
      [LeaderboardAction.Redraft]: showRedraft,
      [LeaderboardAction.ExtraDraft]: showExtraDraft,
      [LeaderboardAction.Compose]: showCompose,
      [LeaderboardAction.Swap]: showSwap,
      [LeaderboardAction.Edit]: showEdit,
      [LeaderboardAction.Delete]: showDelete,
      [LeaderboardAction.Unlock]: locked && !tooManyCards,
      [LeaderboardAction.Confirm]: showConfirm,
      [LeaderboardAction.Share]: !vicc5Lineup?.draft,
    })
      .filter(entry => entry[1])
      .map(([key]) => key as LeaderboardAction);

    return {
      availableActions,
      tooManyCards: locked && tooManyCards,
    };
  },
  {
    vicc5Lineup: gql`
      fragment getLineupActions_vicc5Lineup on Vicc5Lineup {
        id
        draft
        confirmable
      }
    ` as TypedDocumentNode<getLineupActions_vicc5Lineup>,
    vicc5Leaderboard: gql`
      fragment getLineupActions_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        teamsCap
        startDate
        endDate
        canCompose {
          value
          notEnoughEligibleCards
        }
        commonDraftCampaign {
          slug
          status
          campaignType
        }
        myVicc5Lineups {
          id
        }
      }
    ` as TypedDocumentNode<getLineupActions_vicc5Leaderboard>,
  }
);

export default getLineupActions;
