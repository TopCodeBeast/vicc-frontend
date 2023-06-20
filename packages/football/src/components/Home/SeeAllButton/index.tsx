import { FormattedMessage } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { glossary } from '@sorare/core/src/lib/glossary';
import { Link } from '@sorare/core/src/routing/Link';

import { FootballEventTypes, useFootballEvents } from 'lib/events';

type Props = {
  context: FootballEventTypes['Click View More In Homepage']['context'];
  to: string;
};

export const SeeAllButton = ({ context, to }: Props) => {
  const track = useFootballEvents();
  return (
    <Button
      component={Link}
      color="transparent"
      small
      onClick={() => {
        track('Click View More In Homepage', { context });
      }}
      to={to}
    >
      <Text16 color="var(--c-neutral-600)">
        <FormattedMessage {...glossary.seeAll} />
      </Text16>
    </Button>
  );
};
