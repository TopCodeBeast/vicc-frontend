import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Text14 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import { DumbNotification } from '@core/components/activity/DumbNotification';
import TokenDescriptionFromProps from '@core/components/token/TokenDescriptionFromProps';
import TokenMetas from '@core/components/token/TokenMetas';
import {
  FOOTBALL_CLUB_SHOP_INVENTORY,
  FOOTBALL_USER_CARD_COLLECTION,
} from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { getShieldScoreRequirement } from '@core/lib/collections';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { CardCollectionNotification_cardCollectionNotification } from './__generated__/index.graphql';

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

type Props = CommonNotificationProps & {
  notification: CardCollectionNotification_cardCollectionNotification;
};

export const CardCollectionNotification = ({
  notification,
  ...rest
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) return null;
  const { name, createdAt, card, cardCollection, sport, read, shieldShopItem } =
    notification;

  if (name === 'card_attached' && card) {
    return (
      <DumbNotification
        title={
          <FormattedMessage
            id="Activity.Notifications.cardAttached"
            defaultMessage="<b>{card}</b> has been added to your collection <b>{collection}</b>"
            values={{
              b: Bold,
              card: card.name,
              collection: cardCollection.name,
            }}
          />
        }
        userAvatar={currentUser}
        link={generatePath(FOOTBALL_USER_CARD_COLLECTION, {
          slug: currentUser.slug,
          collectionSlug: cardCollection.slug,
        })}
        tokenPicture={card?.token}
        content={
          card.token && (
            <TokenDescriptionFromProps
              displayName={card.token.metadata.playerDisplayName}
              path={null}
              withoutLink
              description={
                <TokenMetas token={card.token} separator={<> &ndash; </>} />
              }
              Title={Text14}
              Details={Text14}
            />
          )
        }
        createdAt={createdAt}
        sport={sport}
        read={read}
        {...rest}
      />
    );
  }

  if (name === 'shield_rewarded') {
    return (
      <DumbNotification
        title={
          <FormattedMessage
            id="Activity.Notifications.shieldRewarded"
            defaultMessage="Congrats! You have unlocked the <b>{clubName}</b> Club Badge in the club shop by reaching {score} points in the <b>{collection}</b> collection"
            values={{
              b: Bold,
              clubName: cardCollection.team?.name,
              score: getShieldScoreRequirement(
                cardCollection.slug,
                shieldShopItem
              ),
              collection: cardCollection.name,
            }}
          />
        }
        userAvatar={currentUser}
        link={FOOTBALL_CLUB_SHOP_INVENTORY}
        createdAt={createdAt}
        sport={sport}
        read={read}
        {...rest}
      />
    );
  }

  if (name === 'shield_deprived') {
    const equippedClubShieldId = currentUser?.profile.clubShield?.id;
    const collectionShieldId = shieldShopItem?.id;

    return (
      <DumbNotification
        title={
          <FlexWrapper>
            <span>
              <FormattedMessage
                id="Activity.Notifications.shieldDeprived"
                defaultMessage="You lost access to the <b>{clubName}</b> Club Badge in the club shop by scoring under {score} points in the <b>{collection}</b> collection"
                values={{
                  b: Bold,
                  clubName: cardCollection.team?.name,
                  score: getShieldScoreRequirement(
                    cardCollection.slug,
                    shieldShopItem
                  ),
                  collection: cardCollection.name,
                }}
              />
            </span>
            {equippedClubShieldId === collectionShieldId && (
              <span>
                <FormattedMessage
                  id="Activity.Notification.equippedShieldDeprived"
                  defaultMessage="You will lose access to your badge once it is unequipped"
                />
              </span>
            )}
          </FlexWrapper>
        }
        userAvatar={currentUser}
        link={generatePath(FOOTBALL_USER_CARD_COLLECTION, {
          slug: currentUser.slug,
          collectionSlug: cardCollection.slug,
        })}
        createdAt={createdAt}
        sport={sport}
        read={read}
        {...rest}
      />
    );
  }

  return null;
};

CardCollectionNotification.fragments = {
  cardCollectionNotification: gql`
    fragment CardCollectionNotification_cardCollectionNotification on CardCollectionNotification {
      ...Notification_notificationInterface
      cardCollection {
        slug
        name
        team {
          ... on TeamInterface {
            slug
            name
          }
        }
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
      shieldShopItem {
        id
        ...getShieldScoreRequirement_skinShopItem
      }
    }
    ${commonNotificationInterfaceFragment}
    ${DumbNotification.fragments.tokenPicture}
    ${TokenMetas.fragments.token}
    ${getShieldScoreRequirement.fragments.skinShopItem}
  `,
};
