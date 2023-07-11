import { ReactNode, useState } from 'react';

import RestrictedAccessContextProvider, { RestrictedAccessReason } from '.';

type Props = {
  children: ReactNode;
};
export const RestrictedAccessProvider = ({ children }: Props) => {
  const [showRestrictedAccess, setShowRestrictedAccess] =
    useState<RestrictedAccessReason>();

  return (
    <RestrictedAccessContextProvider
      value={{
        showRestrictedAccess,
        setShowRestrictedAccess,
      }}
    >
      {children}
    </RestrictedAccessContextProvider>
  );
};

export default RestrictedAccessProvider;
