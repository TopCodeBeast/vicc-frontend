import { ComponentProps } from 'react';
import { defineMessages } from 'react-intl';

import { useIntlContext } from 'contexts/intl';

import AcceptanceCheckbox from '../AcceptanceCheckbox';

const messages = defineMessages({
  iAgreeToAgeLimit: {
    id: 'AcceptAgeLimit.iAgreeToAgeLimit',
    defaultMessage: 'I certify that I am 18 years old or older.',
  },
});

export const AcceptAgeLimit = (
  props: Omit<ComponentProps<typeof AcceptanceCheckbox>, 'label'>
) => {
  const { formatMessage } = useIntlContext();

  return (
    <AcceptanceCheckbox
      {...props}
      label={formatMessage(messages.iAgreeToAgeLimit)}
    />
  );
};

export default AcceptAgeLimit;
