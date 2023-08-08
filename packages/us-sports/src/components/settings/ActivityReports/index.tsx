import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { Text16 } from '@sorare/core/src/atoms/typography';

import { useUSSportsQuery } from '@us-sports/hooks/graphql';

import {
  UsActivityReportsQuery,
  UsActivityReportsQueryVariables,
} from './__generated__/index.graphql';

const US_ACTIVITY_REPORTS_QUERY = gql`
  query UsActivityReportsQuery {
    currentUser {
      slug
    }
  }
` as TypedDocumentNode<UsActivityReportsQuery, UsActivityReportsQueryVariables>;

export const ActivityReports = () => {
  const { data, loading } = useUSSportsQuery(US_ACTIVITY_REPORTS_QUERY);

  if (!data || loading) return null;
  const { currentUser } = data;
  if (!currentUser) return null;

  return (
    <>
    </>
  );
};
export default ActivityReports;
