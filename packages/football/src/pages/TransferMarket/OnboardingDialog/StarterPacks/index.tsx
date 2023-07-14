import { defineMessages } from 'react-intl';

import { LIFECYCLE } from '@sorare/core/src/hooks/useLifecycle';

import OnboardingDialog from '@football/pages/TransferMarket/OnboardingDialog';
import useGetCurrentUserPurchases from '@football/pages/TransferMarket/OnboardingDialog/useGetCurrentUserPurchases';
import coverDesktop from '@football/pages/TransferMarket/assets/starter_packs_desktop.png';
import cover from '@football/pages/TransferMarket/assets/starter_packs_mobile.png';

const messages = defineMessages({
  title: {
    id: 'StartersPacksOnboardingDialog.title',
    defaultMessage: 'Starter Packs',
  },
  description: {
    id: 'StartersPacksOnboardingDialog.description',
    defaultMessage:
      'Discover our curated teams of in-form players, built to be directly playable in tournament',
  },
});

const StartersPacks = ({
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
      lifecycleKey={LIFECYCLE.sawStarterPacksOnboarding}
      show={data?.currentUser?.boughtSingleSaleTokenOffers?.totalCount === 0}
      open={open}
      onClick={onClick}
    />
  );
};

export default StartersPacks;
