import { defineMessages } from 'react-intl';

import { Tradeable } from '@sorare/core/src/__generated__/globalTypes';
import { isTransferable } from '@sorare/core/src/lib/deal';

const messages = defineMessages({
  notTransferrable: {
    id: 'useCannotTransfer.notTransferrable',
    defaultMessage: 'This Card cannot be transferred yet',
  },
});

export default () => {
  return (token: { tradeableStatus: Tradeable }) => {
    if (!isTransferable(token)) {
      return messages.notTransferrable;
    }

    return null;
  };
};
