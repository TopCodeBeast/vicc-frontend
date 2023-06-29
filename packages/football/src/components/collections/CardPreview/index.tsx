import { gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import styled from 'styled-components';

import GlareEffect from '@sorare/core/src/atoms/animations/GlareEffect';
import Gauge from '@sorare/core/src/atoms/ui/GaugeV2';
import CardScore from '@sorare/core/src/components/collections/CardScore';
import DetailedScoreLine, {
  DetailedScoreKey,
  detailedScores,
} from '@sorare/core/src/components/collections/DetailedScoreLine';
import Warning from '@sorare/core/src/components/collections/Warning';
import Dialog from '@sorare/core/src/components/dialog';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';
import { isListedOnMarket } from '@sorare/core/src/lib/cards';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import useCancelOffer from '@sorare/marketplace/src/hooks/offers/useCancelOffer';

import CollectionBackground from '@football/components/collections/CollectionBackground';
import DetailsDialogBanner from '@football/components/collections/DetailsDialogBanner';

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
const Bonuses = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
`;

const DaysLeft = styled.span`
  display: block;
  text-align: right;
  font-size: 10px;
  line-height: 12px;
  margin-left: auto;
  margin-bottom: var(--half-unit);
`;

const Progression = styled.span`
  display: block;
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
  const { card, scoreBreakdown, heldSince } = cardCollectionCard;
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

  const date1 = new Date(parseISO(heldSince));
  const date2 = new Date();
  const remainingDays =
    (date2.valueOf() - date1.valueOf()) / (1000 * 60 * 60 * 24);

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
          <Bonuses>
            {Object.entries(scores).map(([key, value]) => {
              if (!value && key === 'holding' && remainingDays > 0) {
                return (
                  <DetailedScoreLine
                    key={key}
                    listed={displayWarning}
                    {...detailedScores[key as DetailedScoreKey]}
                    explanation={
                      <>
                        {detailedScores[key as DetailedScoreKey].explanation}
                        {remainingDays > 0 && (
                          <Progression>
                            <DaysLeft>{Math.ceil(remainingDays)}/90</DaysLeft>
                            <Gauge
                              percentage={`${(remainingDays * 100) / 90}%`}
                            />
                          </Progression>
                        )}
                      </>
                    }
                    value={0}
                  />
                );
              }
              if (!value) {
                return null;
              }
              return (
                key in detailedScores && (
                  <DetailedScoreLine
                    key={key}
                    listed={displayWarning}
                    {...detailedScores[key as DetailedScoreKey]}
                  />
                )
              );
            })}
          </Bonuses>
          {displayWarning && <Warning onClick={onUnlist} loading={unlisting} />}
          <DetailsDialogBanner cardCollection={cardCollection} />
        </DialogContainer>
      )}
    />
  );
};

CardPreview.fragments = {
  cardCollectionCard: gql`
    fragment CardPreview_cardCollectionCard on CardCollectionCard {
      id
      heldSince
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
  cardCollection: gql`
    fragment CardPreview_cardCollection on CardCollection {
      slug
      ...DetailsDialogBanner_cardCollection
    }
    ${DetailsDialogBanner.fragments.cardCollection}
  `,
};

export default CardPreview;
