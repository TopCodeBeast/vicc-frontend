import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import GlareEffect from '@sorare/core/src/atoms/animations/GlareEffect';
import { CardScore } from '@sorare/core/src/components/collections/CardScore';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';
import { isMyCardListedOnMarket } from '@sorare/core/src/lib/cards';

import CardPreview from '@football/components/collections/CardPreview';

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
const StyledOpenItemDialogLink = styled(OpenItemDialogLink)`
  width: 100%;
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

  const cardListed = isMyCardListedOnMarket(card);

  return (
    <Wrapper>
      <StyledOpenItemDialogLink item={card} sport={Sport.FOOTBALL}>
        <GlareEffect
          width={320}
          pictureUrl={card.pictureUrl || ''}
          alt={slot.player.displayName}
        />
      </StyledOpenItemDialogLink>
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
          ...isMyCardListedOnMarket_card
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
    ${isMyCardListedOnMarket.fragments.card}
  ` as TypedDocumentNode<FulfilledSlot_userCardCollectionSlot>,
  cardCollection: gql`
    fragment FulfilledSlot_cardCollection on CardCollection {
      slug
      ...CardPreview_cardCollection
    }
    ${CardPreview.fragments.cardCollection}
  ` as TypedDocumentNode<FulfilledSlot_cardCollection>,
};
