import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { PrivateKeyRecoveryOptionMethodEnum } from '@core/__generated__/globalTypes';
import { Text16, Title3 } from '@core/atoms/typography';
import { useWalletContext } from '@core/contexts/wallet';
import useSendRecoverKey from '@core/hooks/recovery/useSendRecoverKey';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  margin-bottom: var(--double-unit);
`;

export const RestoreWallet = () => {
  const { sendRecoveryKey } = useSendRecoverKey();
  const { selectedRecoveryOption } = useWalletContext();
  const resendRecoveryKey = async () => {
    if (selectedRecoveryOption) sendRecoveryKey(selectedRecoveryOption);
  };

  return (
    <Wrapper>
      <Title3 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="walletNeedsRecover.restoreWallet.title"
          defaultMessage="Enter recovery key"
        />
      </Title3>
      <Text16 color="var(--c-neutral-1000)">
        {selectedRecoveryOption?.method ===
          PrivateKeyRecoveryOptionMethodEnum.EMAIL && (
          <FormattedMessage
            id="walletNeedsRecover.restoreWallet.helper"
            defaultMessage="An email with the recovery key was sent to {email}. If you don’t get the link, check your spam folder."
            values={{ email: selectedRecoveryOption?.destination }}
          />
        )}
        {selectedRecoveryOption?.method ===
          PrivateKeyRecoveryOptionMethodEnum.PHONE && (
          <FormattedMessage
            id="walletNeedsRecover.restoreWallet.phoneHelper"
            defaultMessage="A text message with the recovery key was sent to {phoneNumber}."
            values={{ phoneNumber: selectedRecoveryOption?.destination }}
          />
        )}
      </Text16>
      {selectedRecoveryOption && (
        <Text16 color="var(--c-brand-600)">
          <button
            type="button"
            onClick={() => {
              resendRecoveryKey();
            }}
          >
            <FormattedMessage
              id="walletNeedsRecover.restoreWallet.cta"
              defaultMessage="Resend recovery key"
            />
          </button>
        </Text16>
      )}
    </Wrapper>
  );
};

export default RestoreWallet;
