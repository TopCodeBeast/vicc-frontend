import { UserWalletStatusEnum } from '__generated__/globalTypes';
import { useCurrentUserContext } from 'contexts/currentUser';

export const useWalletNeedsRecover = () => {
  const { currentUser } = useCurrentUserContext();

  if (!currentUser) {
    return false;
  }
  const { wallet } = currentUser;
  if (wallet) {
    return wallet.status !== UserWalletStatusEnum.READY;
  }
  // here it means that there is no wallet initialized and this needs to go through another chain
  return false;
};

export default useWalletNeedsRecover;
