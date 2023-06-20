import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from 'contexts/currentUser';

import SettingsSection from '../SettingsSection';

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

type Props = {
  usSportsActivityReports: ReactNode;
};

const ActivityReports = ({ usSportsActivityReports }: Props) => {
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) {
    return null;
  }
  const { footballLast30DaysLineupsCount } = currentUser;

  return (
    <SettingsSection {...messages}>
      <div>
        <Text16>
          <FormattedMessage
            id="setting.activityReports.football"
            defaultMessage="Football: {footballLast30DaysLineupsCount}"
            values={{ footballLast30DaysLineupsCount }}
          />
        </Text16>
        {usSportsActivityReports}
      </div>
    </SettingsSection>
  );
};

export default ActivityReports;
