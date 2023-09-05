import { generatePath } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import {
  FOOTBALL_USER_GALLERY,
  MLB_USER_GALLERY,
  NBA_USER_GALLERY,
} from '@core/constants/routes';

type GalleryPathFactory = (slug: string) => string;

export type GalleryTypes = Sport;

const defaultGallery: GalleryPathFactory = slug =>
  generatePath(FOOTBALL_USER_GALLERY, { slug });

const galleryPathFactories: Readonly<{
  [key in GalleryTypes]: GalleryPathFactory;
}> = {
  [Sport.BASEBALL]: slug => generatePath(MLB_USER_GALLERY, { slug }),
  [Sport.NBA]: slug => generatePath(NBA_USER_GALLERY, { slug }),
  [Sport.CRICKET]: slug => generatePath(FOOTBALL_USER_GALLERY, { slug }),
};

export const galleryPathFromSport = (slug: string, sport: Sport) => {
  const galleryPathFactory = galleryPathFactories[sport] || defaultGallery;
  return galleryPathFactory(slug);
};
