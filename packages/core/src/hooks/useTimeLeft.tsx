import { intervalToDuration, isAfter } from 'date-fns';
import { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { useTickerContext } from '@core/contexts/ticker';

export const messages = defineMessages({
  monthsLeft: {
    id: 'TimeLeft.monthsLeft',
    defaultMessage: '{months}m {days}d',
  },
  daysLeft: {
    id: 'TimeLeft.daysLeft',
    defaultMessage: '{days}d {hours}h',
  },
  hoursLeft: {
    id: 'TimeLeft.hoursLeft',
    defaultMessage: '{hours}h {minutes}m',
  },
  minutesLeft: {
    id: 'TimeLeft.minutesLeft',
    defaultMessage: '{minutes}m {seconds}s',
  },
});

export type TimeLeftElements = {
  months: number;
  days: number;
  hours: number;
  minutes: string;
  seconds: string;
};

const TabNum = styled.span`
  font-variant-numeric: tabular-nums;
`;

const pad = (duration: number) => duration.toString().padStart(2, '0');

const split = (duration: Duration): TimeLeftElements => {
  return {
    months: duration.months || 0,
    days: duration.days || 0,
    hours: duration.hours || 0,
    minutes: pad(duration.minutes || 0),
    seconds: pad(duration.seconds || 0),
  };
};

export const useTimeLeft = (time: Date) => {
  const { formatMessage } = useIntl();
  const { now } = useTickerContext();
  const isEnded = isAfter(now, time);
  const elements = useMemo(
    () => split(intervalToDuration({ start: now, end: time })),
    [now, time]
  );

  let message;

  if (elements.months > 0) {
    message = messages.monthsLeft;
  } else if (elements.days > 0) {
    message = messages.daysLeft;
  } else if (elements.hours > 0) {
    message = messages.hoursLeft;
  } else {
    message = messages.minutesLeft;
  }

  return {
    elements,
    isEnded,
    message: formatMessage(message, {
      seconds: <TabNum>{elements.seconds}</TabNum>,
      minutes: <TabNum>{elements.minutes}</TabNum>,
      hours: <TabNum>{elements.hours}</TabNum>,
      days: <TabNum>{elements.days}</TabNum>,
      months: <TabNum>{elements.months}</TabNum>,
    }),
  };
};
