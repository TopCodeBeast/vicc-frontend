import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import FollowButton from '@sorare/core/src/components/user/FollowButton';
import { US_SPORTS_FOLLOW_FRAGMENTS } from '@sorare/core/src/lib/usSportsGraphql/queries';

import FollowDescription from './FollowDescription';
import {
  Follow_club,
  Follow_country,
  Follow_player,
  Follow_subscription,
} from './__generated__/index.graphql';

interface Props {
  subscription: Follow_subscription;
  item: Follow_player | Follow_club | Follow_country;
}

const Root = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Follow = ({ subscription, item }: Props) => {
  return (
    <Root>
      <FollowDescription followedItem={item} />
      <FollowButton
        medium
        subscribable={item!}
        initialSubscription={subscription}
      />
    </Root>
  );
};

Follow.fragments = {
  subscription: gql`
    fragment Follow_subscription on EmailSubscription {
      slug
    }
  ` as TypedDocumentNode<Follow_subscription>,
  player: gql`
    fragment Follow_player on Player {
      slug
      ...FollowDescription_player
    }
    ${FollowDescription.fragments.player}
  ` as TypedDocumentNode<Follow_player>,
  ...US_SPORTS_FOLLOW_FRAGMENTS.baseballPlayer,
  ...US_SPORTS_FOLLOW_FRAGMENTS.nbaPlayer,
  country: gql`
    fragment Follow_country on Country {
      slug
      ...FollowDescription_country
    }
    ${FollowDescription.fragments.country}
  ` as TypedDocumentNode<Follow_country>,
  club: gql`
    fragment Follow_club on Club {
      slug
      ...FollowDescription_club
    }
    ${FollowDescription.fragments.club}
  ` as TypedDocumentNode<Follow_club>,
};

export default Follow;
