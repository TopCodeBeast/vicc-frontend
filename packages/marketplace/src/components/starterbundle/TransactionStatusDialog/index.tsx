import {
  faCheckCircle,
  faTriangleExclamation,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
  useIntl,
} from 'react-intl';
import { useInterval } from 'react-use';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import Dialog from '@sorare/core/src/components/dialog';

import { useMarketplaceEvents } from '@marketplace/lib/events';

const messages = defineMessages({
  processingFirstTitle: {
    id: 'StarterBundle.TransactionStatusDialog.processingFirstTitle',
    defaultMessage: 'Completing transaction',
  },
  processingFirstSubtitle: {
    id: 'StarterBundle.TransactionStatusDialog.processingFirstSubtitle',
    defaultMessage: 'Please wait while we transfer your Cards',
  },
  processingSecondTitle: {
    id: 'StarterBundle.TransactionStatusDialog.processingSecondTitle',
    defaultMessage: 'Still working on it',
  },
  processingSecondSubtitle: {
    id: 'StarterBundle.TransactionStatusDialog.processingSecondSubtitle',
    defaultMessage: `We're almost done`,
  },
  processingThirdTitle: {
    id: 'StarterBundle.TransactionStatusDialog.processingThirdTitle',
    defaultMessage: `Ok, it's taking longer than we thought`,
  },
  processingThirdSubtitle: {
    id: 'StarterBundle.TransactionStatusDialog.processingThirdSubtitle',
    defaultMessage: `I swear we're usually faster than this`,
  },
  completeTitle: {
    id: 'StarterBundle.TransactionStatusDialog.completeTitle',
    defaultMessage: 'Transaction complete',
  },
  completeSubtitle: {
    id: 'StarterBundle.TransactionStatusDialog.completeSubtitle',
    defaultMessage:
      "You're ready to enter your Cards in the {tournament} lineup",
  },
  errorTitle: {
    id: 'StarterBundle.TransactionStatusDialog.errorTitle',
    defaultMessage: `Transaction failed`,
  },
  errorSubtitle: {
    id: 'StarterBundle.TransactionStatusDialog.errorSubtitle',
    defaultMessage: `Your transaction didn't go through because of an error`,
  },
});

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: var(--double-unit) var(--quadruple-unit) var(--quadruple-unit)
    var(--quadruple-unit);
  text-align: center;
  gap: var(--double-unit);
  min-height: 240px;
`;

const LoadingIndicatorContainer = styled.div`
  height: 48px;
`;

const Title = styled.div`
  text-transform: uppercase;
  font: var(--t-bolder) italic var(--t-24);
`;

const Subtitle = styled.div`
  font: var(--t-14);
  color: var(--c-neutral-600);
`;

const SuccessIcon = styled(FontAwesomeIcon).attrs({ icon: faCheckCircle })`
  color: #01a963;
  font-size: 48px;
`;

const ErrorIcon = styled(FontAwesomeIcon).attrs({
  icon: faTriangleExclamation,
})`
  font-size: 48px;
`;

export type TransactionStatus =
  | 'not_started'
  | 'processing'
  | 'complete'
  | 'error';
export type Props = {
  sport: Sport;
  status: 'not_started' | 'processing' | 'complete' | 'error';
  tournamentNameToJoin: string;
  onSuccess: () => void;
  onError: () => void;
  onClose: () => void;
};

export const TransactionStatusDialog = ({
  sport,
  status,
  tournamentNameToJoin,
  onSuccess,
  onError,
  onClose,
}: Props) => {
  const { formatMessage } = useIntl();
  const track = useMarketplaceEvents();
  const [processingMessage, setProcessingMessage] = useState({
    title: messages.processingFirstTitle,
    subtitle: messages.processingFirstSubtitle,
  });
  const success = () => {
    track('Starter Bundles Click Use Your Cards', { sport });
    onSuccess();
    onClose();
  };

  const retry = () => {
    onError();
    onClose();
  };
  const [timeWaiting, setTimeWaiting] = useState(0);

  useInterval(
    () => {
      setTimeWaiting(oldTime => oldTime + 1000);
    },
    status === 'processing' ? 1000 : null
  );

  useEffect(() => {
    if (timeWaiting > 15000) {
      setProcessingMessage({
        title: messages.processingThirdTitle,
        subtitle: messages.processingThirdSubtitle,
      });
    } else if (timeWaiting > 5000) {
      setProcessingMessage({
        title: messages.processingSecondTitle,
        subtitle: messages.processingSecondSubtitle,
      });
    }
  }, [sport, timeWaiting, track]);

  const messagesByStatus: Record<
    TransactionStatus,
    { title: MessageDescriptor; subtitle: MessageDescriptor } | undefined
  > = {
    processing: {
      title: processingMessage.title,
      subtitle: processingMessage.subtitle,
    },
    complete: {
      title: messages.completeTitle,
      subtitle: messages.completeSubtitle,
    },
    error: {
      title: messages.errorTitle,
      subtitle: messages.errorSubtitle,
    },
    not_started: undefined,
  };

  if (status === 'not_started') return null;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      body={
        <Content>
          {status === 'processing' && (
            <LoadingIndicatorContainer>
              <LoadingIndicator small />
            </LoadingIndicatorContainer>
          )}
          {status === 'complete' && <SuccessIcon />}
          {status === 'error' && <ErrorIcon />}
          <div>
            <Title>{formatMessage(messagesByStatus[status]!.title)}</Title>
            <Subtitle>
              {formatMessage(messagesByStatus[status]!.subtitle, {
                tournament: tournamentNameToJoin,
              })}
            </Subtitle>
          </div>
          <div>
            {status === 'complete' && (
              <Button color="black" medium onClick={success}>
                <FormattedMessage
                  id="StarterBundle.TransactionStatusDialog.successCta"
                  defaultMessage="Use your Cards"
                />
              </Button>
            )}
            {status === 'error' && (
              <Button color="black" medium onClick={retry}>
                <FormattedMessage
                  id="StarterBundle.TransactionStatusDialog.retryCta"
                  defaultMessage="Retry"
                />
              </Button>
            )}
          </div>
        </Content>
      }
    />
  );
};
