import { gql } from '@apollo/client';
import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormattedDate,
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16, Title4 } from '@sorare/core/src/atoms/typography';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import { Color } from '@sorare/core/src/style/types';

import { GameWeekTitle_so5Fixture } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled(Title4)`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const Subtitle = styled.div`
  margin-top: calc(-1 * var(--half-unit));
  display: flex;
  align-items: center;
  gap: var(--double-unit);
`;

const TimeLeftWrapper = styled(Text14)`
  display: flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-neutral-600);
  white-space: nowrap;
`;

const messages = defineMessages({
  ended: {
    id: 'GameWeekTitle.ended',
    defaultMessage: 'Ended',
  },
  live: {
    id: 'GameWeekTitle.live',
    defaultMessage: 'Live',
  },
  upcoming: {
    id: 'GameWeekTitle.upcoming',
    defaultMessage: 'Upcoming',
  },
});

interface NewType {
  label: MessageDescriptor;
  color: Color;
}

const statusLabels: Record<string, NewType> = {
  live: {
    label: messages.live,
    color: 'var(--c-static-red-300)',
  },
  past: {
    label: messages.ended,
    color: 'var(--c-static-green-300)',
  },
  upcoming: {
    label: messages.upcoming,
    color: 'var(--c-brand-300)',
  },
};

type Props = {
  so5Fixture: Nullable<GameWeekTitle_so5Fixture>;
  type: 'past' | 'live' | 'upcoming';
};

export const GameWeekTitle = ({ so5Fixture, type }: Props) => {
  const statusLabel = statusLabels[type];
  return (
    <Wrapper>
      {so5Fixture && (
        <Title>
          <FormattedDate
            value={new Date(so5Fixture.cutOffDate)}
            month="short"
            day="2-digit"
          />{' '}
          -{' '}
          <FormattedDate
            value={new Date(so5Fixture.endDate)}
            month="short"
            day="2-digit"
          />
        </Title>
      )}
      <Subtitle>
        <Text16 color={statusLabel.color} bold>
          <FormattedMessage {...statusLabel.label} />
        </Text16>
        {type === 'upcoming' && so5Fixture?.cutOffDate && (
          <TimeLeftWrapper as="div">
            <FontAwesomeIcon icon={faClock} />
            <TimeLeft time={new Date(so5Fixture?.cutOffDate)} />
          </TimeLeftWrapper>
        )}
      </Subtitle>
    </Wrapper>
  );
};

GameWeekTitle.fragments = {
  so5Fixture: gql`
    fragment GameWeekTitle_so5Fixture on Vicc5Fixture {
      slug
      cutOffDate
      endDate
    }
  `,
};
