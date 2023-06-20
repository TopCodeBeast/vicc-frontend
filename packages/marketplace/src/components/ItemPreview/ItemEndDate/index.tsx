import { Caption } from '@sorare/core/src/atoms/typography';

import AuctionTimeLeft from 'components/auction/AuctionTimeLeft';

const EndDate = ({ endDate }: { endDate: Date }) => {
  return (
    <Caption color="var(--c-neutral-600)" as="span">
      <AuctionTimeLeft endDate={endDate.toISOString()} />
    </Caption>
  );
};

export default EndDate;
