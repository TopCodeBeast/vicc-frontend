import { ComponentProps, ReactNode } from 'react';
import { defineMessages } from 'react-intl';

import { PRIVACY_POLICY, TERMS } from '@core/constants/routes';
import { useIntlContext } from '@core/contexts/intl';

import AcceptanceCheckbox from '../AcceptanceCheckbox';

const messages = defineMessages({
  termsAndPrivacyPolicyLabel: {
    id: 'PromptTermsDialog.termsAndPrivacyPolicyLabel',
    defaultMessage:
      'I agree to Sorare’s <LinkToTerms>Terms and Conditions</LinkToTerms> and that my personal data will be processed pursuant to the <LinkToPrivacyPolicy>Privacy Policy</LinkToPrivacyPolicy>',
  },
});

const LinkToTerms = (s: ReactNode) => (
  <a href={TERMS} target="_blank" rel="noreferrer">
    {s}
  </a>
);

const LinkToPrivacyPolicy = (s: ReactNode) => (
  <a href={PRIVACY_POLICY} target="_blank" rel="noreferrer">
    {s}
  </a>
);

export const AcceptTermsAndPrivacyPolicy = (
  props: Omit<ComponentProps<typeof AcceptanceCheckbox>, 'label'>
) => {
  const { formatMessage } = useIntlContext();

  return (
    <AcceptanceCheckbox
      {...props}
      label={formatMessage(messages.termsAndPrivacyPolicyLabel, {
        LinkToTerms,
        LinkToPrivacyPolicy,
      })}
    />
  );
};

export default AcceptTermsAndPrivacyPolicy;
