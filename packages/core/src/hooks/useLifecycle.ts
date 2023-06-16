import { gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { CommonDraftCampaignType, Sport } from '__generated__/globalTypes';
import { AlgoliaCardIndexesName } from '../contexts/config';
import { getInteractionContext } from '../lib/events';

import {
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
  nextTimeUserNeedsSetupWallet = 'nextTimeUserNeedsSetupWallet',
  sawUsSportsCollectionsTuto = 'sawUsSportsCollectionsTuto',
  lastSaleDuration = 'lastSaleDuration',
  sawMlbDraftErrorPrompt = 'sawMlbDraftErrorPrompt',
  sawMlbComposeTeamOnboarding = 'sawMlbComposeTeamOnboarding',
  latestSeasonFilterEnabled = 'latestSeasonFilterEnabled',
  latestSearchedItems = 'latestSearchedItems',
  sawMlbOnboarding = 'sawMlbOnboarding',
  sawNbaOnboarding = 'sawNbaOnboarding',
  marketSorts = 'marketSorts',
  sawMlbDraftEducationDialog = 'sawMlbDraftEducationDialog',
  saw100PersonLeaderboardDialog = 'saw100PersonLeaderboardDialog',
  hideActivity = 'hideActivity',
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
  [LIFECYCLE.nextTimeUserNeedsSetupWallet]?: string;
  [LIFECYCLE.sawUsSportsCollectionsTuto]?: boolean;
  [LIFECYCLE.lastSaleDuration]?: number;
  [LIFECYCLE.sawMlbDraftErrorPrompt]?: boolean;
  [LIFECYCLE.sawMlbComposeTeamOnboarding]?: boolean;
  [LIFECYCLE.saw100PersonLeaderboardDialog]?: boolean;
  [LIFECYCLE.latestSeasonFilterEnabled]?: boolean;
  [LIFECYCLE.latestSearchedItems]?: {
    [sport: string]: {
      objectID: string;
      index: string;
      sport: Sport;
    }[];
  };
  [LIFECYCLE.sawMlbOnboarding]?: boolean;
  [LIFECYCLE.sawNbaOnboarding]?: boolean;
  [LIFECYCLE.marketSorts]?: Record<string, AlgoliaCardIndexesName>;
  [LIFECYCLE.sawMlbDraftEducationDialog]?: boolean;
  [LIFECYCLE.hideActivity]?: boolean;
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
      errors {
        path
        message
        code
      }
    }
  }
`;

export default function useLifecycle() {
  const [updateLifecycle, { loading }] = useMutation<
    UpdateLifecycleMutation,
    UpdateLifecycleMutationVariables
  >(UPDATE_LIFECYCLE_MUTATION);

  const update = useCallback(
    <K extends keyof LifecycleEntries>(
      name: K,
      value: Omit<LifecycleEntries[K], 'undefined'>
    ) => {
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
    [updateLifecycle]
  );

  return {
    update,
    loading,
  };
}
