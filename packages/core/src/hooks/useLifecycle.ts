import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { CommonDraftCampaignType, Sport } from '__generated__/globalTypes';
import { AlgoliaCardIndexesName } from '@core/contexts/config';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { getInteractionContext } from '@core/lib/events';

import {
  CurrentUserLifecycleQuery,
  CurrentUserLifecycleQueryVariables,
  UpdateLifecycleMutation,
  UpdateLifecycleMutationVariables,
} from './__generated__/useLifecycle.graphql';

export enum LIFECYCLE {
  sawComposeOnboarding = 'sawComposeOnboarding',
  sawCaptainTuto = 'sawCaptainTuto',
  sawCollectionCardTuto = 'sawCollectionCardTuto',
  sawMarketplaceOnboarding = 'sawMarketplaceOnboarding',
  sawManagersSalesOnboarding = 'sawManagersSalesOnboarding',
  sawStarterPacksOnboarding = 'sawStarterPacksOnboarding',
  sawComposeTeamCongrats = 'sawComposeTeamCongrats',
  sawDraftTuto = 'sawDraftTuto',
  transferMarket = 'transferMarket',
  newSignings = 'newSignings',
  lastVisitedSport = 'lastVisitedSport',
  nextTimeUserNeedsCheckSecurity = 'nextTimeUserNeedsCheckSecurity',
  userHasSetupWallet = 'userHasSetupWallet',
  sawUsSportsCollectionsDialog = 'sawUsSportsCollectionsDialog',
  lastSaleDuration = 'lastSaleDuration',
  sawMlbDraftErrorPrompt = 'sawMlbDraftErrorPrompt',
  sawMlbComposeTeamOnboarding = 'sawMlbComposeTeamOnboarding',
  latestSeasonFilterEnabled = 'latestSeasonFilterEnabled',
  latestSearchedItems = 'latestSearchedItems',
  sawMlbOnboarding = 'sawMlbOnboarding',
  sawMlbDraftWelcome = 'sawMlbDraftWelcome',
  sawNbaOnboarding = 'sawNbaOnboarding',
  marketSorts = 'marketSorts',
  sawMlbDraftEducationDialog = 'sawMlbDraftEducationDialog',
  saw100PersonLeaderboardDialog = 'saw100PersonLeaderboardDialog',
  sawDailyExhibitionsDialog = 'sawDailyExhibitionsDialog',
  hideActivity = 'hideActivity',
  hideOnlineStatus = 'hideOnlineStatus',
  sawNewCustomListTuto = 'sawNewCustomListTuto',
  sawMinorsUnlockedDialog = 'sawMinorsUnlockedDialog',
  sawCommonLevel1UnlockedDialog = 'sawCommonLevel1UnlockedDialog',
  sawCommonLevel2UnlockedDialog = 'sawCommonLevel2UnlockedDialog',
  sawCommonLevel3UnlockedDialog = 'sawCommonLevel3UnlockedDialog',
  sawCommonLevel4UnlockedDialog = 'sawCommonLevel4UnlockedDialog',
  sawCommonLevel5UnlockedDialog = 'sawCommonLevel5UnlockedDialog',
  sawRewardUnlockedDialog = 'sawRewardsUnlockedDialog',
}

export type LifecycleEntries = {
  [LIFECYCLE.sawComposeOnboarding]?: boolean;
  [LIFECYCLE.sawCaptainTuto]?: boolean;
  [LIFECYCLE.sawCollectionCardTuto]?: boolean;
  [LIFECYCLE.sawMarketplaceOnboarding]?: boolean;
  [LIFECYCLE.sawManagersSalesOnboarding]?: boolean;
  [LIFECYCLE.sawStarterPacksOnboarding]?: boolean;
  [LIFECYCLE.sawComposeTeamCongrats]?: boolean;
  [LIFECYCLE.sawDraftTuto]?: CommonDraftCampaignType;
  [LIFECYCLE.transferMarket]?: string;
  [LIFECYCLE.newSignings]?: string;
  [LIFECYCLE.lastVisitedSport]?: Sport;
  [LIFECYCLE.nextTimeUserNeedsCheckSecurity]?: string;
  [LIFECYCLE.userHasSetupWallet]?: boolean;
  [LIFECYCLE.sawUsSportsCollectionsDialog]?: boolean;
  [LIFECYCLE.lastSaleDuration]?: number;
  [LIFECYCLE.sawMlbDraftErrorPrompt]?: boolean;
  [LIFECYCLE.sawMlbComposeTeamOnboarding]?: boolean;
  [LIFECYCLE.saw100PersonLeaderboardDialog]?: boolean;
  [LIFECYCLE.sawDailyExhibitionsDialog]?: boolean;
  [LIFECYCLE.latestSeasonFilterEnabled]?: boolean;
  [LIFECYCLE.latestSearchedItems]?: {
    [sport: string]: {
      objectID: string;
      index: string;
      sport: Sport;
    }[];
  };
  [LIFECYCLE.sawMlbOnboarding]?: boolean;
  [LIFECYCLE.sawMlbDraftWelcome]?: boolean;
  [LIFECYCLE.sawNbaOnboarding]?: boolean;
  [LIFECYCLE.marketSorts]?: Record<string, AlgoliaCardIndexesName>;
  [LIFECYCLE.sawMlbDraftEducationDialog]?: boolean;
  [LIFECYCLE.hideActivity]?: boolean;
  [LIFECYCLE.sawNewCustomListTuto]?: boolean;
  [LIFECYCLE.hideOnlineStatus]?: boolean;
  [LIFECYCLE.sawMinorsUnlockedDialog]?: boolean;
  [LIFECYCLE.sawCommonLevel1UnlockedDialog]?: boolean;
  [LIFECYCLE.sawCommonLevel2UnlockedDialog]?: boolean;
  [LIFECYCLE.sawCommonLevel3UnlockedDialog]?: boolean;
  [LIFECYCLE.sawCommonLevel4UnlockedDialog]?: boolean;
  [LIFECYCLE.sawCommonLevel5UnlockedDialog]?: boolean;
  [LIFECYCLE.sawRewardUnlockedDialog]?: boolean;
};

export type Lifecycle = LifecycleEntries | undefined;
export type LifecycleValue = LifecycleEntries[LIFECYCLE];
export type LifecycleGetter = LifecycleValue;

export const getMarketplaceSortsKey = (sport: Sport, unstacked: boolean) =>
  `${sport.toLocaleLowerCase()}_${getInteractionContext()}${
    unstacked ? '_unstacked' : ''
  }`;

const UPDATE_LIFECYCLE_MUTATION = gql`
  mutation UpdateLifecycleMutation($input: updateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      userSettings {
        id
        lifecycle
      }
      currentUser {
        slug
        active
      }
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  UpdateLifecycleMutation,
  UpdateLifecycleMutationVariables
>;

// The lifecycle within useCurrentUserContext is not always up-to-date:
// using that won't explicitly trigger another fetch upon rendering
// + caching mechanism in apollo make state changes on the backend having
// a lag to be reflected on the client.
export const CURRENT_USER_LIFECYCLE_QUERY = gql`
  query CurrentUserLifecycleQuery {
    currentUser {
      slug
      userSettings {
        id
        lifecycle
      }
    }
  }
` as TypedDocumentNode<
  CurrentUserLifecycleQuery,
  CurrentUserLifecycleQueryVariables
>;

export default function useLifecycle() {
  const { currentUser } = useCurrentUserContext();
  const [updateLifecycle, { loading }] = useMutation(UPDATE_LIFECYCLE_MUTATION);

  const update = useCallback(
    <K extends keyof LifecycleEntries>(
      name: K,
      value: Omit<LifecycleEntries[K], 'undefined'>
    ) => {
      if (!currentUser?.slug) {
        return;
      }
      updateLifecycle({
        variables: {
          input: {
            lifecycle: {
              name,
              value,
            },
          },
        },
      });
    },
    [updateLifecycle, currentUser?.slug]
  );

  return {
    update,
    loading,
  };
}
