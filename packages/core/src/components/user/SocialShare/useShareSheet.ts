import { useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';

import { useIntlContext } from '@core/contexts/intl';
import { useSentryContext } from '@core/contexts/sentry';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';
import { fetchFile } from '@core/lib/files';
import toSnakeCase from '@core/lib/toSnakeCase';

const messages = defineMessages({
  notSupported: {
    id: 'ShareSheet.notSupported',
    defaultMessage: 'Your browser does not support sharing files',
  },
});

export default ({
  url,
  image,
  title,
  skip,
}: {
  url?: string;
  image?: string | null;
  title?: string;
  skip: boolean;
}) => {
  const { showNotification } = useSnackNotificationContext();
  const { sendSafeError } = useSentryContext();
  const { formatMessage } = useIntlContext();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File>();

  const shareProps = useMemo(() => {
    const props: {
      url?: string;
      text?: string;
      title?: string;
      files?: File[];
    } = { url, text: title, title };
    if (imageFile) {
      props.files = [imageFile];
    }
    return props;
  }, [imageFile, url, title]);

  const enabled = useMemo(() => {
    return navigator.canShare?.(shareProps);
  }, [shareProps]);

  useEffect(() => {
    if (skip || !enabled || !image || imageFile || loading) return;
    const fetchImage = async () => {
      setLoading(true);
      setImageFile(
        await fetchFile(image, toSnakeCase(title || `Vicc-${Date.now()}`))
      );
      setLoading(false);
    };

    fetchImage();
  }, [enabled, image, imageFile, loading, title, skip]);

  const share = useCallback(async () => {
    try {
      setLoading(true);
      if (enabled) {
        await navigator.share(shareProps);
      } else {
        showNotification(
          'errors',
          { errors: formatMessage(messages.notSupported) },
          { level: Level.INFO }
        );
      }
    } catch (error: any) {
      if (['AbortError', 'NotAllowedError'].includes(error.name)) return;

      showNotification(
        'errors',
        { errors: error.message },
        { level: Level.ERROR }
      );
      sendSafeError(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, formatMessage, shareProps, sendSafeError, showNotification]);
  return { share, enabled, loading };
};
