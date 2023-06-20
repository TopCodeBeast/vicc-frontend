import { defineMessages } from 'react-intl';

import { Sport } from '__generated__/globalTypes';

export const CARDS_REQUIREMENTS_BY_SPORT = {
  [Sport.FOOTBALL]: 5,
  [Sport.BASEBALL]: 7,
  [Sport.NBA]: 5,
};

export const messages = defineMessages({
  title: {
    id: 'Referral.title',
    defaultMessage: 'Invite a friend to Sorare',
  },
  subtitle: {
    id: 'Referral.subtitle',
    defaultMessage: "You'll both get a <span>free card</span>",
  },
  description: {
    id: 'Referral.description',
    defaultMessage:
      'When your friend collects 5 new cards via auctions or a starter pack in their first 30 days on Sorare, you’ll both win a free card.',
  },
});
