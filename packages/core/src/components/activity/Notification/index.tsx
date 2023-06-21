import { gql } from '@apollo/client';

import { isType } from 'gql';

import { AnnouncementNotification } from './AnnouncementNotification';
import { AuctionNotification } from './AuctionNotification';
import { CardCollectionNotification } from './CardCollectionNotification';
import { CardNotification } from './CardNotification';
import { ChallengeNotification } from './ChallengeNotification';
import { ExternalDepositNotification } from './ExternalDepositNotification';
import { OfferNotification } from './OfferNotification';
import { ReferralRewardNotification } from './ReferralRewardNotification';
import { SaleNotification } from './SaleNotification';
import { So5LineupNotification } from './So5LineupNotification';
import { So5UserGroupNotification } from './So5UserGroupNotification';
import { Notification_notification } from './__generated__/index.graphql';
import { CommonNotificationProps } from './types';

type Props = CommonNotificationProps & {
  notification: Notification_notification;
};

export const Notification = ({ notification, ...rest }: Props) => {
  if (isType(notification, 'AuctionNotification')) {
    return <AuctionNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'SaleNotification')) {
    return <SaleNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'OfferNotification')) {
    return <OfferNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'So5LineupNotification')) {
    return <So5LineupNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'AnnouncementNotification')) {
    return <AnnouncementNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'ReferralRewardNotification')) {
    return <ReferralRewardNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'CardNotification')) {
    return <CardNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'ChallengeNotification')) {
    return <ChallengeNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'So5UserGroupNotification')) {
    return <So5UserGroupNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'CardCollectionNotification')) {
    return <CardCollectionNotification notification={notification} {...rest} />;
  }
  if (isType(notification, 'ExternalDepositNotification')) {
    return (
      <ExternalDepositNotification notification={notification} {...rest} />
    );
  }

  return null;
};

Notification.fragments = {
  notification: gql`
    fragment Notification_notification on Notification {
      ...AuctionNotification_auctionNotification
      ...SaleNotification_saleNotification
      ...OfferNotification_offerNotification
      ...So5LineupNotification_so5LineupNotification
      ...AnnouncementNotification_announcementNotification
      ...ReferralRewardNotification_referralRewardNotification
      ...CardNotification_cardNotification
      ...ChallengeNotification_challengeNotification
      ...So5UserGroupNotification_so5UserGroupNotification
      ...CardCollectionNotification_cardCollectionNotification
      ...ExternalDepositNotification_externalDepositNotification
    }
    ${AuctionNotification.fragments.auctionNotification}
    ${SaleNotification.fragments.saleNotification}
    ${OfferNotification.fragments.offerNotification}
    ${So5LineupNotification.fragments.so5LineupNotification}
    ${AnnouncementNotification.fragments.announcementNotification}
    ${ReferralRewardNotification.fragments.referralRewardNotification}
    ${CardNotification.fragments.cardNotification}
    ${ChallengeNotification.fragments.challengeNotification}
    ${So5UserGroupNotification.fragments.so5UserGroupNotification}
    ${CardCollectionNotification.fragments.cardCollectionNotification}
    ${ExternalDepositNotification.fragments.externalDepositNotification}
  `,
};

export default Notification;
