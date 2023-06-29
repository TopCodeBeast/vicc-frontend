import { defineMessages } from 'react-intl';

import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';

import OnboardingDialog from '@football/pages/TransferMarket/OnboardingDialog';
import useGetCurrentUserPurchases from '@football/pages/TransferMarket/OnboardingDialog/useGetCurrentUserPurchases';
import coverDesktop from '@football/pages/TransferMarket/assets/manager_sales_desktop.png';
import cover from '@football/pages/TransferMarket/assets/manager_sales_mobile.png';

const messages = defineMessages({
  title: {
    id: 'SalesOnboardingDialog.title',
    defaultMessage: 'Manager Sales',
  },
  description: {
    id: 'SalesOnboardingDialog.description',
    defaultMessage:
      'Scout the next superstar and buy player cards directly from other Sorare Managers',
  },
});

const ManagersSales = ({
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
      lifecycleKey={LIFECYCLE.sawManagersSalesOnboarding}
      show={data?.currentUser?.boughtSingleSaleTokenOffers?.totalCount === 0}
      onClick={onClick}
      open={open}
    />
  );
};

export default ManagersSales;
