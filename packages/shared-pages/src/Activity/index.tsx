import { defineMessages, useIntl } from 'react-intl';

import { Layout } from '@sorare/core/src/components/SharedPages/Layout';
import { News } from '@sorare/core/src/components/activity/News';
import { Notifications } from '@sorare/core/src/components/activity/Notifications';
import { ACTIVITY, ACTIVITY_NEWS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

const messages = defineMessages<string>({
  Activity: {
    id: 'Activity.title',
    defaultMessage: 'Activity',
  },
  Notifications: {
    id: 'Activity.notifications',
    defaultMessage: 'Notifications',
  },
  News: {
    id: 'Activity.news',
    defaultMessage: 'News',
  },
});

type Props = {
  tab: 'notifications' | 'news';
};

export const Activity = ({ tab }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { formatMessage } = useIntl();

  const notificationTab = {
    value: 'notifications',
    label: formatMessage(messages.Notifications),
    content: <Notifications />,
    href: ACTIVITY,
  };

  const tabs = [
    currentUser ? notificationTab : undefined,
    {
      value: 'news',
      label: formatMessage(messages.News),
      content: <News />,
      href: ACTIVITY_NEWS,
    },
  ].filter(Boolean);

  return (
    <Layout
      title={formatMessage(messages.Activity)}
      defaultTab={tab}
      tabs={tabs}
    />
  );
};

export default Activity;
