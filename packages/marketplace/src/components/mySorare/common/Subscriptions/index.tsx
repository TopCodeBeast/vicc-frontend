import { TypedDocumentNode, gql } from '@apollo/client';
import { ElementType, useMemo } from 'react';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { groupBy } from '@sorare/core/src/lib/arrays';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import Follow from '../Follow';
import { UnfollowableSubscription } from '../Follow/types';
import { Subscriptions_subscription } from './__generated__/index.graphql';
import useBaseballSubscriptionItems from './useBaseballSubscriptionItems';
import useNBASubscriptionItems from './useNBASubscriptionItems';
import useSo5SubscriptionItems from './useSo5SubscriptionItems';

interface Props {
  subscriptions: UnfollowableSubscription[];
  ItemComponent: ElementType;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Subscriptions = ({
  subscriptions,
  ItemComponent = Follow,
}: Props) => {
  const { so5SubscriptionsInput, so5CachedData } = useSo5SubscriptionItems({
    subscriptions,
  });
  const { baseballSubscriptionsInput, baseballCachedData } =
    useBaseballSubscriptionItems({
      subscriptions,
    });
  const { nbaSubscriptionsInput, nbaCachedData } = useNBASubscriptionItems({
    subscriptions,
  });

  const itemsBySlug = useMemo(() => {
    if (
      (so5SubscriptionsInput.length > 0 && !so5CachedData) ||
      (baseballSubscriptionsInput.length > 0 && !baseballCachedData) ||
      (nbaSubscriptionsInput.length > 0 && !nbaCachedData)
    )
      return null;
    return {
      ...(so5CachedData &&
        groupBy(t => t!.slug, Object.values(so5CachedData).flat())),
      ...(baseballCachedData &&
        groupBy(t => t!.slug, Object.values(baseballCachedData).flat())),
      ...(nbaCachedData &&
        groupBy(t => t!.slug, Object.values(nbaCachedData).flat())),
    };
  }, [
    so5CachedData,
    baseballCachedData,
    nbaCachedData,
    so5SubscriptionsInput,
    baseballSubscriptionsInput,
    nbaSubscriptionsInput,
  ]);

  if (!subscriptions || subscriptions.length === 0) return null;

  if (!itemsBySlug) {
    return <LoadingIndicator />;
  }

  return (
    <Root>
      {subscriptions.map(follow => {
        if (!itemsBySlug[follow.subscribableSlug]) return null;
        return (
          <ItemComponent
            key={follow.slug}
            subscription={follow}
            item={itemsBySlug[follow.subscribableSlug][0]}
          />
        );
      })}
    </Root>
  );
};

Subscriptions.fragments = {
  subscription: gql`
    fragment Subscriptions_subscription on EmailSubscription {
      id
      subscribableSlug
      subscribableType
      slug
    }
  ` as TypedDocumentNode<Subscriptions_subscription>,
};

export default Subscriptions;
