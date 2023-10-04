import { TypedDocumentNode, gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import styled from 'styled-components';

import { Text20 } from '@sorare/core/src/atoms/typography';
import { ConversionCreditTinyBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditTinyBanner';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import AuctionTimeLeft from '@marketplace/components/auction/AuctionTimeLeft';
import PrimaryOfferBuyField from '@marketplace/components/primaryOffer/PrimaryOfferBuyField';
import SmallUser from '@marketplace/components/user/SmallUser';

import { PrimaryOfferSale_primaryOffer } from './__generated__/index.graphql';

interface Props {
  primaryOffer: PrimaryOfferSale_primaryOffer;
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--double-unit);
  padding: var(--double-unit);
  border: 1px solid var(--c-neutral-300);
  border-radius: var(--unit);
  justify-content: space-between;
  align-items: center;
  @media ${tabletAndAbove} {
    flex-wrap: nowrap;
  }
`;
const Actions = styled.div`
  flex-grow: 1;
  & > * {
    width: 100%;
  }
  @media ${tabletAndAbove} {
    flex-grow: 0;
  }
`;
const Flex = styled.div`
  flex: 1;
`;
const Price = styled(Text20)`
  font-weight: bold;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  width: 100%;
  @media ${tabletAndAbove} {
    width: auto;
  }
`;

export const PrimaryOfferSale = ({ primaryOffer }: Props) => {
  const { price, endDate, buyer } = primaryOffer;
  const { sport } = useSportContext();
  const { main: displayPrice } = useAmountWithConversion({
    monetaryAmount: price,
  });
  const ended = isPast(parseISO(endDate));
  const bought = !!buyer;
  return (
    <Container>
      {buyer ? (
        <Flex>
          <SmallUser user={buyer} />
        </Flex>
      ) : (
        <Column>
          <Price>{displayPrice}</Price>
          <AuctionTimeLeft endDate={endDate} />
          <ConversionCreditTinyBanner sport={sport} />
        </Column>
      )}
      {!bought && (
        <Actions>
          <PrimaryOfferBuyField
            disabled={ended}
            color={ended ? 'darkGray' : 'blue'}
            primaryOffer={primaryOffer}
          />
        </Actions>
      )}
    </Container>
  );
};

PrimaryOfferSale.fragments = {
  primaryOffer: gql`
    fragment PrimaryOfferSale_primaryOffer on Offer {
      id
      endDate
      buyer {
        slug
        ...SmallUser_user
      }
      price {
        ...MonetaryAmountFragment_monetaryAmount
      }
      ...PrimaryOfferBuyField_primaryOffer
    }
    ${monetaryAmountFragment}
    ${SmallUser.fragments.user}
    ${PrimaryOfferBuyField.fragments.primaryOffer}
  ` as TypedDocumentNode<PrimaryOfferSale_primaryOffer>,
};

export default PrimaryOfferSale;
