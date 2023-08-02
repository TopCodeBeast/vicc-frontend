import Big from 'bignumber.js';
import { FormattedMessage, defineMessages } from 'react-intl';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { Caption, Text16, Title6 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';

import Row from '@marketplace/components/offer/Row';
import { MarketFeeStatus } from '@marketplace/hooks/useMarketFeesHelperStatus';

const offerMessages = defineMessages({
  initialOffer: {
    id: 'FeesDetails.total',
    defaultMessage: 'Total',
  },
  marketFees: {
    id: 'FeesDetails.marketFees',
    defaultMessage: 'Market fee',
  },
  partialMarketFees: {
    id: 'FeesDetails.marketFees.partial',
    defaultMessage: 'Market fee (up to)',
  },
  youReceive: {
    id: 'FeesDetails.youReceive',
    defaultMessage: 'You receive',
  },
  partialYouReceive: {
    id: 'FeesDetails.youReceive.partial',
    defaultMessage: 'You receive (at least)',
  },
});

const completedOfferUniqueMessages = defineMessages({
  initialOffer: {
    id: 'FeesDetails.listedPrice',
    defaultMessage: 'Listed price',
  },
  marketFees: {
    id: 'FeesDetails.marketFees',
    defaultMessage: 'Market fee',
  },
  youReceive: {
    id: 'FeesDetails.youReceived',
    defaultMessage: 'You received',
  },
});

const completedOfferMessages = {
  initialOffer: completedOfferUniqueMessages.initialOffer,
  marketFees: completedOfferUniqueMessages.marketFees,
  youReceive: completedOfferUniqueMessages.youReceive,
  partialMarketFees: completedOfferUniqueMessages.marketFees,
  partialYouReceive: completedOfferUniqueMessages.youReceive,
};

interface Props {
  monetaryAmount: MonetaryAmountOutput;
  marketFeeMonetaryAmount: MonetaryAmountOutput;
  referenceCurrency: SupportedCurrency;
  completed?: boolean;
  marketFeeStatus?: MarketFeeStatus.ENABLED | MarketFeeStatus.PARTIALLY_ENABLED;
}

const FeesTooltipFromProps = ({
  monetaryAmount,
  marketFeeMonetaryAmount,
  referenceCurrency,
  completed,
  marketFeeStatus,
}: Props) => {
  const isFiat = referenceCurrency !== SupportedCurrency.WEI;
  const monetaryAmountIndex = getMonetaryAmountIndex(referenceCurrency);
  const total = new Big(monetaryAmount[monetaryAmountIndex]).minus(
    marketFeeMonetaryAmount[monetaryAmountIndex]
  );

  const messages = completed ? completedOfferMessages : offerMessages;

  return (
    <>
      <Row
        borderless
        title={
          <Text16>
            <FormattedMessage {...messages.initialOffer} />
          </Text16>
        }
      >
        <Text16>
          <AmountWithConversion
            monetaryAmount={{ ...monetaryAmount, referenceCurrency }}
            primaryCurrency={isFiat ? Currency.FIAT : Currency.ETH}
            hideExponent
          />
        </Text16>
      </Row>
      <Row
        borderless
        title={
          <Text16>
            <FormattedMessage
              {...(marketFeeStatus === MarketFeeStatus.PARTIALLY_ENABLED
                ? messages.partialMarketFees
                : messages.marketFees)}
            />
          </Text16>
        }
      >
        <Text16>
          <AmountWithConversion
            monetaryAmount={{ ...marketFeeMonetaryAmount, referenceCurrency }}
            primaryCurrency={isFiat ? Currency.FIAT : Currency.ETH}
            hideExponent
          />
        </Text16>
      </Row>
      <Row borderless>
        <Caption>
          <FormattedMessage
            id="FeesTooltipFromProps.marketFeeNotAppliedToEveryCard"
            defaultMessage="The market fee may not apply to every card involved in the transaction."
          />
        </Caption>
      </Row>
      <Row
        borderless
        title={
          <Title6 as="p">
            <FormattedMessage
              {...(marketFeeStatus === MarketFeeStatus.PARTIALLY_ENABLED
                ? messages.partialYouReceive
                : messages.youReceive)}
            />
          </Title6>
        }
      >
        <Title6 as="p">
          <AmountWithConversion
            monetaryAmount={{ [monetaryAmountIndex]: total, referenceCurrency }}
            primaryCurrency={isFiat ? Currency.FIAT : Currency.ETH}
            hideExponent
          />
        </Title6>
      </Row>
    </>
  );
};

export default FeesTooltipFromProps;
