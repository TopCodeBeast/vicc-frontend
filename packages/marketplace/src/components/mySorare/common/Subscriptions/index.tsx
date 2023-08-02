import { TypedDocumentNode, gql } from '@apollo/client';
import { ElementType, useMemo } from 'react';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { groupBy } from '@sorare/core/src/lib/arrays';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import Follow from '../Follow';
import { UnfollowableSubscription } from '../Follow/types';
import { Subscriptions_subscription } from './__generated__/index.graphql';

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
  const itemsBySlug = false;

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
