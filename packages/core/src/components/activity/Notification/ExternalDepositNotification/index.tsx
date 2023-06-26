import { gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import { ExternalDepositNotificationStatus } from '__generated__/globalTypes';
import { DumbNotification } from '@core/components/activity/DumbNotification';
import { useIntlContext } from '@core/contexts/intl';
import { useWalletDrawerContext } from '@core/contexts/walletDrawer';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { ExternalDepositNotification_externalDepositNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: ExternalDepositNotification_externalDepositNotification;
};

const titles = defineMessages({
  [ExternalDepositNotificationStatus.PENDING]: {
    id: 'Activity.Notifications.pendingExternalDeposit',
    defaultMessage:
      'You ETH deposit of {amount} is on its way. Click “Finalize deposit” in your wallet to deposit the funds. It could take a few seconds.',
  },
  [ExternalDepositNotificationStatus.FINALIZED]: {
    id: 'Activity.Notifications.finalizedExternalDeposit',
    defaultMessage:
      'Your ETH deposit of {amount} is now available in your balance.',
  },
});

export const ExternalDepositNotification = ({
  notification,
  onClick,
  ...rest
}: Props) => {
  const { showDrawer } = useWalletDrawerContext();
  const { formatWei } = useIntlContext();
  const { createdAt, sport, read, status, amount } = notification;

  const title = titles[status];

  return (
    <DumbNotification
      title={
        <FormattedMessage
          {...title}
          values={{
            amount: formatWei(amount, undefined, {
              maximumFractionDigits: 4,
            }),
          }}
        />
      }
      onClick={() => {
        showDrawer();
      }}
      createdAt={createdAt}
      sport={sport}
      read={read}
      {...rest}
    />
  );
};

ExternalDepositNotification.fragments = {
  externalDepositNotification: gql`
    fragment ExternalDepositNotification_externalDepositNotification on ExternalDepositNotification {
      ...Notification_notificationInterface
      sport
      status
      amount
    }
    ${commonNotificationInterfaceFragment}
  `,
};
