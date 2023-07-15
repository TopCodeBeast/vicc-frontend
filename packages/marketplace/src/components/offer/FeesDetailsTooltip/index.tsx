import { gql } from '@apollo/client';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';

import useFormatWithCurrency from '@marketplace/hooks/useFormatWithCurrency';
import { MarketFeeStatus } from '@marketplace/hooks/useMarketFeesHelperStatus';

import FeesTooltipFromProps from '../FeesTooltipFromProps';

interface PriceFiat {
  eur: number;
  usd: number;
  gbp: number;
}
interface FeesDetailsProps {
  priceWei: string;
  marketFeeAmountWei?: string;
  priceFiat?: PriceFiat;
  marketFeeAmountFiat?: PriceFiat;
  fees?: number;
  forceEthDisplay?: boolean;
  completed?: boolean;
  marketFeeStatus?: MarketFeeStatus.ENABLED | MarketFeeStatus.PARTIALLY_ENABLED;
}

const OfferFeesDetails = ({
  priceWei,
  marketFeeAmountWei = '0',
  marketFeeAmountFiat,
  priceFiat,
  forceEthDisplay,
  completed,
  marketFeeStatus,
}: FeesDetailsProps) => {
  const {
    amountToDisplay,
    currencySymbol,
    minimumFractionDigits,
    maximumFractionDigits,
  } = useFormatWithCurrency(
    priceWei,
    priceFiat,
    forceEthDisplay ? Currency.ETH : undefined
  );

  const { amountToDisplay: feesAmountToDisplay } = useFormatWithCurrency(
    marketFeeAmountWei,
    marketFeeAmountFiat,
    forceEthDisplay ? Currency.ETH : undefined
  );

  return (
    <FeesTooltipFromProps
      completed={completed}
      amount={amountToDisplay}
      fees={feesAmountToDisplay}
      currencySymbol={currencySymbol}
      minimumFractionDigits={minimumFractionDigits}
      maximumFractionDigits={maximumFractionDigits}
      marketFeeStatus={marketFeeStatus}
    />
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;
const InfoIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: var(--c-neutral-600);
  &:hover {
    color: inherit;
  }
`;

const FeesDetailsTooltip = ({
  priceWei,
  priceFiat,
  marketFeeAmountWei,
  marketFeeAmountFiat,
  forceEthDisplay,
  completed,
  marketFeeStatus,
}: FeesDetailsProps) => {
  return (
    <Container>
      <Tooltip
        enterTouchDelay={0}
        interactive
        placement="top"
        title={
          <OfferFeesDetails
            priceWei={priceWei}
            marketFeeAmountWei={marketFeeAmountWei}
            marketFeeAmountFiat={marketFeeAmountFiat}
            priceFiat={priceFiat}
            forceEthDisplay={forceEthDisplay}
            completed={completed}
            marketFeeStatus={marketFeeStatus}
          />
        }
      >
        <div>
          <InfoIcon icon={faInfoCircle} />
        </div>
      </Tooltip>
    </Container>
  );
};

FeesDetailsTooltip.fragments = {
  tokenOffer: gql`
    fragment FeesDetailsTooltip_tokenOffer on TokenOffer {
      id
      priceWei: price
      priceFiat: priceInFiat {
        eur
        usd
        gbp
      }
    }
  `,
};

export default FeesDetailsTooltip;
