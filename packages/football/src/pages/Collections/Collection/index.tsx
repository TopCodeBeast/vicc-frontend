import { gql } from '@apollo/client';
import { Tab, Tabs } from '@material-ui/core';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  generatePath,
  matchPath,
  useNavigate,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';

import Container from '@sorare/core/src/atoms/layout/Container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import {
  FOOTBALL_USER_CARD_COLLECTION_CARDS,
  FOOTBALL_USER_CARD_COLLECTION_LEADERBOARD,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSeoContext } from '@sorare/core/src/contexts/seo';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

import CollectionLeaderboard from '@football/components/collections/CollectionLeaderboard';
import { CollectionSlots } from '@football/components/collections/CollectionSlots';
import { Header } from '@football/components/collections/Header';

import {
  CollectionQuery,
  CollectionQueryVariables,
} from './__generated__/index.graphql';

const Wrapper = styled(Container)`
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  min-height: var(--100vh);
`;
const StyledTab = styled(Tab)`
  padding: var(--unit) var(--double-unit);
  color: var(--c-neutral-800);
  &.selected {
    color: var(--c-neutral-1000);
  }
`;

const COLLECTION_QUERY = gql`
  query CollectionQuery(
    $slug: String!
    $userSlug: String!
    $hasUserCollection: Boolean!
  ) {
    user(slug: $userSlug) {
      slug
      nickname
    }
    cardCollection(slug: $slug) {
      slug
      name
      ...CollectionSlots_cardCollection
      slots @skip(if: $hasUserCollection) {
        id
        ...CollectionSlots_cardCollectionSlot
      }
      userCardCollection(forUserSlug: $userSlug)
        @include(if: $hasUserCollection) {
        id
        slots {
          slug
          ...CollectionSlots_userCardCollectionSlot
        }
        ...Header_userCardCollection
      }
      socialPictureUrls(forUserSlug: $userSlug) {
        post
        square
        story
      }
      ...Header_cardCollection
    }
  }
  ${CollectionSlots.fragments.userCardCollectionSlot}
  ${CollectionSlots.fragments.cardCollectionSlot}
  ${CollectionSlots.fragments.cardCollection}
  ${Header.fragments.cardCollection}
  ${Header.fragments.userCardCollection}
`;

type Props = { slug: string; userSlug: string };

const CollectionWithParams = ({ slug, userSlug }: Props) => {
  const { formatMessage } = useIntl();
  const { setPageMetadata } = useSeoContext();
  const bgLocation = useBgLocation(true);
  const { pathname: currentPathname } = bgLocation;
  const navigate = useNavigate();
  const [hasUserCollection, setHasUserCollection] = useState(true);
  const { currentUser } = useCurrentUserContext();

  const { data, loading } = useQuery<CollectionQuery, CollectionQueryVariables>(
    COLLECTION_QUERY,
    {
      variables: {
        slug,
        userSlug,
        hasUserCollection,
      },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-and-network',
    }
  );

  const cardCollection = data?.football.cardCollection;
  const { user } = data || {};
  const userCardCollection = cardCollection?.userCardCollection;
  const slots = userCardCollection?.slots || cardCollection?.slots || [];

  useEffect(() => {
    if (cardCollection) {
      const img =
        cardCollection.socialPictureUrls?.post ||
        cardCollection.socialPictureUrls?.square ||
        cardCollection.socialPictureUrls?.story ||
        undefined;

      setPageMetadata(
        formatMessage(
          {
            id: 'Collection.title',
            defaultMessage: "{username}'s collection: {collectionName}",
          },
          { username: user?.nickname, collectionName: cardCollection.name }
        ),
        { img }
      );
    }
  }, [formatMessage, setPageMetadata, cardCollection, user?.nickname]);

  if (!loading && !userCardCollection && hasUserCollection) {
    /*
      Setting this will re-trigger the query and request different fields because of the skip and include directives
      Having 2 queries is not ideal but it will happen only on empty collections.
      Alternatives would be to:
      - Change the backend to be able to make only one query, but this is not trivial to do cleanly.
      - Have different routes for filled and empty collections, but this makes navigation less intuitive for the user
    */
    setHasUserCollection(false);
  }

  if (loading && !slots.length) {
    return (
      <Wrapper>
        <LoadingIndicator fullHeight />
      </Wrapper>
    );
  }

  if (!cardCollection) {
    return null;
  }

  const tabItems = [
    {
      path: generatePath(FOOTBALL_USER_CARD_COLLECTION_CARDS, {
        slug: userSlug,
        collectionSlug: slug,
      }),
      label: (
        <FormattedMessage id="Collection.Tabs.cards" defaultMessage="Cards" />
      ),
      tabContent: (
        <CollectionSlots
          cardCollection={cardCollection}
          slots={slots}
          readOnly={userSlug !== currentUser?.slug}
        />
      ),
    },
    {
      path: generatePath(FOOTBALL_USER_CARD_COLLECTION_LEADERBOARD, {
        slug: userSlug,
        collectionSlug: slug,
      }),
      label: (
        <FormattedMessage
          id="Collection.Tabs.leaderboard"
          defaultMessage="Leaderboard"
        />
      ),
      tabContent: <CollectionLeaderboard slug={slug} userSlug={userSlug} />,
    },
  ];

  const activeIndex = Math.max(
    tabItems.findIndex(tab => {
      const { pathname } = new URL(tab.path, window.location.origin);
      return matchPath(pathname, currentPathname);
    }),
    0
  );

  return (
    <>
      <Header
        cardCollection={cardCollection}
        userCardCollection={userCardCollection}
        userSlug={userSlug}
      />
      <Wrapper>
        <Tabs
          value={activeIndex}
          onChange={(_event, val) => {
            navigate(tabItems[val].path, { replace: true });
          }}
          variant="scrollable"
        >
          {tabItems.map((tab, index) => (
            <StyledTab
              key={tab.path}
              label={tab.label}
              className={classNames({
                selected: activeIndex === index,
              })}
            />
          ))}
        </Tabs>
        {tabItems[activeIndex]?.tabContent}
      </Wrapper>
    </>
  );
};

export const Collection = () => {
  const { slug, collectionSlug } = useParams();

  if (!slug || !collectionSlug) {
    return null;
  }

  /*
    The key makes sure the component is re-mounted when the params change
    This is necessary because we have initial state in the component that needs to be reset when the params change
  */
  return (
    <CollectionWithParams
      slug={collectionSlug}
      userSlug={slug}
      key={`${slug}${collectionSlug}`}
    />
  );
};

export default Collection;
