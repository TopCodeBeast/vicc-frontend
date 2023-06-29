import { gql } from '@apollo/client';
import styled from 'styled-components';

import { isType } from '@sorare/core/src/gql';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { EmptySlot } from '@football/components/collections/EmptySlot';
import { FulfilledSlot } from '@football/components/collections/FulfilledSlot';

import {
  CollectionSlots_cardCollection,
  CollectionSlots_cardCollectionSlot,
  CollectionSlots_userCardCollectionSlot,
} from './__generated__/index.graphql';
import { useEmptySlotsSales } from './queries';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  column-gap: var(--double-unit);
  row-gap: var(--triple-unit);
  padding: var(--double-unit) 0;
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

type Props = {
  slots:
    | CollectionSlots_userCardCollectionSlot[]
    | CollectionSlots_cardCollectionSlot[];
  cardCollection?: CollectionSlots_cardCollection;
  readOnly: boolean;
};

export const CollectionSlots = ({ cardCollection, slots, readOnly }: Props) => {
  const {
    flags: { usePricesInCollection = false },
  } = useFeatureFlags();
  const { emptySlotsSales } = useEmptySlotsSales(
    slots,
    cardCollection,
    readOnly || !usePricesInCollection
  );
  return (
    <Wrapper>
      {slots.map((slot: any) => {
        if (isType(slot, 'UserCardCollectionSlot')) {
          const isFilled = slot.cardCollectionCardsCount > 0;
          return isFilled ? (
            <FulfilledSlot
              key={slot.slug}
              bannerPictureUrl={cardCollection.bannerPictureUrl || ''}
              userSlot={slot}
              cardCollection={cardCollection}
            />
          ) : (
            <EmptySlot
              slot={slot.slot}
              key={slot.slot.id}
              saleToken={emptySlotsSales?.[slot.slot.player.slug]}
              readOnly={readOnly || !usePricesInCollection}
            />
          );
        }
        if (isType(slot, 'CardCollectionSlot')) {
          return (
            <EmptySlot
              slot={slot}
              key={slot.id}
              saleToken={emptySlotsSales?.[slot.player.slug]}
              readOnly={readOnly || !usePricesInCollection}
            />
          );
        }

        return null;
      })}
    </Wrapper>
  );
};

CollectionSlots.fragments = {
  userCardCollectionSlot: gql`
    fragment CollectionSlots_userCardCollectionSlot on UserCardCollectionSlot {
      slug
      cardCollectionCardsCount
      slot {
        id
        player {
          slug
        }
        ...EmptySlot_cardCollectionSlot
      }
      ...FulfilledSlot_userCardCollectionSlot
    }
    ${EmptySlot.fragments.cardCollectionSlot}
    ${FulfilledSlot.fragments.userCardCollectionSlot}
  `,
  cardCollectionSlot: gql`
    fragment CollectionSlots_cardCollectionSlot on CardCollectionSlot {
      id
      player {
        slug
      }
      ...EmptySlot_cardCollectionSlot
    }
    ${EmptySlot.fragments.cardCollectionSlot}
  `,
  cardCollection: gql`
    fragment CollectionSlots_cardCollection on CardCollection {
      slug
      rarity
      bannerPictureUrl
      season {
        startYear
      }
      bannerPictureUrl
      team {
        ... on TeamInterface {
          slug
        }
      }
      ...FulfilledSlot_cardCollection
    }
    ${FulfilledSlot.fragments.cardCollection}
  `,
};
