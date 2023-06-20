import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import ethIcon from '@sorare/core/src/assets/eth_icon.png';
import { Caption } from '@sorare/core/src/atoms/typography';
import AmountWithConversion from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { cardRatio } from '@sorare/core/src/lib/cardPicture';
import { theme } from '@sorare/core/src/style/theme';

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
  border-radius: ${theme.radius.xxs}px;
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
          context="EthereumCard"
          amount={amount || '0'}
          unit="wei"
          ethFirst
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
