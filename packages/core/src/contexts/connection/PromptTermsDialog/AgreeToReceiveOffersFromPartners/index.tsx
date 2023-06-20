import { ComponentProps } from 'react';
import { defineMessages } from 'react-intl';

import { useIntlContext } from 'contexts/intl';

import AcceptanceCheckbox from '../AcceptanceCheckbox';

const messages = defineMessages({
  partnersLabel: {
    id: 'PromptTermsDialog.partnersLabel',
    defaultMessage:
      'I agree to share my information with Sorare’s trusted partners for marketing and promotional purposes',
  },
});

export const AgreeToReceiveOffersFromPartners = (
  props: Omit<ComponentProps<typeof AcceptanceCheckbox>, 'label'>
) => {
  const { formatMessage } = useIntlContext();

  return (
    <AcceptanceCheckbox
      {...props}
      label={formatMessage(messages.partnersLabel)}
    />
  );
};

export default AgreeToReceiveOffersFromPartners;
