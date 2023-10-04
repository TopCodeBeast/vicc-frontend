import { defineMessages } from 'react-intl';

import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';

import OnboardingDialog from '@football/pages/TransferMarket/OnboardingDialog';
import useGetCurrentUserPurchases from '@football/pages/TransferMarket/OnboardingDialog/useGetCurrentUserPurchases';
import coverDesktop from '@football/pages/TransferMarket/assets/auctions_desktop.jpg';
import cover from '@football/pages/TransferMarket/assets/auctions_mobile.jpg';

const messages = defineMessages({
  title: {
    id: 'NewsSigningsOnboardingDialog.title',
    defaultMessage: 'New card auctions',
  },
  description: {
    id: 'NewsSigningsOnboardingDialog.description',
    defaultMessage:
      'Bid on cards in auctions to take a chance at becoming the first owner of those new Vicc cards',
  },
});

const NewsSignings = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => {
  const { data } = useGetCurrentUserPurchases();
  return (
    <OnboardingDialog
      title={messages.title}
      description={messages.description}
      img={cover}
      imgDesktop={coverDesktop}
      lifecycleKey={LIFECYCLE.sawMarketplaceOnboarding}
      show={data?.currentUser?.wonAuctions?.totalCount === 0}
      open={open}
      onClick={onClick}
    />
  );
};

export default NewsSignings;
