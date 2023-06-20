import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { GameCoverageStatus } from '@sorare/core/src/__generated__/globalTypes';
import { Caption } from '@sorare/core/src/atoms/typography';
import { fantasy } from '@sorare/core/src/lib/glossary';

import { GameTimeStatusTag } from '@sorare/football/src/components/stats/GameTimeStatusTag';
import { GameEventStatus } from 'lib/so5';

const Root = styled.span`
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--unit);
  margin-right: var(--unit);
  flex: 2;
`;

export type StatusRowProps = {
  date: string;
  so5Fixture?: { shortDisplayName: string } | null;
  competitionName?: string;
  status: GameEventStatus;
  coverageStatus?: GameCoverageStatus;
  minute?: number;
  cardScore?: number | ReactNode;
  withDate?: boolean;
};

export const StatusRow = ({
  date,
  so5Fixture,
  competitionName,
  status,
  minute = 0,
  cardScore,
  withDate,
}: StatusRowProps) => {
  const { formatMessage, formatDate } = useIntl();
  const live = status === GameEventStatus.PLAYING;

  return (
    <>
      <Root>
        <GameTimeStatusTag
          status={status}
          startDate={date}
          Extras={
            <>
              {live && (
                <>
                  <span>{formatMessage(fantasy.live)}</span>
                  <span>{minute}&lsquo;</span>
                </>
              )}
              {so5Fixture?.shortDisplayName && (
                <>
                  <span>-</span>
                  <Caption>
                    <strong>{so5Fixture.shortDisplayName}</strong>
                  </Caption>
                </>
              )}
              {withDate && !live && (
                <>
                  <span>-</span>
                  <Caption>
                    <strong>
                      {formatDate(date, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </strong>
                  </Caption>
                </>
              )}
            </>
          }
        />
        {competitionName && (
          <Caption color="var(--c-neutral-600)">{competitionName}</Caption>
        )}
      </Root>
      {cardScore}
    </>
  );
};
