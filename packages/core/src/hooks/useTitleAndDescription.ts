import { useEffect } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { useSeoContext } from '@core/contexts/seo';

type useTitleAndDescriptionType = {
  (title: MessageDescriptor, description?: MessageDescriptor): void;
  /**
   * Set values to false until they are loaded
   */
  (
    title: MessageDescriptor,
    description: MessageDescriptor,
    values: false | Record<string, any>
  ): void;
};

export const useTitleAndDescription: useTitleAndDescriptionType = (
  title: MessageDescriptor,
  description?: MessageDescriptor,
  values?: false | Record<string, any>
) => {
  const { setPageMetadata } = useSeoContext();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (values !== false) {
      return setPageMetadata(formatMessage(title, values), {
        description: description
          ? formatMessage(description, values)
          : undefined,
      });
    }
    return () => {};
  }, [setPageMetadata, formatMessage, title, values, description]);
};
