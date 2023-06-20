import { useMemo } from 'react';

import {
  PrivateKeyRecoveryOptionMethodEnum,
  PrivateKeyRecoveryOptionStatusEnum,
} from '__generated__/globalTypes';
import { CurrentUser, useCurrentUserContext } from 'contexts/currentUser';

export type RecoveryOption = NonNullable<
  CurrentUser['wallet']
>['recoveryOptions'][number];

const RecoveryOptionsOrder = {
  [PrivateKeyRecoveryOptionStatusEnum.ACTIVE]: 1,
  [PrivateKeyRecoveryOptionStatusEnum.PENDING_VALIDATION]: 0,
  [PrivateKeyRecoveryOptionStatusEnum.INACTIVE]: 0,
} as const;

const useRecoveryOptions = () => {
  const { currentUser } = useCurrentUserContext();

  const recoveryEmails = useMemo(() => {
    if (currentUser?.wallet?.recoveryOptions) {
      return currentUser?.wallet?.recoveryOptions
        .filter(
          option =>
            option.status !== PrivateKeyRecoveryOptionStatusEnum.INACTIVE &&
            option.method === PrivateKeyRecoveryOptionMethodEnum.EMAIL &&
            option.destination !== currentUser.email
        )
        .sort(
          (a, b) =>
            RecoveryOptionsOrder[b.status] - RecoveryOptionsOrder[a.status]
        );
    }
    return [];
  }, [currentUser?.email, currentUser?.wallet?.recoveryOptions]);

  const accountEmail = useMemo(() => {
    if (currentUser?.wallet?.recoveryOptions) {
      return currentUser?.wallet?.recoveryOptions.find(
        option =>
          option.method === PrivateKeyRecoveryOptionMethodEnum.EMAIL &&
          option.destination === currentUser.email
      );
    }
    return undefined;
  }, [currentUser?.email, currentUser?.wallet?.recoveryOptions]);

  const phoneNumber = useMemo(() => {
    if (currentUser?.wallet?.recoveryOptions) {
      return currentUser?.wallet?.recoveryOptions.find(
        option => option.method === PrivateKeyRecoveryOptionMethodEnum.PHONE
      );
    }
    return undefined;
  }, [currentUser?.wallet?.recoveryOptions]);

  return {
    recoveryEmails,
    accountEmail,
    phoneNumber,
  };
};

export default useRecoveryOptions;
