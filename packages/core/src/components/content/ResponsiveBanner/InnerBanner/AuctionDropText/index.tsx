import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@core/atoms/typography';
import { useIntlContext } from '@core/contexts/intl';

type Props = {
  live: boolean;
  date: Date;
};

const messages = defineMessages({
  timeLeft: {
    id: 'ResponsiveBanner.InnerBanner.Slide.AuctionDropText.timeLeft',
    defaultMessage: 'Live – {hours} left',
  },
  startsOn: {
    id: 'ResponsiveBanner.InnerBanner.Slide.AuctionDropText.startsOn',
    defaultMessage: 'Starts {date}',
  },
});

const Root = styled.div`
  display: flex;
  align-items: center;
`;
const LiveBall = styled.div`
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 100%;
  background-color: var(--c-red-600);
  margin-right: var(--half-unit);
`;

export const AuctionDropText = ({ live, date }: Props) => {
  const { formatDate, formatDistanceToNow } = useIntlContext();

  return (
    <Root>
      {live && <LiveBall />}
      <Text14 color="var(--c-yellow-600)">
        {live ? (
          <FormattedMessage
            {...messages.timeLeft}
            values={{
              hours: formatDistanceToNow(date, { addSuffix: false }),
            }}
          />
        ) : (
          <FormattedMessage
            {...messages.startsOn}
            values={{
              date: formatDate(date, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            }}
          />
        )}
      </Text14>
    </Root>
  );
};
