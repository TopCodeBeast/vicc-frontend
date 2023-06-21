import { gql } from '@apollo/client';
import styled from 'styled-components';

import { isType } from '@sorare/core/src/gql';
import { theme } from '@sorare/core/src/style/theme';

import { EmptySlot } from '@football/components/collections/EmptySlot';
import { FulfilledSlot } from '@football/components/collections/FulfilledSlot';

import {
  CollectionSlots_cardCollection,
  CollectionSlots_cardCollectionSlot,
  CollectionSlots_userCardCollectionSlot,
} from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  column-gap: var(--double-unit);
  row-gap: var(--triple-unit);
  padding: var(--double-unit) 0;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

type Props = {
  bannerPictureUrl: string;
  slots:
    | CollectionSlots_userCardCollectionSlot[]
    | CollectionSlots_cardCollectionSlot[];
  cardCollection?: CollectionSlots_cardCollection;
};

export const CollectionSlots = ({
  bannerPictureUrl,
  slots,
  cardCollection,
}: Props) => {
  return (
    <Wrapper>
      {slots.map(slot => {
        if (isType(slot, 'UserCardCollectionSlot')) {
          const isFilled = slot.cardCollectionCardsCount > 0;
          return isFilled ? (
            <FulfilledSlot
              key={slot.slug}
              bannerPictureUrl={bannerPictureUrl}
              userSlot={slot}
              cardCollection={cardCollection}
            />
          ) : (
            <EmptySlot slot={slot.slot} key={slot.slot.id} />
          );
        }
        if (isType(slot, 'CardCollectionSlot')) {
          return <EmptySlot slot={slot} key={slot.id} />;
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
      ...EmptySlot_cardCollectionSlot
    }
    ${EmptySlot.fragments.cardCollectionSlot}
  `,
  cardCollection: gql`
    fragment CollectionSlots_cardCollection on CardCollection {
      slug
      ...FulfilledSlot_cardCollection
    }
    ${FulfilledSlot.fragments.cardCollection}
  `,
};
