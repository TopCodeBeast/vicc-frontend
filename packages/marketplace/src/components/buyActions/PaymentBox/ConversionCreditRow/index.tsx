import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Currency, Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { ConversionCreditTinyBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditTinyBanner';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

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
  @media ${tabletAndAbove} {
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
  canChangeRefCurrency?: boolean;
  currency?: Currency;
  isFiat?: boolean;
  usingConversionCredit: boolean;
  conversionCreditMonetaryAmount: MonetaryAmountOutput;
};

export const ConversionCreditRow = ({
  canChangeRefCurrency,
  currency,
  isFiat,
  usingConversionCredit,
  conversionCreditMonetaryAmount,
}: Props) => {
  const { setUsingConversionCredit, conversionCredit } =
    usePaymentContext() || {};
  const {
    walletPreferences: { onlyShowFiatCurrency },
  } = useCurrentUserContext();

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
            conversionCredit={conversionCredit}
            wrapTerms={false}
            onRemove={() => setUsingConversionCredit?.(false)}
          />
        </Banner>
        <Amount>
          <Text16 as="span" color="var(--c-green-600)">
            <PaymentBoxAmountWithConversion
              monetaryAmount={conversionCreditMonetaryAmount}
              bold
              color="currentColor"
              hideExponent={canChangeRefCurrency || onlyShowFiatCurrency}
              {...(currency ? { primaryCurrency: currency } : {})}
              {...(canChangeRefCurrency && {
                primaryCurrency: isFiat ? Currency.FIAT : Currency.ETH,
              })}
            />
          </Text16>
        </Amount>
      </Row>
    </Root>
  );
};
