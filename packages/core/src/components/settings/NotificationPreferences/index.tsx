import { Divider } from '@material-ui/core';
import { useMemo, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import { Ball } from '@sorare/core/src/atoms/icons/Ball';
import { MLBBall } from '@sorare/core/src/atoms/icons/MLBBall';
import { NBABall } from '@sorare/core/src/atoms/icons/NBABall';
import { SecondaryTabs } from '@sorare/core/src/atoms/navigation/SecondaryTabs';
import { Title4 } from '@sorare/core/src/atoms/typography';
import FormSection from 'components/settings/SettingsSection';
import DisabledEmailWarning from 'components/user/DisabledEmailWarning';
import { SETTINGS_NOTIFICATIONS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { Lifecycle } from '@sorare/core/src/hooks/useLifecycle';
import { useNotificationPreferences } from '@sorare/core/src/hooks/useNotificationPreferences';
import { sportsLabelsMessages } from '@sorare/core/src/lib/glossary';

import { NotificationPreference } from './NotificationPreference';
import {
  DisplayableMarketingPreference,
  DisplayablePreference,
  displayableMarketingPreferences,
  displayablePreferences,
} from './types';

const title = defineMessage({
  id: 'Settings.Notifications.title',
  defaultMessage: 'Email notifications you will receive:',
});

const SportIcon = ({ sport }: { sport: Sport }) => {
  if (sport === Sport.FOOTBALL) return <Ball />;
  if (sport === Sport.NBA) return <NBABall />;
  return <MLBBall />;
};

export const NotificationPreferences = () => {
  const { currentUser } = useCurrentUserContext();
  const lastVisitedSport = (currentUser?.userSettings?.lifecycle as Lifecycle)
    ?.lastVisitedSport;
  const [sport, setSport] = useState<Sport>(lastVisitedSport || Sport.FOOTBALL);
  const sportNotificationPreferences = useNotificationPreferences(sport);

  const filteredPreferences = useMemo(() => {
    const preferenceNames = [
      ...displayablePreferences,
      ...displayableMarketingPreferences,
    ] as string[];

    return (sportNotificationPreferences.filter(p =>
      preferenceNames.includes(p.name)
    ) || []) as {
      name: DisplayablePreference | DisplayableMarketingPreference;
      value: any | null;
      defaultValue: any;
      values: any[];
    }[];
  }, [sportNotificationPreferences]);

  const tabs = useMemo(
    () =>
      [Sport.FOOTBALL, Sport.NBA, Sport.BASEBALL].map(s => ({
        key: s,
        to: SETTINGS_NOTIFICATIONS,
        active: s === sport,
        icon: <SportIcon sport={s} />,
        label: <FormattedMessage {...sportsLabelsMessages[s]} />,
        onClick: () => setSport(s),
      })),
    [sport]
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <SecondaryTabs items={tabs} noBorder />
      <FormSection title={title}>
        <DisabledEmailWarning />
        {filteredPreferences
          .filter(p =>
            displayablePreferences.includes(p.name as DisplayablePreference)
          )
          .map(p => (
            <NotificationPreference key={p.name} preference={p} sport={sport} />
          ))}
        <Divider />
        <Title4>
          <FormattedMessage
            id="Settings.Notifications.marketingTitle"
            defaultMessage="Marketing"
          />
        </Title4>
        {filteredPreferences
          .filter(p =>
            displayableMarketingPreferences.includes(
              p.name as DisplayableMarketingPreference
            )
          )
          .map(p => (
            <NotificationPreference key={p.name} preference={p} sport={sport} />
          ))}
      </FormSection>
    </div>
  );
};

export default NotificationPreferences;
