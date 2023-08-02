import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import LoadMoreButton from '@sorare/core/src/atoms/buttons/LoadMoreButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { extractConnectionData } from '@sorare/core/src/gql/extractData';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { MyPage } from '../MyPage';
import Follow from '../common/Follow';
import Subscriptions from '../common/Subscriptions';
import { MySorarePage } from '../common/pages';
import useSortByDate from '../common/useSortByDate';
import useSportSelect from '../common/useSportSelect';
import useSubscribableTypesSelect from '../common/useSubscribableTypesSelect';
import {
  CurrentUserFollowsQuery,
  CurrentUserFollowsQueryVariables,
} from './__generated__/index.graphql';

export const CURRENT_USER_FOLLOWS_QUERY = gql`
  query CurrentUserFollowsQuery(
    $cursor: String
    $types: [SubscribableType!]
    $sortType: SortingOption
  ) {
    currentUser {
      slug
      mySubscriptions(
        types: $types
        after: $cursor
        sortType: $sortType
        first: 50
      ) {
        nodes {
          slug
          ...Subscriptions_subscription
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Subscriptions.fragments.subscription}
` as TypedDocumentNode<
  CurrentUserFollowsQuery,
  CurrentUserFollowsQueryVariables
>;

const Root = styled.div`
  & > * + * {
    margin-top: 15px;
  }
`;

export const MyFollows = () => {
  const { sportInputValue, SportSelect } = useSportSelect();
  const { sortAsVariable, SortSelect } = useSortByDate();
  const { selectedSubscribableTypesVariables, SubscribableTypeSelect } =
    useSubscribableTypesSelect({ sportInputValue });

  const { data, loading, loadMore } = usePaginatedQuery(
    CURRENT_USER_FOLLOWS_QUERY,
    {
      variables: {
        types: selectedSubscribableTypesVariables,
        sortType: sortAsVariable,
      },
      connection: 'EmailSubscriptionConnection',
    }
  );

  if (!data) return <LoadingIndicator />;

  const mySubscriptions = data.currentUser?.mySubscriptions;

  const {
    items: follows = [],
    hasMore,
    cursor,
  } = extractConnectionData(mySubscriptions, src => src);

  return (
    <MyPage
      page={MySorarePage.FOLLOWS}
      toolbar={
        <>
          <SportSelect />
          <SubscribableTypeSelect />
          <SortSelect />
        </>
      }
    >
      <Root>
        <Subscriptions subscriptions={follows} ItemComponent={Follow} />
        <LoadMoreButton
          hasMore={hasMore}
          loading={loading}
          loadMore={() => {
            loadMore(false, {
              cursor,
              types: selectedSubscribableTypesVariables,
              sortType: sortAsVariable,
            });
          }}
        />
      </Root>
    </MyPage>
  );
};

export default MyFollows;
