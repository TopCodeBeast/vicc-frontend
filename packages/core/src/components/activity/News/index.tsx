import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import CheckboxGroup from '@core/atoms/inputs/CheckboxGroup';
import { Text14 } from '@core/atoms/typography';
import FilterInDropdown from '@core/components/FilterInDropdown';
import { ACTIVITY_NEWS_SHOW } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useInGameNotificationContext } from '@core/contexts/inGameNotification';
import idFromObject from '@core/gql/idFromObject';
import usePaginatedQuery from '@core/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@core/hooks/useInfiniteScroll';
import { Lifecycle } from '@core/hooks/useLifecycle';
import { sportsLabelsMessages } from '@core/lib/glossary';
import { isType } from '@core/lib/gql';

import { DumbNotification } from '../DumbNotification';
import { AnnouncementNotification } from '../Notification/AnnouncementNotification';
import { AnnouncementNotification_announcementNotification } from '../Notification/AnnouncementNotification/__generated__/index.graphql';
import { FiltersContainer, ItemsContainer, Root } from '../ui';
import {
  GetNewsQuery,
  GetNewsQueryVariables,
  GetNotificationsNewsQuery,
  GetNotificationsNewsQueryVariables,
} from './__generated__/index.graphql';

const GET_NEWS_QUERY = gql`
  query GetNewsQuery($cursor: String, $sports: [Sport!]) {
    announcements(after: $cursor, sports: $sports, first: 10) {
      nodes {
        id
        title
        createdAt
        sport
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
` as TypedDocumentNode<GetNewsQuery, GetNewsQueryVariables>;

const GET_NOTIFICATIONS_NEWS_QUERY = gql`
  query GetNotificationsNewsQuery(
    $cursor: String
    $categories: [NotificationCategoryInput!]
    $sports: [Sport!]
  ) {
    currentUser {
      slug
      notifications(after: $cursor, categories: $categories, sports: $sports) {
        nodes {
          ...AnnouncementNotification_announcementNotification
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${AnnouncementNotification.fragments.announcementNotification}
` as TypedDocumentNode<
  GetNotificationsNewsQuery,
  GetNotificationsNewsQueryVariables
>;

const sports = Object.values(Sport);

export const News = () => {
  const { currentUser } = useCurrentUserContext();
  const { markNotificationsAsRead } = useInGameNotificationContext();
  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const sport = lifecycle?.lastVisitedSport;
  const [selectedSports, setSelectedSports] = useState<Sport[]>(
    sport ? [sport] : []
  );

  const {
    data: dataNews,
    loading: loadingNews,
    loadMore: loadMoreNews,
  } = usePaginatedQuery(GET_NEWS_QUERY, {
    connection: 'AnnouncementConnection',
    variables: {
      sports: selectedSports,
    },
    skip: !!currentUser,
  });

  const {
    data: dataNotificationsNews,
    loading: loadingNotificationsNews,
    loadMore: loadMoreNotificationsNews,
  } = usePaginatedQuery(GET_NOTIFICATIONS_NEWS_QUERY, {
    variables: {
      sports: selectedSports,
      categories: [
        {
          name: 'announcement',
          type: 'AnnouncementNotification',
        },
      ],
    },
    connection: 'NotificationConnection',
    skip: !currentUser,
  });

  const hasNextPage = useMemo(
    () =>
      Boolean(
        currentUser
          ? dataNotificationsNews?.currentUser?.notifications.pageInfo
              .hasNextPage
          : dataNews?.announcements?.pageInfo?.hasNextPage
      ),
    [
      currentUser,
      dataNews?.announcements?.pageInfo?.hasNextPage,
      dataNotificationsNews?.currentUser?.notifications.pageInfo.hasNextPage,
    ]
  );

  const loading = useMemo(
    () => (currentUser ? loadingNotificationsNews : loadingNews),
    [currentUser, loadingNews, loadingNotificationsNews]
  );

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      const loadMore = currentUser ? loadMoreNotificationsNews : loadMoreNews;
      loadMore(false, {
        cursor: dataNews?.announcements?.pageInfo.endCursor,
      });
    }, [
      currentUser,
      dataNews?.announcements?.pageInfo.endCursor,
      loadMoreNews,
      loadMoreNotificationsNews,
    ]),
    hasNextPage,
    loading
  );

  const notificationsNews = useMemo(() => {
    if (!currentUser) return [];

    return dataNotificationsNews?.currentUser?.notifications.nodes
      ?.filter(Boolean)
      .filter(notification =>
        isType(notification, 'AnnouncementNotification')
      ) as AnnouncementNotification_announcementNotification[] | undefined;
  }, [currentUser, dataNotificationsNews?.currentUser?.notifications.nodes]);

  useEffect(() => {
    if (notificationsNews) {
      markNotificationsAsRead(notificationsNews.filter(Boolean) || []);
    }
  }, [notificationsNews, markNotificationsAsRead]);

  return (
    <Root>
      {/* <FiltersContainer>
        <FilterInDropdown
          darkTheme
          buttonLabel={
            <FormattedMessage
              id="Activity.Notifications.sports"
              defaultMessage="{nbSports, plural, =0 {All sports} other {Sports (#)}}"
              values={{
                nbSports: selectedSports.length,
              }}
            />
          }
          filterSelected={!!selectedSports.length}
          onClearFilter={() => setSelectedSports([])}
        >
          <CheckboxGroup
            options={sports.map(s => ({
              value: s,
              label: (
                <Text14>
                  <FormattedMessage {...sportsLabelsMessages[s]} />
                </Text14>
              ),
            }))}
            selectedValues={selectedSports}
            onChange={setSelectedSports}
          />
        </FilterInDropdown>
      </FiltersContainer> */}
      <ItemsContainer>
        {currentUser ? (
          <>
            {notificationsNews?.map(notification => (
              <AnnouncementNotification
                key={notification.announcement.id}
                notification={notification}
              />
            ))}
          </>
        ) : (
          <>
            {dataNews?.announcements?.nodes?.map(
              announcement =>
                announcement && (
                  <DumbNotification
                    key={announcement.id}
                    createdAt={announcement.createdAt}
                    title={announcement.title}
                    sport={announcement.sport}
                    link={generatePath(ACTIVITY_NEWS_SHOW, {
                      id: idFromObject(announcement.id),
                    })}
                  />
                )
            )}
          </>
        )}
        <InfiniteScrollLoader />
      </ItemsContainer>
    </Root>
  );
};
