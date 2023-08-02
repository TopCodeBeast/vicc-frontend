import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title3 } from '@core/atoms/typography';
import Dots from '@core/atoms/ui/Dots';
import Tabs from '@core/components/wallet/BankEthAccounting/Tabs';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { getFaCurrencySymbol } from '@core/lib/fiat';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--triple-unit);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-300);
`;

export const FiatBalance = () => {
  const { availableBalanceWithCurrencySymbol, fiatCurrency } = useFiatBalance();
  const {
    walletPreferences: { onlyShowFiatCurrency },
    currentUser,
  } = useCurrentUserContext();

  const hideBalance = currentUser?.userSettings?.hideBalance;

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
        <Title3 as="p">
          {hideBalance ? (
            <Dots count={7} size="medium" />
          ) : (
            availableBalanceWithCurrencySymbol
          )}
        </Title3>
      </div>
      {onlyShowFiatCurrency && <Tabs cash />}
    </Container>
  );
};

export default FiatBalance;
