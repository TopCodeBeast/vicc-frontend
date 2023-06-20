import { differenceInMinutes, parseISO } from 'date-fns';
import { useMemo } from 'react';
import styled from 'styled-components';

import { useTickerContext } from '@sorare/core/src/contexts/ticker';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';

interface Props {
  endDate: string;
  forceInlineLayout?: boolean;
}

const Layout = styled.span`
  text-align: left;
  white-space: nowrap;
  text-transform: lowercase;
`;

const ExpiringLayout = styled(Layout)`
  color: var(--c-red-800);
`;

export const AuctionTimeLeft = ({ endDate, forceInlineLayout }: Props) => {
  const parsedEndDate = useMemo(() => parseISO(endDate), [endDate]);

  const { now } = useTickerContext();

  const expiring = differenceInMinutes(parsedEndDate, now) < 2;

  return (
    <TimeLeft
      time={parsedEndDate}
      Layout={expiring ? ExpiringLayout : Layout}
      forceInlineLayout={forceInlineLayout}
      withExplicitTime={!expiring}
    />
  );
};

export default AuctionTimeLeft;
