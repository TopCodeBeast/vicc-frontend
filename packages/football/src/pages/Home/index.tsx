import { gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// import { ConversionCreditBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditBanner';
// import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
// import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
// import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
// import { metadatas } from '@sorare/core/src/lib/seo/common';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

// import Tabs from './Tabs';
// import {
//   CurrentUserHomeQuery,
//   UserHomeQuery,
// } from './__generated__/index.graphql';

// const CURRENT_USER_HOME_QUERY = gql`
//   query CurrentUserHomeQuery {
//     currentUser {
//       slug
//       ...HomeTabs_currentUser
//     }
//   }
//   ${Tabs.fragments.currentUser}
// `;

// const USER_HOME_QUERY = gql`
//   query UserHomeQuery($slug: String!) {
//     user(slug: $slug) {
//       slug
//       ...HomeTabs_publicUserInfoInterface
//     }
//   }
//   ${Tabs.fragments.publicUserInfoInterface}
// `;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  flex: 1;
  overflow: hidden;
  @media ${laptopAndAbove} {
    gap: 0;
  }
`;

const Home = () => {
  // const { currentUser } = useCurrentUserContext();

  // const { slug: paramsUserSlug } = useParams();

  // const isOwnPage = Boolean(
  //   currentUser && (!paramsUserSlug || paramsUserSlug === currentUser.slug)
  // );

  // const { data: currentUserData } = useQuery<CurrentUserHomeQuery>(
  //   CURRENT_USER_HOME_QUERY,
  //   {
  //     nextFetchPolicy: 'cache-first',
  //     fetchPolicy: 'cache-and-network',
  //     skip: !isOwnPage,
  //   }
  // );

  // const { data: userData } = useQuery<UserHomeQuery>(USER_HOME_QUERY, {
  //   nextFetchPolicy: 'cache-first',
  //   fetchPolicy: 'cache-and-network',
  //   variables: { slug: paramsUserSlug },
  //   skip: isOwnPage,
  // });

  // const user = isOwnPage ? currentUserData?.currentUser : userData?.user;
  // const pageTitle = isOwnPage
  //   ? metadatas.managerHome.title
  //   : metadatas.userGallery.title;
  // const pageDescription = isOwnPage
  //   ? metadatas.managerHome.description
  //   : metadatas.userGallery.description;

  // useTitleAndDescription(
  //   pageTitle,
  //   pageDescription,
  //   !!user && { username: user.nickname }
  // );

  // if (!user) return null;

  return (
    <Root>
      {/* <ConversionCreditBanner /> */}
      {/* <Tabs user={user} isOwnPage={isOwnPage} /> */}
      Football Home
    </Root>
  );
};

export default Home;
