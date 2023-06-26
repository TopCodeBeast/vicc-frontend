import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import Bold from '@core/atoms/typography/Bold';
import { DumbNotification } from '@core/components/activity/DumbNotification';
import { LEGACY_CARD_SHOW } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSportContext } from '@core/contexts/sport';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { CardNotification_cardNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: CardNotification_cardNotification;
};

const messages = defineMessages({
  card_withdrawal_started: {
    id: 'Activity.Notifications.cardWithdrawalStarted',
    defaultMessage: 'Your card <b>{card}</b> is transferring to Ethereum',
  },
  card_withdrawn: {
    id: 'Activity.Notifications.cardWithdrawn',
    defaultMessage: 'Your card <b>{card}</b> has been transferred to Ethereum',
  },
});

export const CardNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { generateSportPath } = useSportContext();

  const {
    name,
    createdAt,
    card,
    cardNotificationToken: token,
    sport,
    read,
  } = notification;

  if (
    !['card_withdrawal_started', 'card_withdrawn'].includes(name) &&
    !card &&
    !token
  )
    return null;

  const link = generateSportPath(LEGACY_CARD_SHOW, {
    params: {
      slug: token?.slug || card?.slug,
    },
    sport: token?.sport || Sport.FOOTBALL,
  });

  const title = messages[name as keyof typeof messages];

  return (
    <DumbNotification
      title={
        title && (
          <FormattedMessage
            {...title}
            values={{ b: Bold, card: card?.name || token?.name }}
          />
        )
      }
      userAvatar={currentUser}
      sport={token?.sport || sport}
      createdAt={createdAt}
      link={link}
      read={read}
      {...rest}
    />
  );
};

CardNotification.fragments = {
  cardNotification: gql`
    fragment CardNotification_cardNotification on CardNotification {
      ...Notification_notificationInterface
      card {
        slug
        assetId
        name
      }
      cardNotificationToken: token {
        slug
        assetId
        name
        sport
      }
    }
    ${commonNotificationInterfaceFragment}
  `,
};
