import { gql } from '@apollo/client';
import { faDesktop, faMobile } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormattedMessage,
  defineMessage,
  defineMessages,
  useIntl,
} from 'react-intl';
import styled from 'styled-components';

import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { Text14, Text16 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import idFromObject from '@core/gql/idFromObject';
import useMutation from '@core/hooks/graphql/useMutation';
import { glossary } from '@core/lib/glossary';

// import {
//   Devices_UserDevice,
//   revokeDeviceMutation,
//   revokeDeviceMutationVariables,
// } from './__generated__/index.graphql';

type Devices_UserDevice = any;

const messages = defineMessages({
  lastUsed: {
    id: 'Device.lastUsedAt',
    defaultMessage: 'Last used on {date}',
  },
});

// const fragment = gql`
//   fragment Devices_UserDevice on UserDevice {
//     deviceType
//     id
//     os
//     userAgent
//     lastUsedAt
//   }
// `;

// const REVOKE_DEVICE_MUTATION = gql`
//   mutation revokeDeviceMutation($input: revokeDeviceInput!) {
//     revokeDevice(input: $input) {
//       currentUser {
//         id
//         slug
//         devices {
//           ...Devices_UserDevice
//         }
//       }
//       errors {
//         path
//         message
//         code
//       }
//     }
//   }
//   ${fragment}
// `;

const title = defineMessage({
  id: 'Settings.Devices.title',
  defaultMessage: 'My confirmed devices',
});

const DeviceContainer = styled.div`
  padding: var(--unit) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-300);
  }

  button {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    button {
      opacity: 1;
    }
  }
`;

const DeviceDetails = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const IconContainer = styled.div`
  width: 40px;
  text-align: center;
`;

const isMobile = (userAgent: string) => {
  const toMatch = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some(toMatchItem => {
    return userAgent.match(toMatchItem) !== null;
  });
};

const Device = ({
  device,
  isCurrent,
}: {
  device: Devices_UserDevice;
  isCurrent: boolean;
}) => {
  const { formatDate, formatMessage } = useIntl();
  const loading = false; //TODO****
  // const [revokeDevice, { loading }] = useMutation<
  //   revokeDeviceMutation,
  //   revokeDeviceMutationVariables
  // >(REVOKE_DEVICE_MUTATION, { showErrorsWithSnackNotification: true });

  const onClick = async () => {
    // await revokeDevice({
    //   variables: {
    //     input: {
    //       deviceId: idFromObject(device.id),
    //     },
    //   },
    // });
  };

  return (
    <DeviceContainer>
      <DeviceDetails>
        <IconContainer>
          <FontAwesomeIcon
            icon={isMobile(device.deviceType) ? faMobile : faDesktop}
            size="lg"
          />
        </IconContainer>
        <div>
          <Text14>
            {device.os} - {device.deviceType}
          </Text14>
          <Text14 color="var(--c-neutral-600)">{device.userAgent}</Text14>
          {device.lastUsedAt && (
            <Text14 color="var(--c-neutral-600)">
              {formatMessage(messages.lastUsed, {
                date: formatDate(device.lastUsedAt, {
                  month: 'long',
                  day: '2-digit',
                  year: 'numeric',
                }),
              })}
            </Text14>
          )}
        </div>
      </DeviceDetails>
      {isCurrent ? (
        <Text14>
          <FormattedMessage
            id="Settings.Devices.currentDevice"
            defaultMessage="Current device"
          />
        </Text14>
      ) : (
        <LoadingButton
          onClick={() => {
            onClick();
          }}
          small
          color="red"
          loading={loading}
        >
          <FormattedMessage {...glossary.delete} />
        </LoadingButton>
      )}
    </DeviceContainer>
  );
};

const Devices = () => {
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) return null;
  // const { devices, currentDevice } = currentUser;
  return (
    <div>
      <Text16 bold>
        <FormattedMessage {...title} />
      </Text16>
      {/* {(devices || []).map(device => {
        return (
          <Device
            key={device.id}
            device={device}
            isCurrent={!!currentDevice && currentDevice.id === device.id}
          />
        );
      })} */}
    </div>
  );
};

export default Devices;
