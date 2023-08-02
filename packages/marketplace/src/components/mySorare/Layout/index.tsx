import {
  faArrowAltToBottom,
  faArrowAltToTop,
  faBell,
  faEllipsisV,
  faFileInvoiceDollar,
  faGavel,
  faShoppingCart,
  faTag,
  faUserCheck,
} from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { AppLayout } from '@sorare/core/src/components/navigation/AppLayout';
import {
  MY_SORARE_AUCTIONS,
  MY_SORARE_FOLLOWS,
  MY_SORARE_NEW,
  MY_SORARE_OFFERS_RECEIVED,
  MY_SORARE_OFFERS_SENT,
  MY_SORARE_PLAYERS_NOTIFICATIONS,
  MY_SORARE_PURCHASES,
  MY_SORARE_SALES,
  MY_SORARE_TRANSACTIONS,
} from '@sorare/core/src/constants/routes';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import MultiSportAppBar from '@sorare/core/src/routing/MultiSportAppBar';
import MultiSportBottomNavBar from '@sorare/core/src/routing/MultiSportBottomNavBar';
import MultiSportFooter from '@sorare/core/src/routing/MultiSportFooter';
import RoutedSidebarMenu, {
  LinkSet,
} from '@sorare/core/src/routing/RoutedSidebarMenu';

import { MySorarePage, TITLES } from '../common/pages';

interface Props {
  children: ReactNode;
  label?: MessageDescriptor | string;
}

const links: LinkSet<MySorarePage> = {
  new: {
    to: MY_SORARE_NEW,
    icon: faEllipsisV,
    label: TITLES.new,
  },
  auctions: {
    to: MY_SORARE_AUCTIONS,
    icon: faGavel,
    label: TITLES.auctions,
  },
  sales: {
    to: MY_SORARE_SALES,
    icon: faTag,
    label: TITLES.sales,
  },
  purchases: {
    to: MY_SORARE_PURCHASES,
    icon: faShoppingCart,
    label: TITLES.purchases,
  },
  offers_received: {
    to: MY_SORARE_OFFERS_RECEIVED,
    icon: faArrowAltToBottom,
    label: TITLES.offers_received,
  },
  offers_sent: {
    to: MY_SORARE_OFFERS_SENT,
    icon: faArrowAltToTop,
    label: TITLES.offers_sent,
  },
  follows: {
    icon: faUserCheck,
    to: MY_SORARE_FOLLOWS,
    label: TITLES.follows,
  },
  players_notifications: {
    icon: faBell,
    to: MY_SORARE_PLAYERS_NOTIFICATIONS,
    label: TITLES.players_notifications,
  },
  transactions: {
    icon: faFileInvoiceDollar,
    to: MY_SORARE_TRANSACTIONS,
    label: TITLES.transactions,
  },
};

const Root = styled.div`
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const MySorareLayout = ({ children }: Props) => {
  const isReorgApp = useIsReorgApp();

  const content = (
    <RoutedSidebarMenu<MySorarePage>
      linkIds={Object.values(MySorarePage)}
      links={links}
    >
      {children}
    </RoutedSidebarMenu>
  );

  if (isReorgApp) {
    return <AppLayout>{content}</AppLayout>;
  }
  return (
    <Root>
      <MultiSportAppBar />
      {content}
      <MultiSportFooter />
      <MultiSportBottomNavBar />
    </Root>
  );
};

export default MySorareLayout;
