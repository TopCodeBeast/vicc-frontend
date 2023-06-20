import { gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import GlareEffect from '@sorare/core/src/atoms/animations/GlareEffect';
import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import Dialog from '@sorare/core/src/components/dialog';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';
import { isListedOnMarket } from '@sorare/core/src/lib/cards';
import { theme } from '@sorare/core/src/style/theme';

import useCancelOffer from '@sorare/marketplace/src/hooks/offers/useCancelOffer';

import CardScore from '@sorare/football/src/components/collections/CardScore';
import CollectionBackground from '@sorare/football/src/components/collections/CollectionBackground';
import DetailedScoreIcon, {
  DetailedScoreKey,
  detailedScores,
} from '@sorare/football/src/components/collections/DetailedScoreLine';
import DetailsDialogBanner from '@sorare/football/src/components/collections/DetailsDialogBanner';
import Warning from '@sorare/football/src/components/collections/Warning';

import { CardPreview_cardCollectionCard } from './__generated__/index.graphql';

const DialogContainer = styled(CollectionBackground)`
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  padding: var(--double-unit);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
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
const Bonuses = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
`;

type Props = {
  cardCollectionCard: CardPreview_cardCollectionCard;
  bannerPictureUrl: string;
  open?: boolean;
  onClose: () => void;
};
const CardPreview = ({
  cardCollectionCard,
  bannerPictureUrl,
  open,
  onClose,
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

  const cardListed = isListedOnMarket(card);

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
    <Dialog darkTheme maxWidth="sm" open={open} onClose={onClose}>
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
        <Bonuses>
          {Object.entries(scores).map(([key, value]) => {
            return (
              !!value &&
              key in detailedScores && (
                <DetailedScoreIcon
                  key={key}
                  id={key as DetailedScoreKey}
                  listed={displayWarning}
                />
              )
            );
          })}
        </Bonuses>
        {displayWarning && <Warning onClick={onUnlist} loading={unlisting} />}
        <DetailsDialogBanner />
      </DialogContainer>
    </Dialog>
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
        ...isListedOnMarket_card
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
    }
    ${isListedOnMarket.fragments.card}
    ${useTokenOfferBelongsToUser.fragments.offer}
  `,
};

export default CardPreview;
