import { MessageDescriptor, defineMessages } from 'react-intl';
import { Route } from 'react-router-dom';

import { Layout } from '@sorare/core/src/components/SharedPages/Layout';
import {
  SETTINGS_ACCOUNT,
  SETTINGS_NOTIFICATIONS,
  SETTINGS_PAYMENT,
  SETTINGS_SECURITY,
  SETTINGS_WILDCARD,
} from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { RootRoutes } from '@sorare/core/src/routing/RootRoutes';

import MyAccount from './MyAccount';
// import Notifications from './Notifications';
// import Payment from './Payment';
// import Security from './Security';

export const PAGE_IDS = [
  'account',
  'notifications',
  'security',
  'payment',
] as const;

export type MySorarePage = (typeof PAGE_IDS)[number];

const messages = defineMessages({
  settings: {
    id: 'Settings.title',
    defaultMessage: 'Settings',
  },
});

const TITLES: { [key in MySorarePage]: MessageDescriptor } =
  defineMessages<MySorarePage>({
    account: {
      id: 'Settings.account',
      defaultMessage: 'My Account',
    },
    notifications: {
      id: 'Settings.notifications',
      defaultMessage: 'Notifications',
    },
    security: {
      id: 'Settings.security',
      defaultMessage: 'Security',
    },
    payment: {
      id: 'Settings.payment',
      defaultMessage: 'Payment',
    },
  });

const SettingsLayout = ({ tab }: { tab: MySorarePage }) => {
  const { formatMessage } = useIntlContext();

  const tabs = [
    {
      value: 'account',
      label: formatMessage(TITLES.account),
      content: <MyAccount />,
      href: SETTINGS_ACCOUNT,
    },
    {
      value: 'notifications',
      label: formatMessage(TITLES.notifications),
      content: <>Notifications5555</>, //<Notifications />,
      href: SETTINGS_NOTIFICATIONS,
    },
    {
      value: 'security',
      label: formatMessage(TITLES.security),
      content: <>Security5555</>, //<Security />,
      href: SETTINGS_SECURITY,
    },
    {
      value: 'payment',
      label: formatMessage(TITLES.payment),
      content: <>Payment5555</>, //<Payment />,
      href: SETTINGS_PAYMENT,
    },
  ];

  return (
    <Layout
      title={formatMessage(messages.settings)}
      defaultTab={tab}
      tabs={tabs}
    />
  );
};

export const Settings = () => {
  return (
    <RootRoutes>
      <Route
        path={SETTINGS_ACCOUNT}
        element={<SettingsLayout tab="account" />}
      />
      <Route
        path={SETTINGS_NOTIFICATIONS}
        element={<SettingsLayout tab="notifications" />}
      />
      <Route
        path={SETTINGS_SECURITY}
        element={<SettingsLayout tab="security" />}
      />
      <Route
        path={SETTINGS_PAYMENT}
        element={<SettingsLayout tab="payment" />}
      />
      <Route
        path={SETTINGS_WILDCARD}
        element={<SettingsLayout tab="account" />}
      />
    </RootRoutes>
  );
};

export default Settings;
