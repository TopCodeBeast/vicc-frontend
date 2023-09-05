import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import { glossary } from '@sorare/core/src/lib/glossary';

import Points from '@football/components/so5/Points';

import { LineupStatus_vicc5Lineup } from './__generated__/index.graphql';

type Props = {
  vicc5Lineup: LineupStatus_vicc5Lineup;
  displayScore?: boolean;
  score?: number;
};

const messages = defineMessages({
  draft: {
    id: 'Lineup.Status.Draft',
    defaultMessage: 'Unconfirmed',
  },
  confirmed: {
    id: 'Lineup.Status.Confirmed',
    defaultMessage: 'Confirmed',
  },
});

export const LineupStatus = ({ vicc5Lineup, displayScore, score }: Props) => {
  const { formatMessage } = useIntl();

  const { draft, cancelledAt } = vicc5Lineup;
  const isCancelled = !!cancelledAt;
  const getLabel = () => {
    if (draft) {
      return messages.draft;
    }
    if (isCancelled) {
      return glossary.canceled;
    }
    return messages.confirmed;
  };

  if (displayScore && !isCancelled) {
    return (
      <Text16 bold>
        <Points score={score} />
      </Text16>
    );
  }
  return (
    <Tooltip
      title={
        cancelledAt
          ? formatMessage({
              id: 'Lineup.Status.cancelTooltipTitle',
              defaultMessage:
                'Lineup was canceled either by listing a player on the market or by the player being transferred',
            })
          : ''
      }
    >
      <Chip
        label={<FormattedMessage {...getLabel()} />}
        custom={
          draft || cancelledAt
            ? {
                color: 'white',
                background: 'var(--c-red-600)',
              }
            : {
                color: 'white',
                background: 'var(--c-green-600)',
              }
        }
        size="smaller"
      />
    </Tooltip>
  );
};

LineupStatus.fragments = {
  vicc5Lineup: gql`
    fragment LineupStatus_vicc5Lineup on Vicc5Lineup {
      id
      draft
      cancelledAt
    }
  ` as TypedDocumentNode<LineupStatus_vicc5Lineup>,
};
