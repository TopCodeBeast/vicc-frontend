import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Text20 } from '@sorare/core/src/atoms/typography';
import { ConversionCreditTinyBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditTinyBanner';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { theme } from '@sorare/core/src/style/theme';

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
  border-radius: ${theme.shape.borderRadius}px;
  justify-content: space-between;
  align-items: center;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-wrap: nowrap;
  }
`;
const Actions = styled.div`
  flex-grow: 1;
  & > * {
    width: 100%;
  }
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    width: auto;
  }
`;

export const PrimaryOfferSale = ({ primaryOffer }: Props) => {
  const { priceWei, priceFiat, endDate, buyer } = primaryOffer;
  const { sport } = useSportContext();
  const { main: price } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      wei: priceWei,
      ...priceFiat,
    },
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
          <Price>{price}</Price>
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
    fragment PrimaryOfferSale_primaryOffer on TokenPrimaryOffer {
      id
      priceWei
      endDate
      buyer {
        slug
        ...SmallUser_user
      }
      priceFiat {
        eur
        usd
        gbp
      }
      ...PrimaryOfferBuyField_primaryOffer
    }
    ${SmallUser.fragments.user}
    ${PrimaryOfferBuyField.fragments.primaryOffer}
  `,
};

export default PrimaryOfferSale;
