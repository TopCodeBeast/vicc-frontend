import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import {
  FiatWalletAccountState,
  FiatWalletKycState,
  KycRequestNotificationStatus,
} from '__generated__/globalTypes';
import { DumbNotification } from '@core/components/activity/DumbNotification';
import CreateFiatWallet from '@core/components/fiatWallet/CreateFiatWallet';
import { CreateFiatWalletSteps } from '@core/components/fiatWallet/CreateFiatWallet/type';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { shortRefusedReasonsMessages } from '@core/lib/mangopay';

import { commonNotificationInterfaceFragment } from '../fragments';
import { CommonNotificationProps } from '../types';
import { KycRequestNotification_kycRequestNotification } from './__generated__/index.graphql';

type Props = CommonNotificationProps & {
  notification: KycRequestNotification_kycRequestNotification;
};

const messages = defineMessages({
  kycValidated: {
    id: 'Activity.Notifications.KycRequestNotification.kycValidated',
    defaultMessage: 'Congrats, your ID is verified.',
  },
  kycValidatedDescription: {
    id: 'Activity.Notifications.KycRequestNotification.kycValidatedDescription',
    defaultMessage:
      'You can now receive cash deposits, withdrawals, and competition rewards!',
  },
  kycRefused: {
    id: 'Activity.Notifications.KycRequestNotification.kycRefused',
    defaultMessage: 'There was a problem with the ID you uploaded.',
  },
});

const messageByStatus = {
  [KycRequestNotificationStatus.VALIDATED]: messages.kycValidated,
  [KycRequestNotificationStatus.REFUSED]: messages.kycRefused,
};

export const KycRequestNotification = ({
  notification,
  onClick,
  ...rest
}: Props) => {
  const [showCreateFiatWallet, setShowCreateFiatWallet] = useState(false);
  const { kycStatus = undefined } = useFiatBalance();
  const {
    createdAt,
    sport,
    read,
    kycStatus: status,
    refusedReason,
  } = notification;

  return (
    <>
      <DumbNotification
        title={
          <>
            <b>
              <FormattedMessage {...messageByStatus[status]} />
            </b>{' '}
            {status === KycRequestNotificationStatus.VALIDATED && (
              <FormattedMessage {...messages.kycValidatedDescription} />
            )}
            {status === KycRequestNotificationStatus.REFUSED &&
              refusedReason && (
                <FormattedMessage
                  {...shortRefusedReasonsMessages[refusedReason]}
                />
              )}
          </>
        }
        onClick={() => {
          if (
            status === KycRequestNotificationStatus.REFUSED &&
            kycStatus === FiatWalletKycState.REFUSED
          ) {
            setShowCreateFiatWallet(true);
          }
        }}
        createdAt={createdAt}
        sport={sport}
        read={read}
        {...rest}
      />
      {showCreateFiatWallet && (
        <CreateFiatWallet
          initialStep={CreateFiatWalletSteps.HANDLE_ID_REVIEW_ERROR}
          statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
          onClose={() => setShowCreateFiatWallet(false)}
          onDismissActivationSuccess={() => setShowCreateFiatWallet(false)}
          canDismissAfterActivation
        />
      )}
    </>
  );
};

KycRequestNotification.fragments = {
  kycRequestNotification: gql`
    fragment KycRequestNotification_kycRequestNotification on KycRequestNotification {
      ...Notification_notificationInterface
      sport
      kycStatus: status
      refusedReason
    }
    ${commonNotificationInterfaceFragment}
  ` as TypedDocumentNode<KycRequestNotification_kycRequestNotification>,
};
