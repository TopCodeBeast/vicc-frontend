import { TypedDocumentNode, gql } from '@apollo/client';
import { Suspense } from 'react';
import { useIntl } from 'react-intl';
import { Navigate, Route, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import Root from '@sorare/core/src/atoms/layout/Body';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import NavigationTabs from '@sorare/core/src/atoms/navigation/NavigationTabs';
import {
  FOOTBALL_HOME,
  FOOTBALL_USER_GALLERY_CARDS,
  FOOTBALL_USER_GALLERY_CARD_COLLECTIONS,
  FOOTBALL_USER_GALLERY_CLUB_HONORS,
  FOOTBALL_USER_GALLERY_NETWORK,
  FOOTBALL_USER_GALLERY_OVERVIEW,
  FOOTBALL_USER_GALLERY_SQUADS,
  FOOTBALL_USER_GALLERY_WILDCARD,
} from '@sorare/core/src/constants/routes';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { useUseCustomLists } from '@sorare/core/src/lib/featureFlags';
import { galleryTabs } from '@sorare/core/src/lib/glossary';
import { lazy } from '@sorare/core/src/lib/retry';
import { RootRoutes } from '@sorare/core/src/routing/RootRoutes';

import Header from '@football/components/user/Header';
import Overview from '@football/pages/Gallery/Overview';

import {
  HomeTabs_currentUser,
  HomeTabs_publicUserInfoInterface,
} from './__generated__/index.graphql';

type Props = {
  user: HomeTabs_currentUser | HomeTabs_publicUserInfoInterface;
  isOwnPage: boolean;
};

const Body = styled(Container)`
  row-gap: var(--double-unit);
`;
const Content = styled.div`
  padding: var(--double-unit) 0;
`;

const HomeOverview = lazy(async () => import('@football/pages/Home/Overview'));
const Cards = lazy(async () => import('@football/pages/Gallery/Cards'));
const Collections = lazy(async () => import('@football/pages/Collections/Collections'));
const CustomDecks = lazy(async () => import('@football/pages/Gallery/CustomDecks'));
const ClubHonors = lazy(async () => import('@football/pages/Home/ClubHonors'));
const Network = lazy(async () => import('@football/pages/Home/Network'));

export const Tabs = ({ user, isOwnPage }: Props) => {
  const useCustomLists = useUseCustomLists();
  const { formatMessage } = useIntl();
  const bgLocation = useBgLocation(true);
  const { slug } = user;

  const tabItems = [
    isOwnPage
      ? {
          path: FOOTBALL_HOME,
          label: formatMessage(galleryTabs.overview),
          tabContent: <HomeOverview />,
        }
      : !useCustomLists && {
          path: FOOTBALL_USER_GALLERY_OVERVIEW,
          label: formatMessage(galleryTabs.overview),
          tabContent: (
            <Overview
              user={user as HomeTabs_publicUserInfoInterface}
              readOnly
            />
          ),
        },
    {
      path: FOOTBALL_USER_GALLERY_CARDS,
      label: formatMessage(galleryTabs.cards),
      tabContent: (
        <Cards
          user={user}
          readOnly={!isOwnPage}
          nbCustomDecks={user.customDecks?.nodes.length}
        />
      ),
    },
    {
      path: FOOTBALL_USER_GALLERY_CARD_COLLECTIONS,
      label: formatMessage(galleryTabs.cardCollections),
      tabContent: <Collections readOnly={!isOwnPage} />,
    },
    {
      path: FOOTBALL_USER_GALLERY_CLUB_HONORS,
      label: formatMessage(galleryTabs.clubHonors),
      tabContent: <ClubHonors user={user} readOnly={!isOwnPage} />,
    },
    !useCustomLists && {
      path: FOOTBALL_USER_GALLERY_SQUADS,
      label: formatMessage(galleryTabs.customDecks),
      tabContent: <CustomDecks userSlug={user.slug} readOnly={!isOwnPage} />,
    },
    {
      path: FOOTBALL_USER_GALLERY_NETWORK,
      label: formatMessage(galleryTabs.network),
      tabContent: <Network user={user} />,
    },
  ]
    .filter(Boolean)
    .map(({ path, ...rest }) => ({
      to: generatePath(path, { slug }),
      path,
      ...rest,
    }));

  return (
    <Root>
      <Header user={user} readOnly={!isOwnPage} />
      <Body>
        <NavigationTabs items={tabItems} />
        <Content>
          <RootRoutes location={bgLocation}>
            {tabItems.map(tab => (
              <Route
                key={tab.path}
                path={tab.path}
                element={
                  <Suspense fallback={<LoadingIndicator fullHeight white />}>
                    {tab.tabContent}
                  </Suspense>
                }
              />
            ))}
            <Route
              path={FOOTBALL_USER_GALLERY_WILDCARD}
              element={
                <Navigate
                  to={
                    isOwnPage
                      ? FOOTBALL_HOME
                      : generatePath(
                          useCustomLists
                            ? FOOTBALL_USER_GALLERY_CARDS
                            : FOOTBALL_USER_GALLERY_OVERVIEW,
                          { slug }
                        )
                  }
                  replace
                />
              }
            />
            <Route path="*" element={<Navigate to={FOOTBALL_HOME} replace />} />
          </RootRoutes>
        </Content>
      </Body>
    </Root>
  );
};

Tabs.fragments = {
  currentUser: gql`
    fragment HomeTabs_currentUser on CurrentUser {
      id
      slug
      ...UserHeader_currentUser
      ...Overview_publicUserInfoInterface
      customDecks {
        nodes {
          slug
        }
      }
    }
    ${Header.fragments.currentUser}
    ${Overview.fragments.user}
  ` as TypedDocumentNode<HomeTabs_currentUser>,
  publicUserInfoInterface: gql`
    fragment HomeTabs_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      ...UserHeader_publicUserInfoInterface
      ...Overview_publicUserInfoInterface
      customDecks {
        nodes {
          slug
        }
      }
    }
    ${Header.fragments.user}
    ${Overview.fragments.user}
  ` as TypedDocumentNode<HomeTabs_publicUserInfoInterface>,
};

export default Tabs;
