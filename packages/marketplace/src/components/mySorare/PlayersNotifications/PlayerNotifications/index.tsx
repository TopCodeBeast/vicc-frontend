import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import TagButton from '@sorare/core/src/atoms/buttons/TagButton';
import useUpdateSubscription from '@sorare/core/src/hooks/subscriptions/useUpdateSubscription';
import {
  blockchainRarities,
  formatScarcity,
  subscribableRarities,
  usSportSubscribableRarities,
} from '@sorare/core/src/lib/cards';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import DumbPlayerDescription from '@marketplace/components/mySorare/common/DumbPlayerDescription';

import {
  PlayerNotifications_player,
  PlayerNotifications_subscription,
} from './__generated__/index.graphql';

interface Props {
  subscription: PlayerNotifications_subscription;
  item: PlayerNotifications_player;
}

const rarityNotificationsByType: Record<string, string[]> = {
  Player: subscribableRarities,
  BaseballPlayer: usSportSubscribableRarities,
  NBAPlayer: usSportSubscribableRarities,
};

const Root = styled.div`
  @media ${laptopAndAbove} {
    display: flex;
    justify-content: space-between;
  }
`;
const Scarcities = styled.div`
  display: flex;
  gap: 10px;
`;

export const PlayerNotifications = ({ subscription, item }: Props) => {
  const updateSubscription = useUpdateSubscription(subscription);

  return (
    <Root>
      {/* <DumbPlayerDescription
        {...item}
        positions={[item.position]}
        activeClubName={item.activeClub?.name}
      /> */}
      <Scarcities>
        {blockchainRarities.map(scarcity => {
          const selected =
            subscription.preferences.notifyForRarities.includes(scarcity as any);
          const disabled =
            !rarityNotificationsByType[subscription.subscribableType].includes(
              scarcity
            );
          return (
            <TagButton
              key={scarcity}
              selected={selected}
              disabled={disabled}
              onClick={() => {
                updateSubscription([scarcity], !selected);
              }}
            >
              {formatScarcity(scarcity)}
            </TagButton>
          );
        })}
      </Scarcities>
    </Root>
  );
};

PlayerNotifications.fragments = {
  subscription: gql`
    fragment PlayerNotifications_subscription on EmailSubscription {
      slug
      subscribableType
      preferences {
        slug
        notifyForRarities
      }
    }
  ` as TypedDocumentNode<PlayerNotifications_subscription>,
  player: gql`
    fragment PlayerNotifications_player on Player {
      slug
      displayName
      avatarImageUrl: pictureUrl(derivative: "avatar")
      position: positionTyped
      shirtNumber
      activeClub {
        slug
        name
      }
    }
  ` as TypedDocumentNode<PlayerNotifications_player>,
};

export default PlayerNotifications;
