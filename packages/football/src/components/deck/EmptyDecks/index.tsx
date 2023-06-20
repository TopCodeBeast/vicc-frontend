import { defineMessages } from 'react-intl';

import EmptyContent from '@sorare/core/src/contexts/intl/EmptyContent';

const messages = defineMessages({
  message: {
    id: 'EmptyDecks.noCustomDecks',
    defaultMessage: 'No squads yet',
  },
});

export const EmptyDecks = () => {
  return <EmptyContent message={messages.message} />;
};

export default EmptyDecks;
