import { OwnerTransfer } from '@sorare/core/src/__generated__/globalTypes';

import Pack from 'components/transfers/Pack';
import ReferralReward from 'components/transfers/ReferralReward';
import Reward from 'components/transfers/Reward';
import Transfer from 'components/transfers/Transfer';

export const TokenTransferTypeIcon = ({
  transferType,
}: {
  transferType: OwnerTransfer;
}) => {
  if (
    [OwnerTransfer.PACK, OwnerTransfer.BUNDLED_ENGLISH_AUCTION].includes(
      transferType
    )
  ) {
    return <Pack />;
  }
  if (OwnerTransfer.REFERRAL === transferType) {
    return <ReferralReward />;
  }
  if (
    [OwnerTransfer.ENGLISH_AUCTION, OwnerTransfer.SINGLE_SALE_OFFER].includes(
      transferType
    )
  ) {
    return null;
  }
  if (OwnerTransfer.REWARD === transferType) {
    return <Reward />;
  }
  return <Transfer />;
};

export default TokenTransferTypeIcon;
