import { TypedDocumentNode, gql } from '@apollo/client';
import { isFuture, isPast } from 'date-fns';
import { FormattedDate, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { fantasy } from '@sorare/core/src/lib/glossary';

import { LiveDot } from '@football/components/so5/LiveDot';

import { LineupDate_fixture } from './__generated__/index.graphql';

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  font: var(--t-12);
  color: var(--c-neutral-600);
`;

type Props = {
  fixture: LineupDate_fixture;
};

export const LineupDate = ({ fixture }: Props) => {
  const { formatDistanceToNowStrict } = useIntlContext();
  const startDate = new Date(fixture.startDate);
  const endDate = new Date(fixture.endDate);
  const isLive = isPast(startDate) && isFuture(endDate);
  return (
    <Wrapper>
      {isLive && (
        <>
          <LiveDot />
          <FormattedMessage {...fantasy.live} />
        </>
      )}

      <span>
        {isLive ? (
          <FormattedMessage
            id="LineupDate.RemainingTimes"
            defaultMessage="{time} left"
            values={{
              time: formatDistanceToNowStrict(endDate, { addSuffix: false }),
            }}
          />
        ) : (
          <FormattedDate
            value={startDate}
            month="short"
            day="numeric"
            hour="numeric"
            minute="numeric"
            {...(startDate.getFullYear() !== new Date().getFullYear()
              ? { year: 'numeric' }
              : {})}
          />
        )}
      </span>
      <span>- {fixture.shortDisplayName}</span>
    </Wrapper>
  );
};

LineupDate.fragments = {
  fixture: gql`
    fragment LineupDate_fixture on Vicc5Fixture {
      slug
      id
      startDate
      endDate
      shortDisplayName
    }
  ` as TypedDocumentNode<LineupDate_fixture>,
};
