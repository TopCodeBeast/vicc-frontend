import { FormattedMessage } from 'react-intl';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { glossary } from '@sorare/core/src/lib/glossary';

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
