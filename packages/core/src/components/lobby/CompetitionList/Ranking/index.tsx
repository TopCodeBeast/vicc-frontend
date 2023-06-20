import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { useIntlContext } from '@sorare/core/src/contexts/intl';

export const LineupCount = ({
  count,
  compact = false,
}: {
  count: number;
  compact?: boolean;
}) => {
  const { formatNumber } = useIntlContext();
  return (
    <Text16 as="span">
      {formatNumber(count, {
        notation: compact ? 'compact' : 'standard',
      })}
    </Text16>
  );
};

const DidNotPlay = () => (
  <Text14 as="span" color="var(--c-neutral-600)">
    -
  </Text14>
);

export const Ranking = ({
  rank,
  count,
  compact = false,
}: {
  rank: number | undefined;
  count: number;
  compact?: boolean;
}) => {
  const { formatNumber } = useIntlContext();
  return (
    <span>
      {rank ? (
        <Text16 as="span" color="var(--c-brand-600)" bold>
          {formatNumber(rank)}
        </Text16>
      ) : (
        <DidNotPlay />
      )}
      /
      <LineupCount count={count} compact={compact} />
    </span>
  );
};
