import { useConfigContext } from '@core/contexts/config';
import ErrorBoundary from '@core/contexts/sentry/ErrorBoundary';
import { EventsType } from '@core/lib/events/EventsType';

import Tiles from '../Tiles';

type Props = {
  slotName: EventsType['[Client] Click On Banner']['bannerSlotName'];
  className?: string;
};

const MAX_NUMBER_OF_BANNERS = 3;

export const Carousel: React.FC<Props> = ({ slotName, className }) => {
  const { bannerSet } = useConfigContext();
  const slotBanners =
    bannerSet.find(banner => banner.title === slotName)?.banners || [];

  if (!slotBanners.length) {
    return null;
  }
  const cappedTiles = slotBanners.slice(0, MAX_NUMBER_OF_BANNERS);
  return (
    <Tiles
      tiles={cappedTiles}
      className={className}
      bannerSlotName={slotName}
    />
  );
};

const SafeCarousel = (props: Props) => (
  <ErrorBoundary>
    <Carousel {...props} />
  </ErrorBoundary>
);
export default SafeCarousel;
