import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import { Text14 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { DumbNotification } from 'components/activity/DumbNotification';
import TokenDescriptionFromProps from 'components/token/TokenDescriptionFromProps';
import TokenMetas from 'components/token/TokenMetas';
import { FOOTBALL_USER_CARD_COLLECTION } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from 'contexts/currentUser';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { CardCollectionNotification_cardCollectionNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: CardCollectionNotification_cardCollectionNotification;
};

export const CardCollectionNotification = ({
  notification,
  ...rest
}: Props) => {
  const { currentUser } = useCurrentUserContext();

  const { createdAt, card, cardCollection, sport, read } = notification;
  if (!card || !currentUser) return null;

  const link = generatePath(FOOTBALL_USER_CARD_COLLECTION, {
    slug: currentUser.slug,
    collectionSlug: cardCollection.slug,
  });

  const content = card.token && (
    <TokenDescriptionFromProps
      displayName={card.token.metadata.playerDisplayName}
      path={null}
      withoutLink
      description={<TokenMetas token={card.token} separator={<> &ndash; </>} />}
      Title={Text14}
      Details={Text14}
    />
  );

  return (
    <DumbNotification
      title={
        <FormattedMessage
          id="Activity.Notifications.cardAttached"
          defaultMessage="<b>{card}</b> has been added to your collection <b>{collection}</b>"
          values={{ b: Bold, card: card.name, collection: cardCollection.name }}
        />
      }
      userAvatar={currentUser}
      link={link}
      tokenPicture={card.token}
      content={content}
      createdAt={createdAt}
      sport={sport}
      read={read}
      {...rest}
    />
  );
};

CardCollectionNotification.fragments = {
  cardCollectionNotification: gql`
    fragment CardCollectionNotification_cardCollectionNotification on CardCollectionNotification {
      ...Notification_notificationInterface
      cardCollection {
        slug
        name
      }
      card {
        assetId
        slug
        pictureUrl
        name
        token {
          assetId
          slug
          metadata {
            ... on TokenBaseballMetadata {
              id
            }
            ... on TokenFootballMetadata {
              id
            }
            ... on TokenCardMetadataInterface {
              playerDisplayName
              playerSlug
            }
          }
          ...DumbNotification_tokenPicture
          ...TokenDescription_tokenMetas
        }
      }
    }
    ${commonNotificationInterfaceFragment}
    ${DumbNotification.fragments.tokenPicture}
    ${TokenMetas.fragments.token}
  `,
};
