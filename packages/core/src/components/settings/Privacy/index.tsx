import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import Switch from '@core/atoms/inputs/Switch';
import Bold from '@core/atoms/typography/Bold';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useQuery from '@core/hooks/graphql/useQuery';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import useLifecycle, { LIFECYCLE, Lifecycle } from '@core/hooks/useLifecycle';

import SettingsSection from '../SettingsSection';
import { PrivacyQuery } from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'Settings.Privacy.TradeResponseTime.title',
    defaultMessage: 'Hiding your response time',
  },
  description: {
    id: 'Settings.Privacy.TradeResponseTime.description',
    defaultMessage:
      "You can decide to hide your response time from other managers so they don't see how fast you typically answer trades.",
  },
  activityTitle: {
    id: 'Settings.Privacy.Activity.title',
    defaultMessage: 'Hiding your activity',
  },
  activityDescription: {
    id: 'Settings.Privacy.Activity.description',
    defaultMessage:
      "You can decide to hide your online status and response time from other managers so they don't see how fast you typically answer trades or whether you're connected or not.",
  },
  answersIn: {
    id: 'Settings.Privacy.TradeResponseTimet.answersIn',
    defaultMessage:
      'Other managers will see you typically answer in <bold>less than {hours, plural, one {# hour} other {# hours}}</bold>.',
  },
});

const PRIVACY_QUERY = gql`
  query PrivacyQuery {
    currentUser {
      slug
      hoursToAnswerTrades
    }
  }
`;

const Privacy = () => {
  const { currentUser } = useCurrentUserContext();
  const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const hideActivity = lifecycle?.hideActivity;
  const { update } = useLifecycle();
  const {
    flags: { displayActiveUser = false },
  } = useFeatureFlags();

  // we query the `hoursToAnswerTrades` lazily as it's a bit expensive
  const { data } = useQuery<PrivacyQuery>(PRIVACY_QUERY);

  return (
    <SettingsSection
      title={displayActiveUser ? messages.activityTitle : messages.title}
      description={
        displayActiveUser ? messages.activityDescription : messages.description
      }
      toggleButton={
        <Switch
          checked={hideActivity}
          onChange={() => update(LIFECYCLE.hideActivity, !hideActivity)}
        />
      }
    >
      {data?.currentUser?.hoursToAnswerTrades && (
        <span>
          <FormattedMessage
            {...messages.answersIn}
            values={{ hours: data.currentUser.hoursToAnswerTrades, bold: Bold }}
          />
        </span>
      )}
    </SettingsSection>
  );
};

export default Privacy;
