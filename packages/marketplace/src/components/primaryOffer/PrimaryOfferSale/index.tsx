import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import styled from 'styled-components';

import { Text20 } from '@sorare/core/src/atoms/typography';
import { ConversionCreditTinyBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditTinyBanner';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import { theme } from '@sorare/core/src/style/theme';

import AuctionTimeLeft from 'components/auction/AuctionTimeLeft';
import PrimaryOfferBuyField from 'components/primaryOffer/PrimaryOfferBuyField';
import SmallUser from 'components/user/SmallUser';

import { PrimaryOfferSale_primaryOffer } from './__generated__/index.graphql';

type PrimaryOfferSale_primaryOffer_priceFiat =
  PrimaryOfferSale_primaryOffer['priceFiat'];

interface Props {
  primaryOffer: PrimaryOfferSale_primaryOffer;
}

type LowercaseCurrencyCode = keyof Omit<
  PrimaryOfferSale_primaryOffer_priceFiat,
  '__typename'
>;

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
  const { priceFiat, endDate, buyer } = primaryOffer;
  const {
    fiatCurrency: { code: preferredCurrencyCode },
  } = useCurrentUserContext();
  const { formatNumber } = useIntlContext();
  const { sport } = useSportContext();
  const price = formatNumber(
    priceFiat[preferredCurrencyCode.toLowerCase() as LowercaseCurrencyCode] /
      100,
    {
      style: 'currency',
      currency: preferredCurrencyCode,
    }
  );
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
