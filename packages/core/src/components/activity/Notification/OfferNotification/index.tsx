import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Bold from '@sorare/core/src/atoms/typography/Bold';
import { DumbNotification } from 'components/activity/DumbNotification';
import {
  MY_SORARE_MY_OFFER_RECEIVED,
  MY_SORARE_MY_OFFER_SENT,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from 'contexts/currentUser';
import idFromObject from 'gql/idFromObject';
import { isType } from '@sorare/core/src/lib/gql';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { OfferNotification_offerNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: OfferNotification_offerNotification;
};

type OfferNotification_tokenOffer_User = (
  | OfferNotification_offerNotification['tokenOffer']['receiver']
  | OfferNotification_offerNotification['tokenOffer']['sender']
) & {
  __typename: 'User';
};

const messages = defineMessages({
  offer_received: {
    id: 'Activity.Notifications.offerReceived',
    defaultMessage: 'You received an offer from <b>{nickname}</b>',
  },
  offer_accepted: {
    id: 'Activity.Notifications.offerAccepted',
    defaultMessage: '<b>{nickname}</b> has accepted your offer',
  },
  offer_rejected: {
    id: 'Activity.Notifications.offerRejected',
    defaultMessage: '<b>{nickname}</b> has rejected your offer',
  },
  offer_cancelled: {
    id: 'Activity.Notifications.offerCancelled',
    defaultMessage:
      'Your offer has been canceled: <b>{nickname}</b> accepted another offer',
  },
  offer_countered: {
    id: 'Activity.Notifications.offerCountered',
    defaultMessage: '<b>{nickname}</b> has sent you a counter offer',
  },
});

export const OfferNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const { name, createdAt, sport, tokenOffer, read } = notification;

  const link = useMemo(() => {
    if (
      isType(tokenOffer.sender, 'User') &&
      tokenOffer.sender.slug === currentUser?.slug
    ) {
      return generatePath(MY_SORARE_MY_OFFER_SENT, {
        id: idFromObject(tokenOffer.id),
      });
    }
    return generatePath(MY_SORARE_MY_OFFER_RECEIVED, {
      id: idFromObject(tokenOffer.id),
    });
  }, [currentUser?.slug, tokenOffer]);

  let user;
  switch (name) {
    case 'offer_accepted':
    case 'offer_rejected':
    case 'offer_cancelled':
      user = tokenOffer.receiver as OfferNotification_tokenOffer_User;
      break;
    case 'offer_received':
    case 'offer_countered':
      user = tokenOffer.sender as OfferNotification_tokenOffer_User;
      break;
    default:
  }

  const title = messages[name as keyof typeof messages];

  return (
    <DumbNotification
      title={
        title && (
          <FormattedMessage
            {...title}
            values={{ b: Bold, nickname: user?.nickname || '' }}
          />
        )
      }
      userAvatar={user}
      link={link}
      createdAt={createdAt}
      sport={sport}
      read={read}
      {...rest}
    />
  );
};

OfferNotification.fragments = {
  offerNotification: gql`
    fragment OfferNotification_offerNotification on OfferNotification {
      ...Notification_notificationInterface
      sport
      tokenOffer {
        id
        status
        sender {
          ... on User {
            slug
            nickname
            ...DumbNotification_userAvatar
          }
        }
        receiver {
          ... on User {
            slug
            nickname
            ...DumbNotification_userAvatar
          }
        }
      }
    }
    ${commonNotificationInterfaceFragment}
    ${DumbNotification.fragments.avatarUser}
  `,
};
