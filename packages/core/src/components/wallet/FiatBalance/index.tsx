import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title3 } from '@sorare/core/src/atoms/typography';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { getFaCurrencySymbol } from '@sorare/core/src/lib/fiat';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--triple-unit);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-300);
  .dark-theme & {
    background-color: var(--c-neutral-400);
  }
`;

export const FiatBalance = () => {
  const { availableBalanceWithCurrencySymbol, fiatCurrency } = useFiatBalance();

  return (
    <Container>
      <FontAwesomeIcon
        size="lg"
        icon={getFaCurrencySymbol(fiatCurrency)}
        color="var(--c-neutral-1000)"
      />
      <div>
        <FormattedMessage
          id="NewWalletBalance.title"
          defaultMessage="Cash balance"
        />
        <Title3 as="p">{availableBalanceWithCurrencySymbol}</Title3>
      </div>
    </Container>
  );
};

export default FiatBalance;
