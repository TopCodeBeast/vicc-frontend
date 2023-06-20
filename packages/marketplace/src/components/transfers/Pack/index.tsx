import { defineMessages, useIntl } from 'react-intl';

import NonComponentWithTooltip from '@sorare/core/src/atoms/tooltip/NonComponentWithTooltip';

import Icon from './Icon';

const messages = defineMessages({
  title: {
    id: 'transfers.pack.title',
    defaultMessage: 'Pack',
  },
});

export const Pack = () => {
  const { formatMessage } = useIntl();
  return (
    <NonComponentWithTooltip title={formatMessage(messages.title)}>
      <Icon />
    </NonComponentWithTooltip>
  );
};

export default Pack;
