import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { Text16 } from '@sorare/core/src/atoms/typography';

import { useUSSportsQuery } from 'hooks/graphql';

import { UsActivityReportsQuery } from './__generated__/index.graphql';

const US_ACTIVITY_REPORTS_QUERY = gql`
  query UsActivityReportsQuery {
    currentUser {
      slug
      nbaLast30DaysLineupsCount
      baseballLast30DaysLineupsCount
    }
  }
`;

export const ActivityReports = () => {
  const { data, loading } = useUSSportsQuery<UsActivityReportsQuery>(
    US_ACTIVITY_REPORTS_QUERY
  );

  if (!data || loading) return null;
  const { currentUser } = data;
  if (!currentUser) return null;
  const { nbaLast30DaysLineupsCount, baseballLast30DaysLineupsCount } =
    currentUser;
  return (
    <>
      <Text16>
        <FormattedMessage
          id="settings.activityReports.nba"
          defaultMessage="NBA: {nbaLast30DaysLineupsCount}"
          values={{ nbaLast30DaysLineupsCount }}
        />
      </Text16>
      <Text16>
        <FormattedMessage
          id="settings.activityReports.baseball"
          defaultMessage="MLB: {baseballLast30DaysLineupsCount}"
          values={{ baseballLast30DaysLineupsCount }}
        />
      </Text16>
    </>
  );
};
export default ActivityReports;
