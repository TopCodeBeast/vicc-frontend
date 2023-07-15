import { FormattedMessage, FormattedNumber, defineMessages } from 'react-intl';

import { Caption, Text16, Title6 } from '@sorare/core/src/atoms/typography';

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
  amount: number;
  fees: number;
  currencySymbol: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  completed?: boolean;
  marketFeeStatus?: MarketFeeStatus.ENABLED | MarketFeeStatus.PARTIALLY_ENABLED;
}

const FeesTooltipFromProps = ({
  amount,
  fees,
  currencySymbol,
  maximumFractionDigits,
  minimumFractionDigits,
  completed,
  marketFeeStatus,
}: Props) => {
  const total = amount - fees;

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
          <FormattedNumber
            value={amount}
            style="currency"
            currency={currencySymbol}
            maximumFractionDigits={maximumFractionDigits}
            minimumFractionDigits={minimumFractionDigits}
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
          <FormattedNumber
            value={fees}
            // eslint-disable-next-line react/style-prop-object
            style="currency"
            currency={currencySymbol}
            maximumFractionDigits={maximumFractionDigits}
            minimumFractionDigits={minimumFractionDigits}
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
          <FormattedNumber
            value={total}
            // eslint-disable-next-line react/style-prop-object
            style="currency"
            currency={currencySymbol}
            maximumFractionDigits={maximumFractionDigits}
            minimumFractionDigits={minimumFractionDigits}
          />
        </Title6>
      </Row>
    </>
  );
};

export default FeesTooltipFromProps;
