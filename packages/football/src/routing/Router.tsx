import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { DarkTheme } from '@sorare/core/src/routing/DarkTheme';

import { Subscription } from '@sorare/marketplace/src/components/Subscription';
import {
  tokenAuctionSubscription,
  tokenOfferSubscription,
} from '@sorare/marketplace/src/lib/fragments';

import UserDialog from '@sorare/football/src/components/user/UserDialog';
import { useCheckRedirectToOnboarding } from 'hooks/onboarding/useCheckRedirectToOnboarding';

import AppSwitch from './AppSwitch';

const subscriptionsVariables = { variables: { sports: [Sport.FOOTBALL] } };

export const AppRouter = () => {
  useCheckRedirectToOnboarding();
  return (
    <>
      <Subscription
        gql={tokenOfferSubscription}
        variables={subscriptionsVariables}
      />
      <Subscription
        gql={tokenAuctionSubscription}
        variables={subscriptionsVariables}
      />
      <DarkTheme>
        <AppSwitch />
      </DarkTheme>
      <UserDialog />
    </>
  );
};

export default AppRouter;
