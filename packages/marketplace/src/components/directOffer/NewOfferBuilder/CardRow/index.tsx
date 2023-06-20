import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption, Text14, Text16 } from '@sorare/core/src/atoms/typography';
import FormattedWei from '@sorare/core/src/contexts/intl/FormattedWei';
import { CardHit, convertCardHitToToken } from '@sorare/core/src/lib/algolia';

import FlexToken from '@sorare/marketplace/src/components/token/FlexToken';
import TokenDescription from '@sorare/marketplace/src/components/token/TokenDescription';

import { DirectOffer_CardRow_token } from './__generated__/index.graphql';

interface BaseProps {
  card: CardHit;
  children?: React.ReactNode;
}

interface NoMinPriceProps extends BaseProps {
  displayMinPrice?: never;
  cardData?: never;
}

interface WithMinPriceProps extends BaseProps {
  displayMinPrice: boolean;
  cardData?: DirectOffer_CardRow_token;
}

type Props = NoMinPriceProps | WithMinPriceProps;

const MinimumPriceDisplay = ({
  card,
}: {
  card?: DirectOffer_CardRow_token;
}) => {
  const amount = card?.publicMinPrice;

  if (!amount) {
    return null;
  }

  return (
    <Caption color="var(--c-neutral-600)">
      <FormattedMessage
        id="OfferSide.minPrice"
        defaultMessage="The seller set a minimum price of {amount}"
        values={{
          amount: <FormattedWei value={amount} context="CardRow" />,
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
        {displayMinPrice && <MinimumPriceDisplay card={cardData} />}
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
      publicMinPrice
      ...FlexToken_token
      ...TokenDescription_token
    }
    ${FlexToken.fragments.token}
    ${TokenDescription.fragments.token}
  `,
};

export default CardRow;
