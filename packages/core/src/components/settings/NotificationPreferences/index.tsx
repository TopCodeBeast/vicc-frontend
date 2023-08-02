import { Divider } from '@material-ui/core';
import { useMemo, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { Ball } from '@core/atoms/icons/Ball';
import { MLBBall } from '@core/atoms/icons/MLBBall';
import { NBABall } from '@core/atoms/icons/NBABall';
import { Title4 } from '@core/atoms/typography';
import { Tab, TabBar } from '@core/components/TabBar';
import FormSection from '@core/components/settings/SettingsSection';
import DisabledEmailWarning from '@core/components/user/DisabledEmailWarning';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { Lifecycle } from '@core/hooks/useLifecycle';
import { useNotificationPreferences } from '@core/hooks/useNotificationPreferences';
import { sportsLabelsMessages } from '@core/lib/glossary';

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--double-unit);
`;

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

  if (!currentUser) {
    return null;
  }

  return (
    <Wrapper>
      <TabBar value={sport} compact>
        {[Sport.FOOTBALL, Sport.NBA, Sport.BASEBALL].map(s => (
          <Tab key={s} value={s} onClick={() => setSport(s)}>
            <SportIcon sport={s} />
            <FormattedMessage {...sportsLabelsMessages[s]} />
          </Tab>
        ))}
      </TabBar>
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
    </Wrapper>
  );
};

export default NotificationPreferences;
