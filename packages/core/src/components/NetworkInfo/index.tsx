import { faTimes, faWifiSlash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { Popup } from '@core/atoms/layout/Popup';
import { Text14 } from '@core/atoms/typography';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { theme } from '@core/style/theme';

const Wrapper = styled.div`
  color: var(--c-neutral-1000);
  padding: var(--double-unit);
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  border-radius: ${theme.radius.xs}px;
  .dark-theme & {
    border: 1px solid var(--c-neutral-400);
    background: var(--c-neutral-300);
  }
`;

const OfflineIcon = styled.div`
  opacity: 0.7;
`;

const Message = styled(Text14)`
  flex: 1;
`;

const CloseButton = styled.div`
  align-self: flex-start;
`;

const NetworkInfo = () => {
  const [offline, setIsOffline] = useState(false);
  const [shouldBeClosed, setShouldBeClosed] = useState(false);

  const {
    flags: { useOfflineSupport = false },
  } = useFeatureFlags();

  useEffect(() => {
    if (!useOfflineSupport) {
      return () => {};
    }
    function onlineHandler() {
      setIsOffline(false);
    }

    function offlineHandler() {
      setIsOffline(true);
    }

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, [useOfflineSupport]);

  if (!useOfflineSupport) {
    return null;
  }

  if (!offline) {
    if (shouldBeClosed) {
      setShouldBeClosed(false);
    }
    return null;
  }

  if (shouldBeClosed) {
    return null;
  }

  return (
    <Popup>
      <Wrapper>
        <OfflineIcon>
          <FontAwesomeIcon icon={faWifiSlash} />
        </OfflineIcon>
        <Message>
          <FormattedMessage
            id="NetworkInfo.message"
            defaultMessage="You're offline. Most actions might not work"
          />
        </Message>
        <CloseButton>
          <IconButton
            color="transparent"
            small
            icon={faTimes}
            onClick={() => {
              setShouldBeClosed(true);
            }}
          />
        </CloseButton>
      </Wrapper>
    </Popup>
  );
};

export default NetworkInfo;
