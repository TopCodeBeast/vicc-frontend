import { differenceInDays, differenceInMilliseconds, parseISO } from 'date-fns';
import { FormattedDate, FormattedRelativeTime } from 'react-intl';

const PriceHistoryDate = ({ date }: { date: string }) => {
  const now = Date.now();
  const priceDate = parseISO(date);
  if (differenceInDays(now, priceDate) < 7)
    return (
      <FormattedRelativeTime
        value={differenceInMilliseconds(priceDate, now) / 1000}
        updateIntervalInSeconds={60}
      />
    );
  return <FormattedDate value={date} day="2-digit" month="short" />;
};

export default PriceHistoryDate;
