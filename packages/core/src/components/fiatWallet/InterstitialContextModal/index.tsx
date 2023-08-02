import { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FiatWalletKycState } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { Text16, Title3 } from '@core/atoms/typography';
import Dialog from '@core/components/dialog';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { fiatWallet, glossary } from '@core/lib/glossary';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled(Column)`
  gap: var(--triple-unit);
  padding: var(--double-unit);
`;

const Text = styled(Column)`
  gap: var(--double-unit);
  text-align: center;
  width: 100%;
`;

const Actions = styled(Column)`
  gap: var(--unit);
`;

export enum InterstitialContextModalMode {
  DEPOSIT = 'deposit',
  REWARD = 'reward',
}

export type Props = {
  onAccept: () => void;
  onDecline: () => void;
  mode: InterstitialContextModalMode;
};

const underReviewMessages = defineMessages({
  title: {
    id: 'fiatWallet.interstitialContextModal.underReview.title',
    defaultMessage: 'We’re reviewing your ID',
  },
  description: {
    id: 'fiatWallet.interstitialContextModal.underReview.description',
    defaultMessage:
      'Once we validate your ID, you will have access to cash deposits, withdrawals, and rewards. We’ll let you know if we need more info from you.',
  },
});

const canListAndTradeTitles = defineMessages<InterstitialContextModalMode>({
  [InterstitialContextModalMode.DEPOSIT]: {
    id: 'interstitialContextModal.deposit.canListAndTrade.title',
    defaultMessage: 'Enable cash deposit',
  },
  [InterstitialContextModalMode.REWARD]: {
    id: 'interstitialContextModal.reward.canListAndTrade.title',
    defaultMessage: 'Enable cash rewards',
  },
});

const canListAndTradeDescriptions =
  defineMessages<InterstitialContextModalMode>({
    [InterstitialContextModalMode.DEPOSIT]: {
      id: 'interstitialContextModal.deposit.canListAndTrade.desc',
      defaultMessage:
        'To enable cash deposits, please verify your identity by adding a government-issued ID.',
    },
    [InterstitialContextModalMode.REWARD]: {
      id: 'interstitialContextModal.reward.canListAndTrade.desc',
      defaultMessage:
        'To receive cash rewards you must verify your identity by adding a government ID.',
    },
  });

const descriptions = defineMessages<InterstitialContextModalMode>({
  [InterstitialContextModalMode.DEPOSIT]: {
    id: 'interstitialContextModal.deposit.desc',
    defaultMessage:
      'To make a cash deposit, please activate your Cash Wallet and verify your identify by adding a government-issued ID.',
  },
  [InterstitialContextModalMode.REWARD]: {
    id: 'interstitialContextModal.reward.desc',
    defaultMessage:
      'To receive cash rewards you must activate your cash Wallet and verify your identity by adding a government ID.',
  },
});

export const InterstitialContextModal = ({
  onAccept,
  onDecline,
  mode,
}: Props) => {
  const { canListAndTrade, kycStatus } = useFiatBalance();

  const underReview =
    kycStatus &&
    [FiatWalletKycState.VALIDATION_ASKED, FiatWalletKycState.CREATED].includes(
      kycStatus
    );

  const title = useMemo(() => {
    if (underReview) {
      return underReviewMessages.title;
    }

    return canListAndTrade
      ? canListAndTradeTitles[mode]
      : fiatWallet.activateCashWallet;
  }, [canListAndTrade, mode, underReview]);

  const description = useMemo(() => {
    if (underReview) {
      return underReviewMessages.description;
    }
    return canListAndTrade
      ? canListAndTradeDescriptions[mode]
      : descriptions[mode];
  }, [canListAndTrade, mode, underReview]);

  return (
    <Dialog
      hideHeader
      maxWidth="xs"
      onClose={onDecline}
      fullWidth
      fullScreen={false}
      open
      body={
        <Content>
          <Text>
            <Title3>
              <FormattedMessage {...title} />
            </Title3>
            <Text16>
              <FormattedMessage {...description} />
            </Text16>
          </Text>
          <Actions>
            {underReview ? (
              <Button onClick={onDecline} color="blue" medium>
                <FormattedMessage {...glossary.gotIt} />
              </Button>
            ) : (
              <>
                <Button onClick={onAccept} color="blue" medium>
                  <FormattedMessage
                    {...(canListAndTrade
                      ? fiatWallet.addMyId
                      : fiatWallet.activateCashWalletAndAddAnId)}
                  />
                </Button>
                <Button onClick={onDecline} color="white" medium>
                  <FormattedMessage {...glossary.back} />
                </Button>
              </>
            )}
          </Actions>
        </Content>
      }
    />
  );
};
