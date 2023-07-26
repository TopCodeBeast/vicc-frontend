import { gql } from '@apollo/client';
import { createContext, useContext } from 'react';

export interface PageContext {
  object: {
    __typename: string;
    slug: string;
    currentUserSubscription?: {
      __typename: 'EmailSubscription';
      slug: string;
      preferences: {
        __typename: 'EmailSubscriptionPreferences';
        slug: string;
        notifyForRarities: string[];
      };
    } | null;
  };
}

export const pageContext = createContext<PageContext | null>(null);

export const usePageContext = () => useContext(pageContext)!;

export default pageContext.Provider;

export const pageContextFragments = {
  subscribable: gql`
    fragment PageContext_subscribable on WithSubscriptionsInterface {
      slug
      subscriptionsCount
      currentUserSubscription {
        slug
        preferences {
          slug
          notifyForRarities
        }
      }
    }
  `,
};
