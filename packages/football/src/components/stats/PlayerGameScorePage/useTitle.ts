import { useIntl } from 'react-intl';

import { fantasy } from '@sorare/core/src/lib/glossary';

export default (gameWeek?: number) => {
  const { formatMessage } = useIntl();
  return formatMessage(fantasy.playerPerformance, {
    gameWeek,
  });
};
