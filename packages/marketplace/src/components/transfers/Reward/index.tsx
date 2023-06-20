import { defineMessages, useIntl } from 'react-intl';

import NonComponentWithTooltip from '@sorare/core/src/atoms/tooltip/NonComponentWithTooltip';

import Icon from './Icon';

const messages = defineMessages({
  title: {
    id: 'transfers.gameReward.title',
    defaultMessage: 'Game Reward',
  },
});

export const Reward = () => {
  const { formatMessage } = useIntl();

  return (
    <NonComponentWithTooltip title={formatMessage(messages.title)}>
      <Icon />
    </NonComponentWithTooltip>
  );
};

export default Reward;
