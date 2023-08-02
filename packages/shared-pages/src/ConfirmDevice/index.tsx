import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog, { Actions } from '@sorare/core/src/atoms/layout/Dialog';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { HOME } from '@sorare/core/src/constants/routes';
import { useAuthContext } from '@sorare/core/src/contexts/auth';
import { useConnectionContext } from '@sorare/core/src/contexts/connection';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useQueryString from '@sorare/core/src/hooks/useQueryString';
import { glossary } from '@sorare/core/src/lib/glossary';
import { mustAcceptTermsOfServiceFlag } from '@sorare/core/src/lib/mustAcceptTermsOfServiceFlag';

const messages = defineMessages({
  title: {
    id: 'NewDeviceConfirmationError.title',
    defaultMessage: 'New Device Confirmation',
  },
  description: {
    id: 'NewDeviceConfirmationError.description',
    defaultMessage:
      'It looks like the link you are using is no longer valid. Please use the last link sent to you when logging in.',
  },
  openLinkInSameDevice: {
    id: 'NewDeviceConfirmationError.openLinkInSameDevice',
    defaultMessage:
      'Please open the link with the same device you are trying to log in with.',
  },
});

export const ConfirmDevice = () => {
  const { confirmDevice } = useAuthContext();
  const { currentUser } = useCurrentUserContext();
  const { promptTerms } = useConnectionContext();
  const [error, setError] = useState();
  const { formatMessage } = useIntlContext();
  const navigate = useNavigate();
  const confirmationToken = useQueryString('token');
  const {
    flags: { lastTermsOfServiceUpdatedAt = '' },
  } = useFeatureFlags();

  const mustAcceptTermsFlag = mustAcceptTermsOfServiceFlag(
    lastTermsOfServiceUpdatedAt
  );

  const handleClose = useCallback(() => {
    navigate(HOME);
  }, [navigate]);

  useEffect(() => {
    if (confirmationToken) {
      confirmDevice(confirmationToken).then(response => {
        if (response.error) {
          setError(response.error);
        } else {
          // FIXME: @gbreux find out why we need it (SO5-1267)
          setTimeout(() => {
            navigate(HOME);
            if (currentUser?.mustAcceptTcus && mustAcceptTermsFlag) {
              promptTerms({
                closable: true,
              });
            }
          }, 250);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // No dependency added because we want it to be called only once

  if (error) {
    return (
      <Dialog
        title={formatMessage(messages.title)}
        scroll="body"
        open
        onClose={handleClose}
      >
        <Text16>
          <FormattedMessage {...messages.description} />
        </Text16>
        <br />
        <Text16>
          <FormattedMessage {...messages.openLinkInSameDevice} />
        </Text16>
        <Actions>
          <Button stroke onClick={handleClose} color="blue">
            <FormattedMessage {...glossary.ok} />
          </Button>
        </Actions>
      </Dialog>
    );
  }

  return null;
};

export default ConfirmDevice;
