import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { ConversionCreditTinyBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditTinyBanner';
import { theme } from '@sorare/core/src/style/theme';

import { usePaymentContext } from '@marketplace/components/buyActions/Context';
import { PaymentBoxAmountWithConversion } from '@marketplace/components/buyActions/PaymentBox/AmountWithConversion';

export const messages = defineMessages({
  title: { id: 'ConversionCreditRow.title', defaultMessage: 'Credit' },
  percentageDiscount: {
    id: 'ConversionCreditRow.percentageDiscount',
    defaultMessage:
      '{readablePercentageDiscount} credit, up to {readableMaxDiscount}',
  },
});
const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;
const Row = styled.div`
  display: grid;
  grid-template-areas:
    'title amount'
    'banner banner';
  gap: var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-areas: 'title amount' 'banner amount';
    gap: 0;
  }
`;
const Title = styled.div`
  grid-area: title;
`;
const Amount = styled.div`
  grid-area: amount;
`;
const Banner = styled.div`
  grid-area: banner;
`;

type Props = {
  sport?: Sport;
  currencyFirst: Currency;
};

export const ConversionCreditRow = ({ sport, currencyFirst }: Props) => {
  const {
    usingConversionCredit,
    setUsingConversionCredit,
    conversionCreditMonetaryAmount,
  } = usePaymentContext();

  if (!usingConversionCredit || !conversionCreditMonetaryAmount) return null;

  return (
    <Root>
      <Row>
        <Title>
          <Text16 as="span" color="var(--c-neutral-1000)">
            <FormattedMessage {...messages.title} />
          </Text16>
        </Title>
        <Banner>
          <ConversionCreditTinyBanner
            sport={sport}
            wrapTerms={false}
            onRemove={() => setUsingConversionCredit(false)}
          />
        </Banner>
        <Amount>
          <Text16 as="span" color="var(--c-green-600)">
            <PaymentBoxAmountWithConversion
              monetaryAmount={{
                referenceCurrency: SupportedCurrency.WEI,
                ...conversionCreditMonetaryAmount,
              }}
              primaryCurrency={currencyFirst}
              bold
              color="currentColor"
            />
          </Text16>
        </Amount>
      </Row>
    </Root>
  );
};
