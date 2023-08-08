import { faWarning } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import { Progress } from '@core/atoms/loader/Progress';
import { Caption, Text16 } from '@core/atoms/typography';

type LayoutProps = { horizontal?: boolean };

const Wrapper = styled.div<LayoutProps>`
  display: grid;
  grid-template-areas:
    'label  points'
    'avg avg'
    'capbar capbar';
  grid-template-columns: 1fr max-content;
  grid-template-rows: 1fr auto 1fr;
  ${({ horizontal }) =>
    horizontal &&
    css`
      grid-template-areas: 'label  capbar points';
      grid-template-columns: max-content 1fr min-content;
      grid-template-rows: 1fr;
      gap: var(--double-unit);
    `}
`;

const AveragePoints = styled(Caption)`
  grid-area: avg;
  display: flex;
  justify-content: space-between;
  color: var(--c-static-neutral-600);
  transition: opacity 0.25s ease-in;
`;

const Label = styled.strong`
  grid-area: label;
  text-transform: uppercase;
`;

const ProgressStyled = styled(Progress)<{ $error: boolean }>`
  grid-area: capbar;
  margin-top: var(--unit);
  ${props =>
    props.$error &&
    `--color: var(--c-static-red-300);
    --backgroundColor: var(--c-static-red-300);
    `}
`;

const Error = styled(Label)`
  color: var(--c-static-red-300);
`;

const Value = styled.strong``;
const Total = styled.span`
  opacity: 0.5;
`;
const Points = ({
  value,
  total,
  title,
}: {
  value: number;
  total: number;
  title?: string;
}) => {
  return (
    <Text16 title={title}>
      {value >= 0 ? <Value>{value}</Value> : <Error>{value}</Error>}
      <Total>/{total}</Total>
    </Text16>
  );
};

export const calculateScoreTotal = (
  scores: (number | undefined)[],
  allowMVP: boolean
) => {
  const cardScores = scores.map(s => s ?? 0);
  const max = Math.max(...cardScores);
  return (
    cardScores.reduce((sum: number, current) => sum + (current ?? 0), 0) -
    (allowMVP ? max : 0)
  );
};

type Props = {
  cap: number;
  used: number;
  nbEmptySlots?: number;
  className?: string;
} & LayoutProps;

export const CapBar = ({
  cap,
  used,
  nbEmptySlots,
  horizontal,
  className,
}: Props) => {
  const { formatMessage } = useIntl();
  const averagePointsRemaining =
    nbEmptySlots === 0 || nbEmptySlots === undefined
      ? 0
      : Math.max(0, cap - used) / nbEmptySlots;

  return (
    <Wrapper className={className} horizontal={horizontal}>
      {used > cap && (
        <>
          <Error>
            <FontAwesomeIcon icon={faWarning} />{' '}
            <FormattedMessage
              id="capBar.error"
              defaultMessage="Points cap exceeded"
            />
          </Error>
          <Points value={cap - used} total={cap} />
        </>
      )}

      {used <= cap && (
        <>
          <Label>
            <FormattedMessage
              id="capBar.title"
              defaultMessage="Remaining points"
            />
          </Label>
          <Points
            value={cap - used}
            total={cap}
            title={formatMessage({
              id: 'capbar.budget.title',
              defaultMessage: 'Remaining budget points',
            })}
          />
        </>
      )}

      {nbEmptySlots !== undefined && (
        <AveragePoints style={{ opacity: averagePointsRemaining > 0 ? 1 : 0 }}>
          <FormattedMessage
            id="capbar.average"
            defaultMessage="Avg per open position ({nbEmptySlots})"
            values={{
              nbEmptySlots,
            }}
          />
          <strong
            title={formatMessage({
              id: 'capbar.average.title',
              defaultMessage: 'Average points remaining per open position',
            })}
          >
            {Math.floor(averagePointsRemaining)}
          </strong>
        </AveragePoints>
      )}

      <ProgressStyled
        min={0}
        max={cap}
        value={cap - used}
        skipStartAnimation
        $error={used > cap}
      />
    </Wrapper>
  );
};
