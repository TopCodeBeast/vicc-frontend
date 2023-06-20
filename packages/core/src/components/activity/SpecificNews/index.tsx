import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { SmallContainer } from '@sorare/core/src/atoms/container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import Announcement from '../Announcement';
import {
  GetSpecificNewsQuery,
  GetSpecificNewsQueryVariables,
} from './__generated__/index.graphql';

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
`;
const Root = styled.div`
  padding: var(--double-unit) 0 var(--quadruple-unit);
`;
export const SpecificNews = () => {
  const { id } = useParams();

  const { data, loading } = useQuery<
    GetSpecificNewsQuery,
    GetSpecificNewsQueryVariables
  >(GET_SPECIFIC_NEWS_QUERY, {
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
    <SmallContainer>
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
    </SmallContainer>
  );
};
