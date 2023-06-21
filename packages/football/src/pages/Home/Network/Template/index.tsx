import { gql } from '@apollo/client';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { theme } from '@sorare/core/src/style/theme';

import UserNetworkBlock from '@football/components/user/UserNetworkBlock';

import { NetworkTemplate_user } from './__generated__/index.graphql';

interface Props {
  users?: NetworkTemplate_user[];
  loadMore: () => void;
  hasNextPage: boolean;
  loading: boolean;
}

const Root = styled.div`
  padding: var(--double-unit) 0;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  flex-wrap: wrap;
  gap: var(--double-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Template = ({ users, loadMore, hasNextPage, loading }: Props) => {
  const { InfiniteScrollLoader } = useInfiniteScroll(
    loadMore,
    hasNextPage,
    loading
  );

  if (loading && !users) {
    return (
      <Root>
        <LoadingIndicator />
      </Root>
    );
  }
  if (!users) return null;

  return (
    <Root>
      <Content>
        {users.map(u => (
          <UserNetworkBlock key={u.slug} user={u} />
        ))}
      </Content>
      <InfiniteScrollLoader />
    </Root>
  );
};

Template.fragments = {
  user: gql`
    fragment NetworkTemplate_user on PublicUserInfoInterface {
      slug
      ...UserNetworkBlock_user
    }
    ${UserNetworkBlock.fragments.user}
  `,
};

export default Template;
