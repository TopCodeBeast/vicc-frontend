import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { CardScore } from '@sorare/core/src/components/collections/CardScore';
import Warning from '@sorare/core/src/components/collections/Warning';
import { isMyCardListedOnMarket } from '@sorare/core/src/lib/cards';
import { fantasy } from '@sorare/core/src/lib/glossary';

import useCancelOffer from '@sorare/marketplace/src/hooks/offers/useCancelOffer';

import { CollectionBonuses } from '@football/components/collections/CollectionBonuses';

import { Bonuses_card } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  gap: var(--intermediate-unit);
  flex-direction: column;
  border-radius: var(--double-unit);
  padding: var(--double-unit);
  background: var(--c-neutral-300);
`;
const TotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const BonusDetailWrapper = styled.div`
  border-radius: var(--double-unit);
  border: 1px solid var(--c-neutral-400);
`;

type Props = { card: Bonuses_card };

export const Bonuses = ({ card }: Props) => {
  const cancelOffer = useCancelOffer();
  const [unlisting, setUnlisting] = useState(false);
  const [unlisted, setUnlisted] = useState(false);
  const cardCollectionCard = card.cardCollectionCards[0] as
    | Bonuses_card['cardCollectionCards'][0]
    | undefined;

  if (!cardCollectionCard) return null;
  const { scoreBreakdown } = cardCollectionCard;
  const { __typename, total, ...scores } = scoreBreakdown;
  const theoricalScore = Object.values(scores).reduce(
    (sum, value) => sum + value
  );
  const cardListed = isMyCardListedOnMarket(card);
  const displayWarning = cardListed && !unlisted;

  const onUnlist = async () => {
    const offer = card.token?.myMintedSingleSaleOffer;
    if (offer?.blockchainId) {
      setUnlisting(true);
      const errors = await cancelOffer(offer.blockchainId);
      setUnlisted(!errors?.length);
      setUnlisting(false);
    }
  };

  return (
    <Root>
      <TotalWrapper>
        <Text16 bold>
          <FormattedMessage {...fantasy.total} />
        </Text16>
        <CardScore
          score={unlisted ? theoricalScore : total}
          listed={displayWarning}
        />
      </TotalWrapper>
      {displayWarning && <Warning onClick={onUnlist} loading={unlisting} />}

      <BonusDetailWrapper>
        <CollectionBonuses
          cardCollectionCard={cardCollectionCard}
          displayWarning={false}
        />
      </BonusDetailWrapper>
    </Root>
  );
};

Bonuses.fragments = {
  card: gql`
    fragment Bonuses_card on Card {
      slug
      assetId
      cardCollectionCards {
        id
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
      token {
        assetId
        slug
        myMintedSingleSaleOffer {
          id
          blockchainId
        }
      }
      ...isMyCardListedOnMarket_card
    }
    ${CollectionBonuses.fragments.cardCollectionCard}
    ${isMyCardListedOnMarket.fragments.card}
  ` as TypedDocumentNode<Bonuses_card>,
};
