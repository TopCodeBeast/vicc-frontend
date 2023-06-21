import { faExternalLink } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import styled from 'styled-components';

import { Text16, Title6 } from '@core/atoms/typography';
import { EventsType } from '@core/lib/events/EventsType';
import useEvents from '@core/lib/events/useEvents';
import { isAbsolute } from '@core/lib/urls';
import { theme } from '@core/style/theme';

import ContentLink from '../../ContentLink';

export type Tile = {
  id: string;
  title: string;
  description: string;
  url: string;
  mobilePictureUrl: string;
  desktopPictureUrl: string;
};

type Props = {
  tiles: Tile[];
  bannerSlotName: EventsType['[Client] Click On Banner']['bannerSlotName'];
  className?: string;
};

const Root = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  & > * {
    flex: 0 0 80%;
    scroll-snap-align: center;
    &:first-child:last-child {
      flex: 0 0 100%;
    }
  }
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    overflow: none;
    & > * {
      flex: 1;
    }
  }
`;

export const Tiles = ({ tiles, bannerSlotName, className }: Props) => {
  return (
    <Root className={className}>
      {tiles.map((t, i) => (
        <Tile
          key={t.id}
          tile={t}
          analyticsParams={{
            bannerSlotName,
            tileIndex: i,
          }}
          size={tiles.length}
        />
      ))}
    </Root>
  );
};
export default Tiles;

type TileProps = {
  tile: Tile;
  analyticsParams: Pick<
    EventsType['[Client] Click On Banner'],
    'bannerSlotName' | 'tileIndex'
  >;
  size: number;
};

const Img = styled.img`
  border-radius: 8px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center;
  width: 100%;
  background: var(--c-neutral-300);
`;
const StyledRoot = styled.div`
  padding: 10px;
  transition: transform 0.1s ease-out;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    &:first-child:last-child ${Img} {
      aspect-ratio: 4 / 1;
    }
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  &:hover {
    color: inherit;
  }
`;
const ExternalLink = styled(FontAwesomeIcon)`
  margin-left: 10px;
`;

const Tile = ({ tile, size, analyticsParams }: TileProps) => {
  const track = useEvents();
  const { id, title, description, url, desktopPictureUrl, mobilePictureUrl } =
    tile;
  const tabletSize = `${theme.breakpoints.values.tablet}px`;

  const useDesktopPicture = size < 2;

  const trackClickOnBanner = useCallback(() => {
    track('[Client] Click On Banner', {
      ...analyticsParams,
      bannerId: id,
      bannerTitle: title,
      bannerType: 'tile',
    });
  }, [track, id, title, analyticsParams]);

  const isExternal =
    isAbsolute(url) &&
    typeof window !== 'undefined' &&
    window.location.hostname !== new URL(url).host;

  return (
    <StyledRoot>
      <ContentLink url={url} onClick={trackClickOnBanner}>
        <Container>
          <picture>
            {useDesktopPicture && (
              <source
                media={`(min-width: ${tabletSize})`}
                srcSet={desktopPictureUrl}
              />
            )}
            <source srcSet={mobilePictureUrl} />
            <Img
              src={useDesktopPicture ? desktopPictureUrl : mobilePictureUrl}
              alt=""
              loading="lazy"
            />
          </picture>
          <div>
            <Title6>
              {title}
              {isExternal && <ExternalLink icon={faExternalLink} size="xs" />}
            </Title6>
            <Text16>{description}</Text16>
          </div>
        </Container>
      </ContentLink>
    </StyledRoot>
  );
};
