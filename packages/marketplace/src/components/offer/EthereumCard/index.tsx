import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import ethIcon from '@sorare/core/src/assets/eth_icon.png';
import { Caption } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { cardRatio } from '@sorare/core/src/lib/cardPicture';

import FeesDetailsTooltip from '../FeesDetailsTooltip';

const Card = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

const EthImageContainer = styled.div`
  width: 40px;
  aspect-ratio: ${cardRatio};
  background-color: rgba(var(--c-rgb-brand-600), 0.25);
  margin-right: var(--unit);
  border-radius: var(--half-unit);
  display: flex;
  align-items: center;
  padding: var(--unit) 0;
`;

const EthImage = styled.img`
  width: 40px;
`;

const Amount = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--unit);
`;

const Fees = styled.div`
  color: var(--c-neutral-600);
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

export interface Props {
  amount: string | null;
  displayFees?: boolean;
  marketFeeAmountWei?: string;
}

const EthereumCard = ({ amount, marketFeeAmountWei, displayFees }: Props) => {
  const feesDisplayable = displayFees && Number(marketFeeAmountWei) > 0;
  if (!amount) {
    return null;
  }

  return (
    <Card>
      <EthImageContainer>
        <EthImage src={ethIcon} alt="eth" />
      </EthImageContainer>
      <Amount>
        <AmountWithConversion
          monetaryAmount={{
            referenceCurrency: SupportedCurrency.WEI,
            [SupportedCurrency.WEI.toLowerCase()]: amount || '0',
          }}
          primaryCurrency={Currency.ETH}
          column
        />
        {feesDisplayable && (
          <Fees>
            <FeesDetailsTooltip
              forceEthDisplay
              priceWei={amount}
              marketFeeAmountWei={marketFeeAmountWei}
            />
          </Fees>
        )}
        {feesDisplayable && (
          <Caption>
            <FormattedMessage
              id="EthereumCard.disclaimer"
              defaultMessage="including market fees"
            />
          </Caption>
        )}
      </Amount>
    </Card>
  );
};

export default EthereumCard;
