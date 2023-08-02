import { TypedDocumentNode, gql } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import Header from '@football/components/user/Header';

import {
  MyClubQuery,
  MyClubQueryVariables,
} from './__generated__/index.graphql';

const EmptyHeader = styled.div`
  background-color: rgba(var(--c-rgb-neutral-200), 0.23);
  height: 250px;
`;

const MY_CLUB_QUERY = gql`
  query MyClubQuery {
    currentUser {
      slug
      ...UserHeader_currentUser
    }
  }
  ${Header.fragments.currentUser}
` as TypedDocumentNode<MyClubQuery, MyClubQueryVariables>;

const MyClubLayout = () => {
  const { data } = useQuery(MY_CLUB_QUERY);
  return (
    <>
      {data?.currentUser ? (
        <Header user={data?.currentUser} />
      ) : (
        <EmptyHeader />
      )}
      <Outlet />
    </>
  );
};

export default MyClubLayout;
