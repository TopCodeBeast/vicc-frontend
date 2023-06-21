import { gql } from '@apollo/client';
import { isPast } from 'date-fns';

import {
  CommonDraftCampaignStatus,
  CommonDraftCampaignType,
} from '@sorare/core/src/__generated__/globalTypes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { LeaderboardAction } from '@football/types/leaderboard';

import {
  getLineupActions_so5Leaderboard,
  getLineupActions_so5Lineup,
} from './__generated__/getLineupActions.graphql';

const defaultValues = {
  availableActions: [],
  tooManyCards: false,
};
const getLineupActions = withFragments(
  (
    so5Lineup: Nullable<getLineupActions_so5Lineup>,
    so5Leaderboard: Nullable<getLineupActions_so5Leaderboard>
  ): {
    availableActions: LeaderboardAction[];
    tooManyCards: boolean;
  } => {
    if (!so5Leaderboard) {
      return defaultValues;
    }

    const { mySo5Lineups, teamsCap, startDate } = so5Leaderboard;

    if (isPast(new Date(startDate))) {
      return {
        ...defaultValues,
        availableActions: so5Lineup?.draft ? [] : [LeaderboardAction.Share],
      };
    }

    const { canCompose } = so5Leaderboard;

    const showRedraft =
      so5Leaderboard.commonDraftCampaign?.status ===
      CommonDraftCampaignStatus.REDRAFTABLE;
    const showSwap =
      so5Leaderboard.commonDraftCampaign?.status ===
      CommonDraftCampaignStatus.SWAPPABLE;
    const showDraft =
      so5Leaderboard.commonDraftCampaign?.status ===
      CommonDraftCampaignStatus.OPEN;
    const showExtraDraft =
      so5Leaderboard.commonDraftCampaign?.campaignType ===
      CommonDraftCampaignType.EXTRA;
    const showEdit = !!so5Lineup;
    const showDelete = !!so5Lineup;
    const capHit = mySo5Lineups.length === teamsCap;
    const showCompose = canCompose.value && !(showDraft || showEdit || capHit);

    const locked = !canCompose.value && !(showDraft || showRedraft || showSwap);

    const showUnlock = locked && canCompose.notEnoughEligibleCards;

    const showConfirm =
      !showUnlock && so5Lineup?.confirmable && so5Lineup?.draft;

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
      [LeaderboardAction.Share]: !so5Lineup?.draft,
    })
      .filter(entry => entry[1])
      .map(([key]) => key as LeaderboardAction);

    return {
      availableActions,
      tooManyCards: locked && tooManyCards,
    };
  },
  {
    so5Lineup: gql`
      fragment getLineupActions_so5Lineup on So5Lineup {
        id
        draft
        confirmable
      }
    `,
    so5Leaderboard: gql`
      fragment getLineupActions_so5Leaderboard on So5Leaderboard {
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
        mySo5Lineups {
          id
        }
      }
    `,
  }
);

export default getLineupActions;
