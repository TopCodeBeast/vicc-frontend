import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import {
  MonetaryAmountOutput,
  zeroMonetaryAmount,
} from '@sorare/core/src/hooks/useMonetaryAmount';

import { MarketFeeStatus } from '@marketplace/hooks/useMarketFeesHelperStatus';

import FeesTooltipFromProps from '../FeesTooltipFromProps';

interface FeesDetailsProps {
  monetaryAmount: MonetaryAmountOutput;
  marketFeeMonetaryAmount?: MonetaryAmountOutput;
  referenceCurrency: SupportedCurrency;
  completed?: boolean;
  marketFeeStatus?: MarketFeeStatus.ENABLED | MarketFeeStatus.PARTIALLY_ENABLED;
}

const OfferFeesDetails = ({
  monetaryAmount,
  marketFeeMonetaryAmount = zeroMonetaryAmount,
  referenceCurrency,
  completed,
  marketFeeStatus,
}: FeesDetailsProps) => {
  return (
    <FeesTooltipFromProps
      completed={completed}
      monetaryAmount={monetaryAmount}
      marketFeeMonetaryAmount={marketFeeMonetaryAmount}
      referenceCurrency={referenceCurrency}
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
  monetaryAmount,
  marketFeeMonetaryAmount,
  referenceCurrency,
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
            monetaryAmount={monetaryAmount}
            marketFeeMonetaryAmount={marketFeeMonetaryAmount}
            referenceCurrency={referenceCurrency}
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

export default FeesDetailsTooltip;
