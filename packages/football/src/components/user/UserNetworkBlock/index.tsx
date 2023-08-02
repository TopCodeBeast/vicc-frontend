import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import FollowButton from '@sorare/core/src/components/user/FollowButton';

import Info from '@football/components/user/Info';

import { UserNetworkBlock_user } from './__generated__/index.graphql';

type Props = {
  user: UserNetworkBlock_user & { subscriptionSlug?: string };
};

const Wrapper = styled.div`
  position: relative;
  gap: var(--double-unit);
  text-transform: capitalize;
  padding: var(--double-unit);
  border-bottom: 1px solid rgba(var(--c-rgb-neutral-100), 0.25);
  background: var(--c-neutral-200);
  border-radius: var(--double-unit);
  color: var(--c-neutral-1000);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  isolation: isolate;
`;

export const UserNetworkBlock = ({ user }: Props) => {
  const { slug } = user;

  return (
    <Wrapper>
      <Info user={user} />
      <FollowButton
        small
        subscribable={{ slug, __typename: 'User' }}
        initialSubscription={user.followed}
      />
    </Wrapper>
  );
};

UserNetworkBlock.fragments = {
  user: gql`
    fragment UserNetworkBlock_user on PublicUserInfoInterface {
      slug
      followed {
        slug
      }
      ...Info_user
    }
    ${Info.fragments.user}
  ` as TypedDocumentNode<UserNetworkBlock_user>,
};

export default UserNetworkBlock;
