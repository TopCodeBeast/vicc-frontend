import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Text16 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useQuery from '@core/hooks/graphql/useQuery';

import SettingsSection from '../SettingsSection';
import {
  CurrentUserActivityReportQuery,
  CurrentUserActivityReportQueryVariables,
} from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'Settings.activityReports.title',
    defaultMessage: 'Activity Reports',
  },
  description: {
    id: 'Settings.activityReports.description',
    defaultMessage:
      'See how many tournaments you have entered in the last 30 days',
  },
});

const FOOTBALL_ACTIVITY_QUERY = gql`
  query CurrentUserActivityReportQuery {
    currentUser {
      slug
      footballLast30DaysLineupsCount
    }
  }
` as TypedDocumentNode<
  CurrentUserActivityReportQuery,
  CurrentUserActivityReportQueryVariables
>;

type Props = {
  usSportsActivityReports: ReactNode;
};

const ActivityReports = ({ usSportsActivityReports }: Props) => {
  const { data, loading } = useQuery(FOOTBALL_ACTIVITY_QUERY);
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) {
    return null;
  }
  const footballLast30DaysLineupsCount =
    data?.currentUser?.footballLast30DaysLineupsCount;

  return (
    <SettingsSection {...messages}>
      <div>
        <Text16>
          <FormattedMessage
            id="setting.activityReports.football"
            defaultMessage="Football: {footballLast30DaysLineupsCount}"
            values={{
              footballLast30DaysLineupsCount: loading
                ? '...'
                : footballLast30DaysLineupsCount,
            }}
          />
        </Text16>
        {usSportsActivityReports}
      </div>
    </SettingsSection>
  );
};

export default ActivityReports;
