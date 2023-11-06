import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import CheckboxGroup from '@core/atoms/inputs/CheckboxGroup';
import { Text14 } from '@core/atoms/typography';
import FilterInDropdown from '@core/components/FilterInDropdown';
import { useInGameNotificationContext } from '@core/contexts/inGameNotification';
import usePaginatedQuery from '@core/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@core/hooks/useInfiniteScroll';
import { sportsLabelsMessages } from '@core/lib/glossary';

import Notification from '../Notification';
import { NotificationGroup, allGroups, messages } from '../constants';
import { FiltersContainer, ItemsContainer, Root } from '../ui';
import { flattenGroups } from '../utils';
import {
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
} from './__generated__/index.graphql';

const GET_NOTIFICATIONS_QUERY = gql`
  query GetNotificationsQuery(
    $cursor: String
    $categories: [NotificationCategoryInput!]
    $sports: [Sport!]
  ) {
    currentUser {
      slug
      notifications(after: $cursor, categories: $categories, sports: $sports) {
        nodes {
          ... on NotificationInterface {
            id
          }
          ...Notification_notification
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Notification.fragments.notification}
` as TypedDocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;

const sports = Object.values(Sport);

export const Notifications = () => {
  const { markNotificationsAsRead } = useInGameNotificationContext();
  const [selectedGroups, setSelectedGroups] = useState<NotificationGroup[]>([]);
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);

  const { data, loading, loadMore } = usePaginatedQuery(
    GET_NOTIFICATIONS_QUERY,
    {
      variables: {
        sports: selectedSports,
        categories: flattenGroups(
          selectedGroups.length ? selectedGroups : allGroups
        ),
      },
      connection: 'NotificationConnection',
    }
  );

  const notifications = data?.currentUser?.notifications;

  useEffect(() => {
    markNotificationsAsRead(
      data?.currentUser?.notifications?.nodes?.filter(Boolean) || []
    );
  }, [data, markNotificationsAsRead]);

  const hasNextPage = Boolean(
    data?.currentUser?.notifications?.pageInfo?.hasNextPage
  );

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        cursor: data?.currentUser?.notifications?.pageInfo.endCursor,
      });
    }, [data, loadMore]),
    hasNextPage,
    loading
  );

  return (
    <Root>
      <FiltersContainer>
        {/* <FilterInDropdown
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
            options={sports.map(sport => ({
              value: sport,
              label: (
                <Text14>
                  <FormattedMessage {...sportsLabelsMessages[sport]} />
                </Text14>
              ),
            }))}
            selectedValues={selectedSports}
            onChange={setSelectedSports}
          />
        </FilterInDropdown> */}
        <FilterInDropdown
          darkTheme
          buttonLabel={
            <FormattedMessage
              id="Activity.Notifications.categories"
              defaultMessage="{nbCategories, plural, =0 {All categories} other {Categories (#)}}"
              values={{
                nbCategories: selectedGroups.length,
              }}
            />
          }
          filterSelected={!!selectedGroups.length}
          onClearFilter={() => setSelectedGroups([])}
        >
          <CheckboxGroup
            options={allGroups.map(group => ({
              value: group,
              label: (
                <Text14>
                  <FormattedMessage {...messages[group]} />
                </Text14>
              ),
            }))}
            selectedValues={selectedGroups}
            onChange={setSelectedGroups}
          />
        </FilterInDropdown>
      </FiltersContainer>
      <ItemsContainer>
        {notifications?.nodes?.map(notification => {
          if (!notification) return null;
          return (
            <Notification key={notification.id} notification={notification} />
          );
        })}
        {data && !notifications?.nodes?.length && (
          <Text14>
            <FormattedMessage
              id="Activity.Notifications.noNotifications"
              defaultMessage="You have no notifications yet."
            />
          </Text14>
        )}
        <InfiniteScrollLoader />
      </ItemsContainer>
    </Root>
  );
};
