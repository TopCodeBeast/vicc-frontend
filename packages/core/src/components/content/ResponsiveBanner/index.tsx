import { useMemo } from 'react';

import { Vicc5LeaderboardType as So5LeaderboardType } from '__generated__/globalTypes';
import { useConfigContext } from '@core/contexts/config';
import ErrorBoundary from '@core/contexts/sentry/ErrorBoundary';
import { EventsType } from '@core/lib/events/EventsType';

import { InnerBanner } from './InnerBanner';
import { formatData } from './utils';

export const ResponsiveBanner = ({
  slotName,
  so5LeaderboardType,
}: {
  slotName: EventsType['[Client] Click On Banner']['bannerSlotName'];
  so5LeaderboardType?: So5LeaderboardType;
}) => {
  const { responsiveBannerSet } = useConfigContext();

  const formattedSlides = useMemo(
    () =>
      responsiveBannerSet
        .find(({ title }) => title === slotName)
        ?.responsiveBanners?.map(formatData)
        .filter(({ auctionDrop }) => {
          const isComposeTeam = !!so5LeaderboardType;
          const hasLeaderboardType =
            so5LeaderboardType &&
            auctionDrop?.so5LeaderboardTypes.includes(so5LeaderboardType);

          return (
            !auctionDrop?.isEnded &&
            (!isComposeTeam ||
              (isComposeTeam && auctionDrop?.isLive && hasLeaderboardType))
          );
        }) || [],
    [slotName, so5LeaderboardType, responsiveBannerSet]
  );

  if (!formattedSlides.length) {
    return null;
  }

  return (
    <ErrorBoundary>
      <InnerBanner
        analyticsParams={{
          bannerSlotName: slotName,
        }}
        slides={formattedSlides}
        isComposeTeam={!!so5LeaderboardType}
      />
    </ErrorBoundary>
  );
};
