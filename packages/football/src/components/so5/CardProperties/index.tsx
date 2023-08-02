import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo } from 'react';
import styled from 'styled-components';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isType } from '@sorare/core/src/lib/gql';

import ItemEligibility from '@football/components/card/ItemEligibility';
import AverageScore from '@football/components/so5/AverageScore';

import CardBonus from './CardBonus';
import U23Eligible from './U23Eligible';
import { CardProperties_card } from './__generated__/index.graphql';

type Props = {
  card: CardProperties_card;
};

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--c-neutral-1000);
`;
const Elements = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: calc(var(--half-unit) * 1.5);
`;

const CardProperties = ({ card }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const withTransferMalus = useMemo(() => {
    return (
      currentUser &&
      card.token?.liveSingleSaleOffer &&
      isType(card.token.liveSingleSaleOffer.sender, 'User') &&
      card.token.liveSingleSaleOffer.sender.slug !== currentUser.slug
    );
  }, [card.token?.liveSingleSaleOffer, currentUser]);

  return (
    <Root>
      <Elements>
        <AverageScore
          score={card.averageScore}
          withTooltip
          size="smaller"
          scoreMode="AVERAGE_LAST_15_GAMES"
        />
        <CardBonus card={card} withTransferMalus={Boolean(withTransferMalus)} />

        {card.u23Eligible && <U23Eligible />}
        <ItemEligibility cards={[card]} />
      </Elements>
    </Root>
  );
};

CardProperties.fragments = {
  card: gql`
    fragment CardProperties_card on Card {
      slug
      assetId
      u23Eligible
      ...ItemEligibility_card
      currentUserSubscription {
        slug
      }
      averageScore(type: LAST_FIFTEEN_SO5_AVERAGE_SCORE)
      token {
        slug
        assetId
        liveSingleSaleOffer {
          id
          sender {
            ... on User {
              slug
            }
          }
        }
      }
      ...CardBonus_card
    }
    ${CardBonus.fragments.card}
    ${ItemEligibility.fragments.card}
  ` as TypedDocumentNode<CardProperties_card>,
};

export default CardProperties;
