import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Bold from '@core/atoms/typography/Bold';
import { DumbNotification } from '@core/components/activity/DumbNotification';
import {
  FOOTBALL_COMPETITION_DETAILS_TEAM,
  FOOTBALL_COMPOSE_TEAM_LINEUP,
} from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import idFromObject from '@core/gql/idFromObject';

import { commonNotificationInterfaceFragment } from '../fragments';
import { Vicc5LineupNotification_vicc5LineupNotification } from './__generated__/index.graphql';

type Props = {
  notification: Vicc5LineupNotification_vicc5LineupNotification;
};

const messages = defineMessages({
  vicc5_lineup_too_powerful: {
    id: 'Activity.Notifications.vicc5LineupTooPowerful',
    defaultMessage: 'Your lineup for <b>{leaderboard}</b> is too powerful',
  },
  vicc5_lineup_invalid: {
    id: 'Activity.Notifications.vicc5LineupInvalid',
    defaultMessage: 'Your lineup for <b>{leaderboard}</b> is not valid anymore',
  },
  appearance_destroyed: {
    id: 'Activity.Notifications.appearanceRemoved',
    defaultMessage:
      'Your card <b>{card}</b> has been removed from <b>{leaderboard}</b>',
  },
  vicc5_lineup_cancelled: {
    id: 'Activity.Notifications.vicc5LineupCancelled',
    defaultMessage: 'Your lineup for <b>{leaderboard}</b> has been cancelled',
  },
});

export const Vicc5LineupNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const { createdAt, name, vicc5Lineup, appearance, sport, read } = notification;
  if (!vicc5Lineup.vicc5Leaderboard) return null;

  const link =
    name === 'vicc5_lineup_cancelled' || name === 'appearance_destroyed'
      ? generatePath(FOOTBALL_COMPETITION_DETAILS_TEAM, {
          competition: vicc5Lineup.vicc5Leaderboard.slug,
        })
      : generatePath(FOOTBALL_COMPOSE_TEAM_LINEUP, {
          vicc5LeaderboardSlug: vicc5Lineup.vicc5Leaderboard.slug,
          vicc5LineupId: idFromObject(vicc5Lineup.id),
        });

  const title = messages[name as keyof typeof messages];

  return (
    <DumbNotification
      title={
        title && (
          <FormattedMessage
            {...title}
            values={{
              b: Bold,
              leaderboard: vicc5Lineup.vicc5Leaderboard.displayName,
              card: appearance?.name,
            }}
          />
        )
      }
      userAvatar={currentUser}
      link={link}
      createdAt={createdAt}
      sport={sport}
      read={read}
      {...rest}
    />
  );
};

Vicc5LineupNotification.fragments = {
  vicc5LineupNotification: gql`
    fragment Vicc5LineupNotification_vicc5LineupNotification on Vicc5LineupNotification {
      ...Notification_notificationInterface
      appearance: card {
        slug
        assetId
        name
      }
      vicc5Lineup {
        id
        vicc5Fixture {
          slug
        }
        vicc5Leaderboard {
          slug
          displayName
          rarityType
          vicc5League {
            slug
            name
            displayName
            shortDisplayName
            category
          }
        }
      }
    }
    ${commonNotificationInterfaceFragment}
  ` as TypedDocumentNode<Vicc5LineupNotification_vicc5LineupNotification>,
};
