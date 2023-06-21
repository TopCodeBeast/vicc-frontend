import { MessageDescriptor, defineMessages } from 'react-intl';

import { OwnerTransfer } from '@core/__generated__/globalTypes';

const messages = defineMessages<
  Exclude<OwnerTransfer, OwnerTransfer.SINGLE_BUY_OFFER>,
  MessageDescriptor
>({
  [OwnerTransfer.DIRECT_OFFER]: {
    id: 'TransferType.OwnerTransfer.trade',
    defaultMessage: 'Traded to {owner}',
  },
  [OwnerTransfer.REWARD]: {
    id: 'TransferType.OwnerTransfer.reward',
    defaultMessage: 'Won as a reward by {owner}',
  },
  [OwnerTransfer.REFERRAL]: {
    id: 'TransferType.OwnerTransfer.referral',
    defaultMessage: 'Won as a referral reward by {owner}',
  },
  [OwnerTransfer.SINGLE_SALE_OFFER]: {
    id: 'TransferType.OwnerTransfer.sale',
    defaultMessage: 'Bought by {owner}',
  },
  [OwnerTransfer.BUNDLED_ENGLISH_AUCTION]: {
    id: 'TransferType.OwnerTransfer.bundled_english_auction',
    defaultMessage: 'Won in a bundle auction by {owner}',
  },
  [OwnerTransfer.ENGLISH_AUCTION]: {
    id: 'TransferType.OwnerTransfer.english_auction',
    defaultMessage: 'Won in an auction by {owner}',
  },
  [OwnerTransfer.PACK]: {
    id: 'TransferType.OwnerTransfer.pack',
    defaultMessage: 'Bought in a pack by {owner}',
  },
  [OwnerTransfer.MINT]: {
    id: 'TransferType.OwnerTransfer.mint',
    defaultMessage: 'Minted to {owner}',
  },
  [OwnerTransfer.TRANSFER]: {
    id: 'TransferType.OwnerTransfer.transfer',
    defaultMessage: 'Transferred to {owner}',
  },
  [OwnerTransfer.WITHDRAWAL]: {
    id: 'TransferType.OwnerTransfer.withdrawal',
    defaultMessage: 'Withdrawn by {owner}',
  },
  [OwnerTransfer.DEPOSIT]: {
    id: 'TransferType.OwnerTransfer.deposit',
    defaultMessage: 'Deposited by {owner}',
  },
});

export const transferTypes = {
  [OwnerTransfer.DIRECT_OFFER]: messages.DIRECT_OFFER,
  [OwnerTransfer.SINGLE_BUY_OFFER]: messages.DIRECT_OFFER,
  [OwnerTransfer.REWARD]: messages.REWARD,
  [OwnerTransfer.REFERRAL]: messages.REFERRAL,
  [OwnerTransfer.SINGLE_SALE_OFFER]: messages.SINGLE_SALE_OFFER,
  [OwnerTransfer.BUNDLED_ENGLISH_AUCTION]: messages.BUNDLED_ENGLISH_AUCTION,
  [OwnerTransfer.ENGLISH_AUCTION]: messages.ENGLISH_AUCTION,
  [OwnerTransfer.PACK]: messages.PACK,
  [OwnerTransfer.MINT]: messages.MINT,
  [OwnerTransfer.TRANSFER]: messages.TRANSFER,
  [OwnerTransfer.WITHDRAWAL]: messages.WITHDRAWAL,
  [OwnerTransfer.DEPOSIT]: messages.DEPOSIT,
};
