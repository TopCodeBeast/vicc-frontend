import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import { LiveIndicator } from '@sorare/core/src/atoms/ui/LiveIndicator';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

import { GameEventStatus, gameStatusMessages } from '@football/lib/so5';

const ChipContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  startDate: string;
  status: GameEventStatus;
  Extras?: ReactNode;
  className?: string;
  hideDay?: boolean;
};

export const GameTimeStatusTag = ({ startDate, status, Extras }: Props) => {
  const { formatDate } = useIntlContext();
  const { formatMessage } = useIntl();

  const date = formatDate(startDate, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const gameSettled = [
    GameEventStatus.PLAYED,
    GameEventStatus.SUSPENDED,
    GameEventStatus.POSTPONED,
    GameEventStatus.CANCELLED,
  ].includes(status as GameEventStatus);

  if (status === GameEventStatus.PLAYING) {
    return (
      <Chip
        size="smaller"
        custom={{
          color: 'var(--c-neutral-1000)',
          background: 'var(--c-neutral-100)',
        }}
        label={
          <ChipContent>
            <LiveIndicator /> {Extras}
          </ChipContent>
        }
      />
    );
  }

  if (gameSettled) {
    return (
      <Chip
        outlined
        size="smaller"
        color={status === GameEventStatus.PLAYED ? 'black' : 'red'}
        label={
          <ChipContent>
            {formatMessage(gameStatusMessages[status])}
            {Extras}
          </ChipContent>
        }
      />
    );
  }

  return (
    <Chip
      color="black"
      size="smaller"
      custom={{
        color: 'var(--c-neutral-1000)',
        background: 'var(--c-neutral-100)',
      }}
      label={
        <ChipContent>
          {date} {Extras}
        </ChipContent>
      }
    />
  );
};
