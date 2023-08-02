import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import useQuery from '@core/hooks/graphql/useQuery';

import Announcement from '../Announcement';
import {
  GetSpecificNewsQuery,
  GetSpecificNewsQueryVariables,
} from './__generated__/index.graphql';

const Root = styled.div`
  padding: var(--triple-unit);
`;

const GET_SPECIFIC_NEWS_QUERY = gql`
  query GetSpecificNewsQuery($cursor: String, $announcementIds: [String!]) {
    announcements(
      after: $cursor
      announcementIds: $announcementIds
      first: 10
    ) {
      nodes {
        ...Announcement_announcement
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${Announcement.fragments.announcement}
` as TypedDocumentNode<GetSpecificNewsQuery, GetSpecificNewsQueryVariables>;

export const SpecificNews = () => {
  const { id } = useParams();

  const { data, loading } = useQuery(GET_SPECIFIC_NEWS_QUERY, {
    variables: {
      announcementIds: [id!],
    },
    skip: !id,
  });

  if (!data || loading) {
    return <LoadingIndicator />;
  }
  const announcement = data?.announcements.nodes[0];

  return (
    <Root>
      {announcement ? (
        <Announcement announcement={announcement} />
      ) : (
        <FormattedMessage
          id="SpecificNews.notFound"
          defaultMessage="This news does not exist."
        />
      )}
    </Root>
  );
};
