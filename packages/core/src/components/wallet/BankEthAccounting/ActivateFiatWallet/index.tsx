import { faClock, faRotateLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonBase } from '@material-ui/core';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  FiatWalletAccountState,
  FiatWalletKycState,
} from '__generated__/globalTypes';
import { ChevronRightBold } from '@core/atoms/icons/ChevronRightBold';
import { Text16 } from '@core/atoms/typography';
import CreateFiatWallet from '@core/components/fiatWallet/CreateFiatWallet';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { getFaCurrencySymbol } from '@core/lib/fiat';
import { fiatWallet } from '@core/lib/glossary';

const InfoBorder = styled.div`
  display: flex;
  padding: 1px;
  border-radius: var(--unit);
  background: var(--c-gradient-conversionCreditBorder);
`;
const Mask = styled.div`
  display: flex;
  width: 100%;
  border-radius: var(--unit);
  background-color: var(--c-neutral-100);
`;
const Info = styled(ButtonBase)`
  display: flex;
  justify-content: space-between;
  gap: var(--intermediate-unit);
  width: 100%;
  padding: var(--unit);
  border-radius: var(--unit);
  background: linear-gradient(
    45deg,
    rgba(248, 211, 218, 0.2) 0%,
    rgba(179, 169, 244, 0.2) 28.32%,
    rgba(251, 233, 251, 0.2) 54.01%,
    rgba(79, 148, 253, 0.2) 100%
  );
`;

const Text = styled.div`
  display: flex;
  flex-grow: 1;
`;

const ButtonIcon = () => {
  const { kycStatus = undefined, fiatCurrency } = useFiatBalance();
  switch (kycStatus) {
    case FiatWalletKycState.OUT_OF_DATE:
    case FiatWalletKycState.REFUSED:
      return <FontAwesomeIcon icon={faRotateLeft} />;
    case FiatWalletKycState.VALIDATION_ASKED:
    case FiatWalletKycState.CREATED:
      return <FontAwesomeIcon icon={faClock} />;
    default:
      return <FontAwesomeIcon icon={getFaCurrencySymbol(fiatCurrency)} />;
  }
};

const ButtonLabel = ({ kycStatus }: { kycStatus?: FiatWalletKycState }) => {
  const { canListAndTrade } = useFiatBalance();
  switch (kycStatus) {
    case FiatWalletKycState.OUT_OF_DATE:
      return (
        <FormattedMessage
          id="bankEthAccounting.activateFiatWallet.cta.outOfDate"
          defaultMessage="Your government ID is out of date"
        />
      );
    case FiatWalletKycState.REFUSED:
      return (
        <FormattedMessage
          id="bankEthAccounting.activateFiatWallet.cta.refused"
          defaultMessage="Your government ID has been refused"
        />
      );
    case FiatWalletKycState.VALIDATION_ASKED:
    case FiatWalletKycState.CREATED:
      return (
        <FormattedMessage
          id="bankEthAccounting.activateFiatWallet.cta.pending"
          defaultMessage="Your government ID is being reviewed"
        />
      );
    default:
      return (
        <FormattedMessage
          {...(canListAndTrade
            ? fiatWallet.addMyId
            : fiatWallet.activateCashWallet)}
        />
      );
  }
};

export const ActivateFiatWallet = () => {
  const {
    flags: { useCashWallet = false },
  } = useFeatureFlags();
  const [showCreateFiatWallet, setShowCreateFiatWallet] =
    useState<boolean>(false);
  const { canDepositAndWithdraw, kycStatus = undefined } = useFiatBalance();

  if (canDepositAndWithdraw || !useCashWallet) return null;

  const disabled = kycStatus
    ? [
        FiatWalletKycState.CREATED,
        FiatWalletKycState.VALIDATED,
        FiatWalletKycState.VALIDATION_ASKED,
      ].includes(kycStatus)
    : false;

  return (
    <>
      <InfoBorder>
        <Mask>
          <Info
            disabled={disabled}
            onClick={() => setShowCreateFiatWallet(true)}
          >
            <ButtonIcon />
            <Text>
              <Text16>
                <ButtonLabel kycStatus={kycStatus} />
              </Text16>
            </Text>
            {!disabled && <ChevronRightBold />}
          </Info>
        </Mask>
      </InfoBorder>
      {showCreateFiatWallet && (
        <CreateFiatWallet
          onDismissActivationSuccess={() => setShowCreateFiatWallet(false)}
          statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
          onClose={() => setShowCreateFiatWallet(false)}
          canDismissAfterActivation
        />
      )}
    </>
  );
};
