import { createContext, useContext } from 'react';

import { Sport } from '__generated__/globalTypes';

import { FollowQuery } from './__generated__/Provider.graphql';

type FollowQuery_currentUser_mySubscriptions_nodes = NonNullable<
  FollowQuery['currentUser']
>['mySubscriptions']['nodes'][number];

export type GetCurrentUserSubscriptionProps = {
  __typename: string;
  slug: string;
};

export interface FollowContext {
  mySubscriptions: FollowQuery_currentUser_mySubscriptions_nodes[] | undefined;
  mySubscriptionsLoaded: boolean;
  favoriteCards: FollowQuery_currentUser_mySubscriptions_nodes[] | undefined;
  favoriteCardsBySport: Record<
    Sport,
    FollowQuery_currentUser_mySubscriptions_nodes[]
  >;
  favoritePlayers: FollowQuery_currentUser_mySubscriptions_nodes[] | undefined;
  favoritePlayersBySport: Record<
    Sport,
    FollowQuery_currentUser_mySubscriptions_nodes[]
  >;
  addToMySubscriptions: (
    subscription: FollowQuery_currentUser_mySubscriptions_nodes
  ) => void;
  removeFromMySubscriptions: (slug: string) => void;
  updateMySubscriptions: (
    subscription: FollowQuery_currentUser_mySubscriptions_nodes
  ) => void;
  getCurrentUserSubscription: ({
    __typename,
    slug,
  }: GetCurrentUserSubscriptionProps) => FollowQuery_currentUser_mySubscriptions_nodes | null;
}

export const followContext = createContext<FollowContext | null>(null);

export const useFollowContext = () => useContext(followContext)!;

export default followContext.Provider;
