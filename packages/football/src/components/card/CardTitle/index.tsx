import { gql } from '@apollo/client';
import styled from 'styled-components';

import { Title2, Title6 } from '@sorare/core/src/atoms/typography';

import CardDescription from '@sorare/football/src/components/card/CardDescription';

import { CardTitle_card } from './__generated__/index.graphql';

export interface Props {
  card: CardTitle_card;
}

const Details = styled(Title6)`
  color: var(--c-neutral-600);
`;

export const CardTitle = ({ card }: Props) => {
  return <CardDescription card={card} Title={Title2} Details={Details} />;
};

CardTitle.fragments = {
  card: gql`
    fragment CardTitle_card on Card {
      slug
      assetId
      ...CardDescription_card
    }
    ${CardDescription.fragments.card}
  `,
};

export default CardTitle;
