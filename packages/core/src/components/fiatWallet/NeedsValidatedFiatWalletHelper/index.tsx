import { ReactNode, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { FiatWalletAccountState } from '__generated__/globalTypes';
import { Text14 } from '@core/atoms/typography';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { fiatWallet } from '@core/lib/glossary';

import CreateFiatWallet from '../CreateFiatWallet';

const WithPadding = styled.div`
  padding: 0 var(--double-unit) var(--double-unit);
`;

const Helper = styled.div`
  text-align: left;
  padding: var(--intermediate-unit);
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  background-color: var(--c-neutral-400);
  border-radius: var(--unit);
  width: 100%;
`;

const StyledButtonBase = styled.button`
  color: var(--c-link);
  font-weight: var(--t-bold);
  text-align: left;
`;

type Props = {
  statusTarget: FiatWalletAccountState;
  defaultHelper: ReactNode;
  canListAndTradeHelper?: ReactNode;
  withPadding?: boolean;
};

export const NeedsValidatedFiatWalletHelper = ({
  canListAndTradeHelper,
  defaultHelper,
  statusTarget = FiatWalletAccountState.VALIDATED_OWNER,
  withPadding = false,
}: Props) => {
  const [showCreateFiatWallet, setShowCreateFiatWallet] = useState(false);

  const { canListAndTrade, canDepositAndWithdraw } = useFiatBalance();
  const cta = useMemo(() => {
    if (statusTarget === FiatWalletAccountState.OWNER)
      return <FormattedMessage {...fiatWallet.activateCashWallet} />;
    return (
      <FormattedMessage
        {...(canListAndTrade
          ? fiatWallet.addMyId
          : fiatWallet.activateCashWalletAndAddAnId)}
      />
    );
  }, [canListAndTrade, statusTarget]);

  if (canDepositAndWithdraw) return null;

  if (statusTarget === FiatWalletAccountState.OWNER && canListAndTrade)
    return null;

  const helper = (
    <>
      <Helper>
        <Text14 color="var(--c-neutral-700)">
          {canListAndTrade ? canListAndTradeHelper : defaultHelper}
        </Text14>
        <Text14 bold>
          <StyledButtonBase onClick={() => setShowCreateFiatWallet(true)}>
            {cta}
          </StyledButtonBase>
        </Text14>
      </Helper>
      {showCreateFiatWallet && (
        <CreateFiatWallet
          onDismissActivationSuccess={() => setShowCreateFiatWallet(false)}
          onClose={() => setShowCreateFiatWallet(false)}
          statusTarget={statusTarget}
          canDismissAfterActivation={false}
        />
      )}
    </>
  );
  if (withPadding) return <WithPadding>{helper}</WithPadding>;
  return helper;
};
