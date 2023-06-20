import { FormattedMessage } from 'react-intl';

import { fantasy } from '@sorare/core/src/lib/glossary';

interface Props {
  score?: number | null;
}

const Points = ({ score }: Props) => (
  <FormattedMessage
    {...fantasy.points}
    values={{ score: Math.trunc((score || 0) * 100) / 100 }}
  />
);

export default Points;
