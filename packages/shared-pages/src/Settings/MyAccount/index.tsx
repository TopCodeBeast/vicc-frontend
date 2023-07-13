// import { AcceptCashOnly } from '@sorare/core/src/components/settings/AcceptCashOnly';
// import ActivityReports from '@sorare/core/src/components/settings/ActivityReports';
// import BlockedUsers from '@sorare/core/src/components/settings/BlockedUsers';
// import ConnectedAccounts from '@sorare/core/src/components/settings/ConnectedAccounts';
// import DeleteAccount from '@sorare/core/src/components/settings/DeleteAccount';
// import EthereumAccounts from '@sorare/core/src/components/settings/EthereumAccounts';
// import HideCommonCards from '@sorare/core/src/components/settings/HideCommonCards';
// import MyReferrer from '@sorare/core/src/components/settings/MyReferrer';
import UpdateEmails from '@sorare/core/src/components/settings/UpdateEmails';
// import UpdateProfile from '@sorare/core/src/components/settings/UpdateProfile';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

// import DepositCard from '@sorare/marketplace/src/components/settings/DepositCard';

// import USActivityReports from '@sorare/us-sports/src/components/settings/ActivityReports';

import { SettingsTabRoot } from '@shared-pages/Settings/ui';

export const MyAccount = () => {
  const {
    flags: { useCashOnlyOffersSettings = false },
  } = useFeatureFlags();

  return (
    <SettingsTabRoot>
      {/* <UpdateProfile withinSettings /> */}
      <UpdateEmails />
      {/* <ConnectedAccounts />
      <EthereumAccounts />
      <MyReferrer />
      <BlockedUsers /> */}
      {/* {useCashOnlyOffersSettings && <AcceptCashOnly />} */}
      {/* <HideCommonCards /> */}
      {/* <DepositCard /> */}
      {/* <ActivityReports usSportsActivityReports={<USActivityReports />} /> */}
      {/* <DeleteAccount /> */}
    </SettingsTabRoot>
  );
};

export default MyAccount;
