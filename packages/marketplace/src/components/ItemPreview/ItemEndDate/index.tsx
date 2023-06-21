import { Caption } from '@sorare/core/src/atoms/typography';

import AuctionTimeLeft from '@marketplace/components/auction/AuctionTimeLeft';

const EndDate = ({
  endDate,
  withExplicitTime,
}: {
  endDate: Date;
  withExplicitTime?: boolean;
}) => {
  return (
    <Caption color="var(--c-neutral-600)" as="span">
      <AuctionTimeLeft
        endDate={endDate.toISOString()}
        withExplicitTime={withExplicitTime}
      />
    </Caption>
  );
};

export default EndDate;
