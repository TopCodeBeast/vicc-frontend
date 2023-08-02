import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  title: {
    id: 'ReferralProgramNotice.title',
    defaultMessage: 'Refer friends and win rewards',
  },
  description: {
    id: 'ReferralProgram.Notice.description',
    defaultMessage:
      'When your friend collects {count} new cards via auctions or a starter pack, you’ll both win free cards.',
  },
  conversionCreditDescription: {
    id: 'ReferralProgram.Notice.conversionCreditDescription',
    defaultMessage:
      'When your friend collects {count} new cards via auctions or a starter pack, you’ll both get up to <span>{amount} in credits</span>.',
  },
});
