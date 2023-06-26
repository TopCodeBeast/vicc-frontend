import { useCallback, useState } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
  useIntl,
} from 'react-intl';
import styled from 'styled-components';

import { Delivery } from '__generated__/globalTypes';
import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { Text14, Text16, Title3 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';

import useAddDevice from './useAddDevice';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-and-a-half-unit);
`;

const Title = styled(Title3)`
  margin-bottom: var(--double-unit);
`;

const Paragraph = styled(Text16)`
  margin-top: var(--double-unit);
`;

const messages = defineMessages({
  emailsBlocked: {
    id: 'DeviceNeedsConfirming.SendDeviceConfirmation.emailsBlocked',
    defaultMessage:
      'We could not send you a device confirmation request because you have disabled all emails notifications. Please contact L1 support to unblock you.',
  },
  description: {
    id: 'ConfirmDevice.desc',
    defaultMessage:
      'You are using an unconfirmed device (phone, computer, tablet) to access Sorare. To access your wallet, you need to use a confirmed device.',
  },
  instruction: {
    id: 'ConfirmDevice.instruction',
    defaultMessage:
      'To confirm your device please select the button below and follow the device confirmation link in the confirmation mail sent to the email address associated with your Sorare account.',
  },
  send: {
    id: 'ConfirmDevice.send',
    defaultMessage: 'Send confirmation email',
  },
  troubleshooting: {
    id: 'ConfirmDevice.troubleshooting',
    defaultMessage:
      'If you are having issues with the device confirmation link, please <link>refresh this page</link>.',
  },
});

const buildDeliveryParameter = (deliveryMethods: Delivery[]) => {
  if (deliveryMethods.length === 2) {
    return 'both';
  }
  if (deliveryMethods[0] === Delivery.PHONE) {
    return 'phone';
  }
  return 'email';
};

const StyledError = styled.span`
  color: var(--c-red-600);
  padding: var(--double-unit) 0;
`;

const RefetchButton = styled.button`
  align-self: flex-start;
  color: var(--c-brand-600);
  &:disabled {
    color: var(--c-neutral-500);
  }
`;

const makeRefetchLink = <T,>(refetch: () => Promise<T>) => {
  const RefetchLink = (...chunks: string[]) => {
    const [refetching, setRefetching] = useState(false);
    const onClick = useCallback(() => {
      setRefetching(true);
      refetch().finally(() => {
        setRefetching(false);
      });
    }, []);
    return (
      <RefetchButton disabled={refetching} onClick={onClick}>
        {chunks}
      </RefetchButton>
    );
  };
  return RefetchLink;
};

const SendDeviceConfirmation = () => {
  const addDevice = useAddDevice();
  const { formatMessage } = useIntl();
  const { showNotification } = useSnackNotificationContext();
  const { refetch } = useCurrentUserContext();
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<MessageDescriptor | undefined>();
  const sendDeviceConfirmation = useCallback(() => {
    setSending(true);
    addDevice()
      .then(({ errors: graphqlErrors, deliveryType }) => {
        if (!graphqlErrors || graphqlErrors.length === 0) {
          if (deliveryType.length > 0) {
            const delivery = buildDeliveryParameter(deliveryType);
            showNotification('confirmDeviceRequestSent', { delivery });
          } else {
            setErrors(messages.emailsBlocked);
          }
        }
      })
      .finally(() => {
        setSending(false);
      });
  }, [showNotification, setSending, addDevice]);

  return (
    <Wrapper>
      <Title>
        <FormattedMessage
          id="ConfirmDevice.modalTitle"
          defaultMessage="Confirm your device"
        />
      </Title>
      <Paragraph>
        <FormattedMessage {...messages.description} />
      </Paragraph>
      <Paragraph>
        <FormattedMessage {...messages.instruction} />
      </Paragraph>
      {errors && (
        <StyledError>
          <Paragraph>
            <FormattedMessage {...errors} />
          </Paragraph>
        </StyledError>
      )}
      <LoadingButton
        medium
        color="blue"
        onClick={sendDeviceConfirmation}
        loading={sending}
      >
        <FormattedMessage {...messages.send} />
      </LoadingButton>
      <Text14>
        {formatMessage(messages.troubleshooting, {
          link: makeRefetchLink(refetch),
        })}
      </Text14>
    </Wrapper>
  );
};

export default SendDeviceConfirmation;
