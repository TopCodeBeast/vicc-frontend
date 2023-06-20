import { ComponentProps } from 'react';
import { defineMessages } from 'react-intl';

import { PRIVACY_POLICY, TERMS } from '@sorare/core/src/constants/routes';
import { useIntlContext } from 'contexts/intl';

import AcceptanceCheckbox from '../AcceptanceCheckbox';

const messages = defineMessages({
  termsAndPrivacyPolicyLabel: {
    id: 'PromptTermsDialog.termsAndPrivacyPolicyLabel',
    defaultMessage:
      'I agree to Sorare’s <LinkToTerms>Terms and Conditions</LinkToTerms> and that my personal data will be processed pursuant to the <LinkToPrivacyPolicy>Privacy Policy</LinkToPrivacyPolicy>',
  },
});

const LinkToTerms = (s: string) => (
  <a href={TERMS} target="_blank" rel="noreferrer">
    {s}
  </a>
);

const LinkToPrivacyPolicy = (s: string) => (
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
