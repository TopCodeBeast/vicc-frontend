import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import ethIcon from '@sorare/core/src/assets/eth_icon.png';
import { Caption } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { cardRatio } from '@sorare/core/src/lib/cardPicture';
import { getFaCurrencySymbol } from '@sorare/core/src/lib/fiat';
import { MonetaryAmountParams } from '@sorare/core/src/lib/monetaryAmount';

import FeesDetailsTooltip from '../FeesDetailsTooltip';

const Card = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

const MonetaryImageContainer = styled.div<{ isFiat: boolean }>`
  width: 40px;
  aspect-ratio: ${cardRatio};
  background-color: ${({ isFiat }) =>
    isFiat ? 'var(--c-green-600)' : 'rgba(var(--c-rgb-brand-600), 0.25)'};

  margin-right: var(--unit);
  border-radius: var(--half-unit);
  display: flex;
  align-items: center;
  justify-content: center;
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
  amount: MonetaryAmountParams;
  displayFees?: boolean;
  marketFeeAmount?: MonetaryAmountOutput;
}

const MonetaryCard = ({ amount, marketFeeAmount, displayFees }: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const feesDisplayable =
    displayFees && marketFeeAmount && marketFeeAmount?.eur > 0;
  const { fiatCurrency } = useFiatBalance();

  if (!amount) {
    return null;
  }
  const { referenceCurrency } = amount;
  const isFiat = referenceCurrency !== SupportedCurrency.WEI;
  getFaCurrencySymbol(fiatCurrency);
  return (
    <Card>
      <MonetaryImageContainer isFiat={isFiat}>
        {isFiat ? (
          <FontAwesomeIcon
            size="xl"
            color="var(--c-static-neutral-100)"
            icon={getFaCurrencySymbol(fiatCurrency)}
          />
        ) : (
          <EthImage src={ethIcon} alt="Ethereum" />
        )}
      </MonetaryImageContainer>
      <Amount>
        <AmountWithConversion
          monetaryAmount={amount}
          primaryCurrency={
            referenceCurrency === SupportedCurrency.WEI
              ? Currency.ETH
              : Currency.FIAT
          }
          hideExponent={isFiat}
          column
        />
        {feesDisplayable && (
          <Fees>
            <FeesDetailsTooltip
              monetaryAmount={toMonetaryAmount({
                ...amount,
              })}
              marketFeeMonetaryAmount={marketFeeAmount}
              referenceCurrency={amount.referenceCurrency}
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

export default MonetaryCard;
