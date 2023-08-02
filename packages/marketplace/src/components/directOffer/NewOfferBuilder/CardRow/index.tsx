import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption, Text14, Text16 } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { CardHit, convertCardHitToToken } from '@sorare/core/src/lib/algolia';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import FlexToken from '@marketplace/components/token/FlexToken';
import TokenDescription from '@marketplace/components/token/TokenDescription';

import { DirectOffer_CardRow_token } from './__generated__/index.graphql';

interface BaseProps {
  card: CardHit;
  children?: React.ReactNode;
}

interface NoMinPriceProps extends BaseProps {
  displayMinPrice?: never;
  minPriceCurrency?: never;
  cardData?: never;
}

interface WithMinPriceProps extends BaseProps {
  displayMinPrice: boolean;
  cardData?: DirectOffer_CardRow_token;
}

type Props = NoMinPriceProps | WithMinPriceProps;

const MinimumPriceDisplay = ({
  publicMinPrices,
}: {
  publicMinPrices: NonNullable<DirectOffer_CardRow_token['publicMinPrices']>;
}) => {
  const { main } = useAmountWithConversion({
    monetaryAmount: {
      ...publicMinPrices,
    },
  });

  return (
    <Caption color="var(--c-neutral-600)">
      <FormattedMessage
        id="OfferSide.minPrice"
        defaultMessage="The seller set a minimum price of {amount}"
        values={{
          amount: main,
        }}
      />
    </Caption>
  );
};

const Root = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: var(--double-unit) var(--unit) var(--double-unit);
`;

const Card = styled.div`
  width: 30px;
`;
const Container = styled.div`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0px 10px;
`;
const Description = styled.div`
  align-items: flex-start;
  text-align: left;
`;

export const CardRow = ({
  card,
  cardData,
  displayMinPrice,
  children,
}: Props) => {
  const convertedCardHit = useMemo(() => convertCardHitToToken(card), [card]);
  return (
    <Root>
      <Card>
        <FlexToken token={convertedCardHit} width={80} />
      </Card>
      <Container>
        <Description>
          <TokenDescription
            token={convertedCardHit}
            Title={Text16}
            withoutLink
            Details={Text14}
            detailsColor="var(--c-neutral-600)"
          />
        </Description>
        {cardData?.publicMinPrices && displayMinPrice && (
          <MinimumPriceDisplay publicMinPrices={cardData.publicMinPrices} />
        )}
      </Container>
      {children}
    </Root>
  );
};

CardRow.fragments = {
  token: gql`
    fragment DirectOffer_CardRow_token on Token {
      assetId
      slug
      publicMinPrices {
        ...MonetaryAmountFragment_monetaryAmount
      }
      ...FlexToken_token
      ...TokenDescription_token
    }
    ${monetaryAmountFragment}
    ${FlexToken.fragments.token}
    ${TokenDescription.fragments.token}
  ` as TypedDocumentNode<DirectOffer_CardRow_token>,
};

export default CardRow;
