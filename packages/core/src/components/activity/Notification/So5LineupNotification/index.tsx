import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Bold from '@sorare/core/src/atoms/typography/Bold';
import { DumbNotification } from 'components/activity/DumbNotification';
import {
  FOOTBALL_COMPETITION_DETAILS_TEAM,
  FOOTBALL_COMPOSE_TEAM_LINEUP,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';

import { commonNotificationInterfaceFragment } from '../fragments';
import { So5LineupNotification_so5LineupNotification } from './__generated__/index.graphql';

type Props = {
  notification: So5LineupNotification_so5LineupNotification;
};

const messages = defineMessages({
  so5_lineup_too_powerful: {
    id: 'Activity.Notifications.so5LineupTooPowerful',
    defaultMessage: 'Your lineup for <b>{leaderboard}</b> is too powerful',
  },
  so5_lineup_invalid: {
    id: 'Activity.Notifications.so5LineupInvalid',
    defaultMessage: 'Your lineup for <b>{leaderboard}</b> is not valid anymore',
  },
  appearance_destroyed: {
    id: 'Activity.Notifications.appearanceRemoved',
    defaultMessage:
      'Your card <b>{card}</b> has been removed from <b>{leaderboard}</b>',
  },
  so5_lineup_cancelled: {
    id: 'Activity.Notifications.so5LineupCancelled',
    defaultMessage: 'Your lineup for <b>{leaderboard}</b> has been cancelled',
  },
});

export const So5LineupNotification = ({ notification, ...rest }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const { createdAt, name, so5Lineup, appearance, sport, read } = notification;
  if (!so5Lineup.so5Leaderboard) return null;

  const link =
    name === 'so5_lineup_cancelled' || name === 'appearance_destroyed'
      ? generatePath(FOOTBALL_COMPETITION_DETAILS_TEAM, {
          competition: so5Lineup.so5Leaderboard.slug,
        })
      : generatePath(FOOTBALL_COMPOSE_TEAM_LINEUP, {
          so5LeaderboardSlug: so5Lineup.so5Leaderboard.slug,
          so5LineupId: idFromObject(so5Lineup.id),
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
              leaderboard: so5Lineup.so5Leaderboard.displayName,
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

So5LineupNotification.fragments = {
  so5LineupNotification: gql`
    fragment So5LineupNotification_so5LineupNotification on So5LineupNotification {
      ...Notification_notificationInterface
      appearance: card {
        slug
        assetId
        name
      }
      so5Lineup {
        id
        so5Fixture {
          slug
        }
        so5Leaderboard {
          slug
          displayName
          rarityType
          so5League {
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
  `,
};
