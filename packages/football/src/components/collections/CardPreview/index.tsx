import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import GlareEffect from '@sorare/core/src/atoms/animations/GlareEffect';
import { CardScore } from '@sorare/core/src/components/collections/CardScore';
import { DetailsDialogBanner } from '@sorare/core/src/components/collections/DetailsDialogBanner';
import Warning from '@sorare/core/src/components/collections/Warning';
import Dialog from '@sorare/core/src/components/dialog';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';
import { isMyCardListedOnMarket } from '@sorare/core/src/lib/cards';
import { getCollectionsTeamShield } from '@sorare/core/src/lib/collections';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import useCancelOffer from '@sorare/marketplace/src/hooks/offers/useCancelOffer';

import CollectionBackground from '@football/components/collections/CollectionBackground';
import { CollectionBonuses } from '@football/components/collections/CollectionBonuses';

import {
  CardPreview_cardCollection,
  CardPreview_cardCollectionCard,
} from './__generated__/index.graphql';

const DialogContainer = styled(CollectionBackground)`
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  padding: var(--double-unit);
  @media ${laptopAndAbove} {
    width: 480px;
  }
`;
const ActionButtonsWrapper = styled.div`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
  display: flex;
  gap: var(--unit);
`;
const CardImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--quadruple-unit);
  max-width: 250px;
`;

type Props = {
  cardCollectionCard: CardPreview_cardCollectionCard;
  bannerPictureUrl: string;
  open?: boolean;
  onClose: () => void;
  cardCollection?: CardPreview_cardCollection;
};
const CardPreview = ({
  cardCollectionCard,
  bannerPictureUrl,
  open,
  onClose,
  cardCollection,
}: Props) => {
  const [unlisting, setUnlisting] = useState(false);
  const [unlisted, setUnlisted] = useState(false);
  const { card, scoreBreakdown } = cardCollectionCard;
  const { __typename, total, ...scores } = scoreBreakdown;
  const theoricalScore = Object.values(scores).reduce(
    (sum, value) => sum + value
  );
  const cancelOffer = useCancelOffer();
  const belongsToUser = useTokenOfferBelongsToUser();

  const cardListed = isMyCardListedOnMarket(card);

  const onUnlist = async () => {
    const offer = card.token?.myMintedSingleSaleOffer;
    if (offer && belongsToUser(offer) && offer.blockchainId) {
      setUnlisting(true);
      const errors = await cancelOffer(offer.blockchainId);
      if ((errors?.length || 0) > 0) {
        setUnlisted(false);
      } else {
        setUnlisted(true);
      }
      setUnlisting(false);
    }
  };

  const displayWarning = cardListed && !unlisted;

  return (
    <Dialog
      darkTheme
      open={open}
      maxWidth="sm"
      onClose={onClose}
      hideHeader
      body={({ CloseButton }) => (
        <DialogContainer bannerPictureUrl={bannerPictureUrl}>
          <ActionButtonsWrapper>
            <CloseButton onClose={onClose} />
          </ActionButtonsWrapper>
          <CardImageWrapper>
            <GlareEffect pictureUrl={card.pictureUrl} />
          </CardImageWrapper>
          <CardScore
            score={unlisted ? theoricalScore : total}
            listed={displayWarning}
          />
          <CollectionBonuses
            cardCollectionCard={cardCollectionCard}
            displayWarning={displayWarning}
          />
          {displayWarning && <Warning onClick={onUnlist} loading={unlisting} />}
          <DetailsDialogBanner
            teamShield={getCollectionsTeamShield(cardCollection)}
          />
        </DialogContainer>
      )}
    />
  );
};

CardPreview.fragments = {
  cardCollectionCard: gql`
    fragment CardPreview_cardCollectionCard on CardCollectionCard {
      id
      card {
        assetId
        slug
        pictureUrl
        token {
          assetId
          slug
          myMintedSingleSaleOffer {
            id
            blockchainId
            ...useTokenOfferBelongsToUser_offer
          }
        }
        ...isMyCardListedOnMarket_card
      }
      scoreBreakdown {
        firstOwner
        firstSerialNumber
        holding
        owner
        shirtMatchingSerialNumber
        specialEdition
        total
      }
      ...CollectionBonuses_cardCollectionCard
    }
    ${isMyCardListedOnMarket.fragments.card}
    ${useTokenOfferBelongsToUser.fragments.offer}
    ${CollectionBonuses.fragments.cardCollectionCard}
  ` as TypedDocumentNode<CardPreview_cardCollectionCard>,
  cardCollection: gql`
    fragment CardPreview_cardCollection on CardCollection {
      slug
      ...getCollectionsShield_cardCollection
    }
    ${getCollectionsTeamShield.fragments.cardCollection}
  ` as TypedDocumentNode<CardPreview_cardCollection>,
};

export default CardPreview;
