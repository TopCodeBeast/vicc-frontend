import { useIntl } from 'react-intl';

type Props = {
  startDate: ISO8601DateTime | string;
  endDate: ISO8601DateTime | string;
};

const FixtureDateRange = ({ startDate, endDate }: Props) => {
  const { formatDateTimeRange } = useIntl();
  const range = formatDateTimeRange(new Date(startDate), new Date(endDate), {
    day: '2-digit',
    month: 'short',
  });
  return <>{range}</>;
};

export default FixtureDateRange;
