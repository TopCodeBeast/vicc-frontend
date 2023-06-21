import { gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';
import { isListedOnMarket } from '@sorare/core/src/lib/cards';

import CardPreview from '@football/components/collections/CardPreview';
import CardScore from '@football/components/collections/CardScore';

import {
  FulfilledSlot_cardCollection,
  FulfilledSlot_userCardCollectionSlot,
} from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
`;

type Props = {
  bannerPictureUrl: string;
  userSlot: FulfilledSlot_userCardCollectionSlot;
  cardCollection?: FulfilledSlot_cardCollection;
};
export const FulfilledSlot = ({
  bannerPictureUrl,
  userSlot,
  cardCollection,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { highlightedCardCollectionCard, slot } = userSlot;

  if (!highlightedCardCollectionCard) return null;

  const { card, scoreBreakdown } = highlightedCardCollectionCard;

  const cardListed = isListedOnMarket(card);

  return (
    <Wrapper>
      <OpenItemDialogLink item={card} sport={Sport.FOOTBALL}>
        <CardImg
          width={320}
          src={card.pictureUrl || ''}
          alt={slot.player.displayName}
        />
      </OpenItemDialogLink>
      <button type="button" onClick={() => setDialogOpen(true)}>
        <CardScore score={scoreBreakdown.total} listed={cardListed} />
      </button>
      <CardPreview
        bannerPictureUrl={bannerPictureUrl}
        cardCollectionCard={highlightedCardCollectionCard}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        cardCollection={cardCollection}
      />
    </Wrapper>
  );
};

FulfilledSlot.fragments = {
  userCardCollectionSlot: gql`
    fragment FulfilledSlot_userCardCollectionSlot on UserCardCollectionSlot {
      slug
      highlightedCardCollectionCard {
        id
        scoreBreakdown {
          total
        }
        card {
          slug
          assetId
          pictureUrl
          ...isListedOnMarket_card
        }
        ...CardPreview_cardCollectionCard
      }
      slot {
        id
        player {
          slug
          displayName
        }
      }
    }
    ${CardPreview.fragments.cardCollectionCard}
    ${isListedOnMarket.fragments.card}
  `,
  cardCollection: gql`
    fragment FulfilledSlot_cardCollection on CardCollection {
      slug
      ...CardPreview_cardCollection
    }
    ${CardPreview.fragments.cardCollection}
  `,
};
