import { FormattedMessage } from 'react-intl';

import { Text16 } from '@core/atoms/typography';
import { glossary } from '@core/lib/glossary';

type Props = { liveRanking: number };

export const Ranking = ({ liveRanking }: Props) => {
  return (
    <Text16 bold>
      {liveRanking > 0 ? (
        <FormattedMessage
          {...glossary.ordinal}
          values={{ ordinal: liveRanking }}
        />
      ) : (
        '-'
      )}
    </Text16>
  );
};
