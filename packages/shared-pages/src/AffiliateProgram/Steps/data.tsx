import { FormattedMessage } from 'react-intl';

export const steps = [
  {
    name: '01.',
    title: (
      <FormattedMessage
        id="AffiliateProgram.step1Title"
        defaultMessage="Become an Affiliate"
      />
    ),
    subtitle: (
      <FormattedMessage
        id="AffiliateProgram.step1Subtitle"
        defaultMessage="It's easy and free to join. After your application is approved, you’ll get access to promotional assets."
      />
    ),
  },
  {
    name: '02.',
    title: (
      <FormattedMessage
        id="AffiliateProgram.step2Title"
        defaultMessage="Promote Vicc"
      />
    ),
    subtitle: (
      <FormattedMessage
        id="AffiliateProgram.step2Subtitle"
        defaultMessage="Create content (videos, articles, ads, etc.) and link to your Vicc affiliate link."
      />
    ),
  },
  {
    name: '03.',
    title: (
      <FormattedMessage
        id="AffiliateProgram.step3Title"
        defaultMessage="Earn commissions"
      />
    ),
    subtitle: (
      <FormattedMessage
        id="AffiliateProgram.step3Subtitle"
        defaultMessage="Get up to 10% in commissions for every qualifying Card purchase you’ve brought to Vicc."
      />
    ),
  },
];
