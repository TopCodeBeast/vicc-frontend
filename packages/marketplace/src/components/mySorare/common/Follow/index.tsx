import styled from 'styled-components';

import FollowButton from '@sorare/core/src/components/user/FollowButton';

import FollowDescription from './FollowDescription';
// import {
//   Follow_club,
//   Follow_country,
//   Follow_player,
//   Follow_subscription,
// } from './__generated__/index.graphql';

interface Props {
  subscription: any;//Follow_subscription;
  item: any;//Follow_player | Follow_club | Follow_country;
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

export default Follow;
